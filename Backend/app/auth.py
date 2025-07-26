from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jwt
import bcrypt
import secrets

from app.database import get_db
from app.models import User
from app.schemas import LoginRequest, LoginResponse, UserCreate, EmailRequest, VerifyEmailRequest
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.email_utils import send_verification_email

from datetime import datetime, timedelta

from app.redis_config import redis_client



SECRET_KEY = "mysecret"
ALGORITHM = "HS256"

router = APIRouter(prefix="/api/auth", tags=["Auth"])

security = HTTPBearer()

# 🔹 Helper: Generate JWT with user_id
def create_jwt_token(user_id: int, name: str):
    payload = {
        "user_id": user_id,
        "name": name,
        "exp": datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if not bcrypt.checkpw(login_data.password.encode(), user.password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Incorrect password")

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")

    token = create_jwt_token(user.id, user.name)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id
    }

# 🔹 Helper: Decode JWT and get user data
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# 🔹 API: Register User
@router.post("/register")
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="User already exists")

    hashed_password = bcrypt.hashpw(user_data.password.encode(), bcrypt.gensalt()).decode()
    verification_token = secrets.token_urlsafe(32)

    new_user = User(
        name=user_data.name,
        password=hashed_password,
        email=user_data.email,
        is_verified=False,
        verification_token=verification_token
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    await send_verification_email(user_data.email, verification_token)

    return {"message": "Verification email sent. Please check your inbox."}


@router.post("/resend-verification")
async def resend_verification(data: EmailRequest, db: Session = Depends(get_db)):
    email = data.email
    print(f"[resend] Requested verification for {email}")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified:
        raise HTTPException(status_code=400, detail="User is already verified")

    redis_key = f"verify_throttle:{email}"
    if redis_client.exists(redis_key):
        seconds_left = redis_client.ttl(redis_key)
        raise HTTPException(
            status_code=429,
            detail=f"Please wait {seconds_left} seconds before resending verification email."
        )

    if not user.verification_token:
        user.verification_token = secrets.token_urlsafe(32)
        db.commit()

    await send_verification_email(email, user.verification_token)
    redis_client.setex(redis_key, timedelta(minutes=3), value="sent")

    return {"message": "Verification email resent."}


# 🔹 API: Verify Token
@router.get("/verify-token")
def verify_token(user: dict = Depends(get_current_user)):
    return {"message": "Token is valid", "user": user}

@router.post("/verify-email")
async def verify_email(request: VerifyEmailRequest, db: Session = Depends(get_db)):
    token = request.token  # ✅ Extract token from body
    user = db.query(User).filter(User.verification_token == token).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")

    user.is_verified = True
    user.verification_token = None
    db.commit()

    return {"message": "Email verified successfully"}
