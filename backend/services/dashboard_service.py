from models import User, TransactionType, UserRole
from schemas import UserSummary
from repositories.user_repository import UserRepository
from repositories.transaction_repository import TransactionRepository

class DashboardService:
    def __init__(self, user_repo: UserRepository, transaction_repo: TransactionRepository):
        self.user_repo = user_repo
        self.transaction_repo = transaction_repo

    def get_dashboard_data(self, current_user: User):
        transactions = self.transaction_repo.get_by_user_id(current_user.id)
        
        total_income = sum(t.amount for t in transactions if t.type == TransactionType.Income)
        total_expenses = sum(t.amount for t in transactions if t.type == TransactionType.Expense)
        
        total_balance = float(current_user.monthly_income or 0) + total_income - total_expenses

        recent = self.transaction_repo.get_recent_by_user_id(current_user.id, limit=10)

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
            users = self.user_repo.get_all()
            data["vip_users"] = [
                UserSummary(id=u.id, username=u.username, email=u.email, role=u.role) 
                for u in users if u.role in (UserRole.VIP, "VIP")
            ]
            data["free_users"] = [
                UserSummary(id=u.id, username=u.username, email=u.email, role=u.role) 
                for u in users if u.role in (UserRole.Free, "Free")
            ]
        elif current_user.role == UserRole.VIP:
            data["vip_perks"] = "As a VIP, you have access to advanced AI projections and lower transaction fees."
        else:
            data["free_status"] = "You're using the standard plan. Upgrade to VIP to see advanced insights!"

        return data
