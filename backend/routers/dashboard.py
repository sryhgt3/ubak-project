from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
from models import Transaction, User, TransactionType, UserRole
from schemas import DashboardData, UserSummary

router = APIRouter(tags=["dashboard"])

@router.get("/dashboard", response_model=DashboardData)
async def read_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    
    total_income = sum(t.amount for t in transactions if t.type == TransactionType.Income)
    total_expenses = sum(t.amount for t in transactions if t.type == TransactionType.Expense)
    
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
