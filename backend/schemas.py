from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from models import UserRole, TransactionType

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    setup_completed: bool

class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    monthly_income: Optional[int] = None
    savings_goal: Optional[str] = None
    dream_item: Optional[str] = None
    max_spending: Optional[int] = None

class UserOut(BaseModel):
    username: str
    email: Optional[str]
    role: UserRole
    monthly_income: Optional[int]
    savings_goal: Optional[str]
    dream_item: Optional[str]
    max_spending: Optional[int]
    setup_completed: bool

class UserSummary(BaseModel):
    id: int
    username: str
    email: Optional[str]
    role: UserRole

class AccountCreate(BaseModel):
    username: str
    email: str
    password: str = "123"
    role: UserRole

class TransactionCreate(BaseModel):
    amount: float
    type: TransactionType
    category: str
    description: str

class TransactionOut(BaseModel):
    id: int
    amount: float
    type: TransactionType
    category: str
    description: str
    date: datetime

    class Config:
        from_attributes = True

class DashboardData(BaseModel):
    username: str
    role: UserRole
    monthly_income: Optional[int]
    max_spending: Optional[int]
    total_balance: float
    total_income: float
    total_expenses: float
    recent_transactions: List[TransactionOut]
    message: str
    admin_stats: Optional[str] = None
    vip_perks: Optional[str] = None
    free_status: Optional[str] = None
    vip_users: Optional[List[UserSummary]] = None
    free_users: Optional[List[UserSummary]] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    provider: Optional[str] = "openai"

class ChatResponse(BaseModel):
    response: str
