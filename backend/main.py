import os
import bcrypt
from datetime import datetime, timedelta
from enum import Enum
from typing import Optional, List

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Enum as SQLEnum, ForeignKey, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session, relationship
from dotenv import load_dotenv

load_dotenv()

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postubak:postubak123@localhost:5432/ubak_db")
SECRET_KEY = os.getenv("SECRET_KEY", "a_very_secret_key_change_me_in_production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Database setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
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

Base.metadata.create_all(bind=engine)

# Security helper functions
def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Schemas
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

# App initialization
app = FastAPI()

# Enhanced CORS to be more resilient
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost",
        "http://127.0.0.1",
        "http://localhost:80",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# Routes
@app.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.username == login_data.username).first()
        if not user or not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Safe check for new columns to avoid 500 if migration hasn't run
        setup_completed = True
        if user.role != UserRole.Admin:
            try:
                fields = [user.monthly_income, user.savings_goal, user.dream_item, user.max_spending]
                if any(v is None for v in fields):
                    setup_completed = False
            except Exception:
                # If columns don't exist yet, default to false
                setup_completed = False

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username, "role": user.role.value}, expires_delta=access_token_expires
        )
        return {
            "access_token": access_token, 
            "token_type": "bearer", 
            "role": user.role.value,
            "setup_completed": setup_completed
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        # Log the actual error for debugging
        print(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Server Error: {str(e)}. Make sure your database is updated."
        )

@app.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    setup_completed = True
    if current_user.role != UserRole.Admin:
        if any(v is None for v in [current_user.monthly_income, current_user.savings_goal, current_user.dream_item, current_user.max_spending]):
            setup_completed = False
            
    return {
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "monthly_income": current_user.monthly_income,
        "savings_goal": current_user.savings_goal,
        "dream_item": current_user.dream_item,
        "max_spending": current_user.max_spending,
        "setup_completed": setup_completed
    }

@app.put("/me")
async def update_me(update_data: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if update_data.username:
        # Check if username exists
        existing = db.query(User).filter(User.username == update_data.username, User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
        current_user.username = update_data.username
    
    if update_data.email:
        existing = db.query(User).filter(User.email == update_data.email, User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already taken")
        current_user.email = update_data.email

    if update_data.monthly_income is not None:
        current_user.monthly_income = update_data.monthly_income
    if update_data.savings_goal is not None:
        current_user.savings_goal = update_data.savings_goal
    if update_data.dream_item is not None:
        current_user.dream_item = update_data.dream_item
    if update_data.max_spending is not None:
        current_user.max_spending = update_data.max_spending
        
    db.commit()
    return {"message": "Profile updated successfully"}

@app.post("/transactions", response_model=TransactionOut)
async def create_transaction(transaction: TransactionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_transaction = Transaction(**transaction.model_dump(), user_id=current_user.id)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.get("/transactions", response_model=List[TransactionOut])
async def get_transactions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Transaction).filter(Transaction.user_id == current_user.id).order_by(Transaction.date.desc()).all()

@app.get("/dashboard", response_model=DashboardData)
async def read_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    
    total_income = sum(t.amount for t in transactions if t.type == TransactionType.Income)
    total_expenses = sum(t.amount for t in transactions if t.type == TransactionType.Expense)
    
    # Total balance = Initial baseline (monthly_income) + sum of all transaction changes
    total_balance = float(current_user.monthly_income or 0) + total_income - total_expenses

    recent = db.query(Transaction).filter(Transaction.user_id == current_user.id).order_by(Transaction.date.desc()).limit(10).all()

    data = {
        "username": current_user.username,
        "role": current_user.role,
        "monthly_income": current_user.monthly_income,
        "max_spending": current_user.max_spending,
        "total_balance": total_balance,
        "total_income": total_income,
        "total_expenses": total_expenses,
        "recent_transactions": recent,
        "message": f"Welcome back, {current_user.username}!"
    }
    
    if current_user.role == UserRole.Admin:
        data["admin_stats"] = "Showing sensitive system-wide metrics only visible to Admin."
        users = db.query(User).all()
        data["vip_users"] = [UserSummary(id=u.id, username=u.username, email=u.email, role=u.role) for u in users if u.role in (UserRole.VIP, "VIP")]
        data["free_users"] = [UserSummary(id=u.id, username=u.username, email=u.email, role=u.role) for u in users if u.role in (UserRole.Free, "Free")]
    elif current_user.role == UserRole.VIP:
        data["vip_perks"] = "As a VIP, you have access to advanced AI projections and lower transaction fees."
    else:
        data["free_status"] = "You're using the standard plan. Upgrade to VIP to see advanced insights!"

    return data

@app.post("/accounts", response_model=UserSummary)
async def create_account(account: AccountCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.Admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if db.query(User).filter(User.username == account.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    
    if db.query(User).filter(User.email == account.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
        
    hashed_password = get_password_hash(account.password)
    new_user = User(username=account.username, email=account.email, hashed_password=hashed_password, role=account.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/seed")
async def seed_users(db: Session = Depends(get_db)):
    # Create one of each role if they don't exist
    roles_to_create = [
        ("admin", "admin123", UserRole.Admin),
        ("vip_user", "vip123", UserRole.VIP),
        ("free_user", "free123", UserRole.Free),
    ]
    for uname, pword, role in roles_to_create:
        if not db.query(User).filter(User.username == uname).first():
            user = User(username=uname, hashed_password=get_password_hash(pword), role=role)
            db.add(user)
    db.commit()
    return {"message": "Users seeded successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8800)
