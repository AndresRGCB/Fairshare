import pytest
from unittest.mock import AsyncMock
from app.models import User

@pytest.fixture
def user_payload():
    return {
        "email": "test@example.com",
        "name": "Test User",
        "password": "supersecret"
    }

def test_register_user_success(client, db_session, user_payload, monkeypatch):
    monkeypatch.setattr("app.auth.send_verification_email", AsyncMock())

    response = client.post("/api/auth/register", json=user_payload)

    assert response.status_code == 200
    assert response.json() == {
        "message": "Verification email sent. Please check your inbox."
    }

    # Check user is in the DB
    user = db_session.query(User).filter_by(email=user_payload["email"]).first()
    assert user is not None
    assert user.is_verified is False
    assert user.verification_token is not None

def test_login_success(client, db_session, user_payload):
    # Hash the password
    from app.auth import bcrypt
    hashed_password = bcrypt.hashpw(user_payload["password"].encode(), bcrypt.gensalt()).decode()

    # Create user directly in the test database
    user = User(
        email=user_payload["email"],
        name=user_payload["name"],
        password=hashed_password,
        is_verified=True,
        verification_token=None
    )
    db_session.add(user)
    db_session.flush()
    db_session.commit()

    # Now send a login request
    response = client.post("/api/auth/login", json={
        "email": user_payload["email"],
        "password": user_payload["password"]
    })

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_register_user_with_existing_email(client, db_session, user_payload, monkeypatch):
    from app.auth import bcrypt
    hashed_password = bcrypt.hashpw(user_payload["password"].encode(), bcrypt.gensalt()).decode()
    existing_user = User(
        email=user_payload["email"],
        name=user_payload["name"],
        password=hashed_password,
        is_verified=False,
        verification_token="sometoken"
    )
    db_session.add(existing_user)
    db_session.commit()

    monkeypatch.setattr("app.auth.send_verification_email", AsyncMock())
    response = client.post("/api/auth/register", json=user_payload)

    assert response.status_code == 409
    assert response.json()["detail"] == "User already exists"

def test_login_with_wrong_password(client, db_session, user_payload):
    from app.auth import bcrypt
    hashed_password = bcrypt.hashpw("correctpass".encode(), bcrypt.gensalt()).decode()
    user = User(
        email=user_payload["email"],
        name=user_payload["name"],
        password=hashed_password,
        is_verified=True
    )
    db_session.add(user)
    db_session.commit()

    response = client.post("/api/auth/login", json={
        "email": user_payload["email"],
        "password": "wrongpass"
    })

    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect password"

def test_login_unverified_user(client, db_session, user_payload):
    from app.auth import bcrypt
    hashed_password = bcrypt.hashpw(user_payload["password"].encode(), bcrypt.gensalt()).decode()
    user = User(
        email=user_payload["email"],
        name=user_payload["name"],
        password=hashed_password,
        is_verified=False
    )
    db_session.add(user)
    db_session.commit()

    response = client.post("/api/auth/login", json={
        "email": user_payload["email"],
        "password": user_payload["password"]
    })

    assert response.status_code == 403
    assert response.json()["detail"] == "Email not verified"