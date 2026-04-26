from sqlalchemy import Column, Integer, String, Enum as SQLEnum, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum
from database import Base

class UserRole(str, Enum):
    Admin = "Admin"
    VIP = "VIP"
    Free = "Free"

class TransactionType(str, Enum):
    Income = "Income"
    Expense = "Expense"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String)
    role = Column(SQLEnum(UserRole), default=UserRole.Free)
    monthly_income = Column(Integer, nullable=True)
    savings_goal = Column(String, nullable=True)
    dream_item = Column(String, nullable=True)
    max_spending = Column(Integer, nullable=True)
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    type = Column(SQLEnum(TransactionType))
    category = Column(String)
    description = Column(String)
    date = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="transactions")
