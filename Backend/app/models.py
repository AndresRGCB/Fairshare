from sqlalchemy import Column, Integer, String, ForeignKey, Float, JSON, DateTime, Boolean, Date, Index
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from sqlalchemy.sql import func

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    name = Column(String, nullable=False)
    password = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    verification_token = Column(String(255), nullable=True)

    __table_args__ = (
        Index('idx_user_email', 'email', unique=True),
    )

    labels = relationship("Label", back_populates="user")
    expenses = relationship("Expense", back_populates="user", cascade="all, delete-orphan")  
    recurring_expenses = relationship("RecurringExpense", back_populates="user", cascade="all, delete-orphan")
    installment_expenses = relationship("InstallmentExpense", back_populates="user", cascade="all, delete-orphan")


class Label(Base):
    __tablename__ = "labels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    __table_args__ = (
        Index('idx_label_user_name', 'user_id', 'name'),
    )

    user = relationship("User", back_populates="labels")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String, nullable=False)
    is_recurring = Column(Boolean, default=False)
    is_installment = Column(Boolean, default=False)
    num_installments = Column(Integer, nullable=True)
    notes = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    labels = Column(JSON, nullable=True, default=[])

    __table_args__ = (
        Index('idx_expense_user_date', 'user_id', 'date'),
        Index('idx_expense_type', 'type'),
        Index('idx_expense_recurring', 'is_recurring'),
        Index('idx_expense_installment', 'is_installment'),
    )

    user = relationship("User", back_populates="expenses")


class RecurringExpense(Base):
    __tablename__ = "recurring_expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    is_recurring = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    labels = Column(JSON, nullable=True, default=[])

    __table_args__ = (
        Index('idx_recurring_user_active', 'user_id', 'is_active'),
        Index('idx_recurring_created', 'created_at'),
    )

    user = relationship("User", back_populates="recurring_expenses")


class InstallmentExpense(Base):
    __tablename__ = "installment_expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    is_installment = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    num_installments = Column(Integer, nullable=False)
    begin_date = Column(Date, nullable=False, default=func.current_date())
    end_date = Column(Date, default=func.current_date())
    labels = Column(JSON, nullable=True, default=[])

    __table_args__ = (
        Index('idx_installment_user_active', 'user_id', 'is_active'),
        Index('idx_installment_dates', 'begin_date', 'end_date'),
    )

    user = relationship("User", back_populates="installment_expenses")
