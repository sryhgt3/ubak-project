from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from dependencies import get_db, get_current_user
from models import User, UserRole
from schemas import UserOut, ProfileUpdate, UserSummary, AccountCreate
from security import get_password_hash

router = APIRouter(tags=["users"])

@router.get("/me", response_model=UserOut)
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

@router.put("/me")
async def update_me(update_data: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if update_data.username:
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

@router.post("/accounts", response_model=UserSummary)
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

@router.post("/seed")
async def seed_users(db: Session = Depends(get_db)):
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
