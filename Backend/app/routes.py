from fastapi import APIRouter, Depends
from app.auth import create_jwt_token
from app.models import User
from app.database import SessionLocal

router = APIRouter()
