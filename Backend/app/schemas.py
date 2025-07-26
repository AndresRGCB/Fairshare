from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date  # make sure this is imported
import datetime


# Define the expected structure of the login request
class LoginRequest(BaseModel):
    email: str
    password: str

# Define the structure of the login response
class LoginResponse(BaseModel):
    access_token: str
    token_type: str


class UserCreate(BaseModel):
    name: str
    email:str
    password: str
    
    
# 🔹 Schema for Creating Labels
class LabelCreate(BaseModel):
    name: str
    color: str
    user_id: int

# 🔹 Schema for Returning Labels
class LabelResponse(BaseModel):
    id: int
    name: str
    color: str
    user_id: int

    class Config:
        orm_mode = True  # Allows returning ORM objects as JSON
        
        
class LabelSchema(BaseModel):
    name: str
    color: str

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    type: str
    is_recurring: str
    recurring_frequency: Optional[str] = None
    is_installment: str
    num_installments: Optional[int] = None
    date: Optional[datetime.date] = None
    notes: Optional[str] = None
    labels: Optional[List[LabelSchema]] = []
    user_id: int

    class Config:
        from_attributes = True

# 🔹 Expense Response (Used in /get)
class ExpenseResponse(ExpenseCreate):
    id: int
    user_id: int
    
    
class EmailRequest(BaseModel):
    email: EmailStr
    
class VerifyEmailRequest(BaseModel):
    token: str