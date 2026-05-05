from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from models import UserRole, TransactionType, AccountType, ChatRole

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str
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

class UserAccountCreate(BaseModel):
    username: str
    email: str
    password: str = "123"
    role: UserRole

class AccountCreate(BaseModel):
    name: str
    type: AccountType
    balance: Optional[float] = 0.0
    max_spending: Optional[int] = None

class AccountUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[AccountType] = None
    balance: Optional[float] = None
    max_spending: Optional[int] = None

class AccountOut(BaseModel):
    id: int
    name: str
    type: AccountType
    balance: float
    max_spending: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    amount: float
    type: TransactionType
    category: str
    description: str
    account_id: int

class TransactionOut(BaseModel):
    id: int
    amount: float
    type: TransactionType
    category: str
    description: str
    date: datetime
    account_id: Optional[int]

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
    accounts: Optional[List[AccountOut]] = None
    message: str
    admin_stats: Optional[str] = None
    vip_perks: Optional[str] = None
    free_status: Optional[str] = None
    vip_users: Optional[List[UserSummary]] = None
    free_users: Optional[List[UserSummary]] = None

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class RegisterResponse(BaseModel):
    message: str

class LoginRequest(BaseModel):
    username: str
    password: str

class GoogleLoginRequest(BaseModel):
    code: str
    redirect_uri: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatMessageOut(BaseModel):
    id: int
    role: ChatRole
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True

class ChatSessionOut(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    provider: Optional[str] = "openai"
    session_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    session_id: Optional[int] = None
