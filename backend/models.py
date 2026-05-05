from sqlalchemy import Column, Integer, String, Enum as SQLEnum, ForeignKey, Float, DateTime, Text, UniqueConstraint
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

class AccountType(str, Enum):
    Bank = "Bank"
    EWallet = "EWallet"
    Cash = "Cash"

class ChatRole(str, Enum):
    User = "User"
    Assistant = "Assistant"

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
    accounts = relationship("Account", back_populates="user", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")

class Account(Base):
    __tablename__ = "accounts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    type = Column(SQLEnum(AccountType))
    balance = Column(Float, default=0.0)
    max_spending = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account", cascade="all, delete-orphan")

    __table_args__ = (UniqueConstraint('user_id', 'name', name='_user_account_name_uc'),)

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=True)
    amount = Column(Float)
    type = Column(SQLEnum(TransactionType))
    category = Column(String)
    description = Column(String)
    date = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="transactions")
    account = relationship("Account", back_populates="transactions")

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, default="New Chat")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

class PaymentOrder(Base):
    __tablename__ = "payment_orders"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"))
    role = Column(SQLEnum(ChatRole))
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("ChatSession", back_populates="messages")
