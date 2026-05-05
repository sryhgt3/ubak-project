from models import User, TransactionType, UserRole
from schemas import UserSummary
from repositories.user_repository import UserRepository
from repositories.transaction_repository import TransactionRepository
from repositories.account_repository import AccountRepository

class DashboardService:
    def __init__(self, user_repo: UserRepository, transaction_repo: TransactionRepository, account_repo: AccountRepository):
        self.user_repo = user_repo
        self.transaction_repo = transaction_repo
        self.account_repo = account_repo

    def get_dashboard_data(self, current_user: User, account_id: int = None):
        if account_id:
            transactions = self.transaction_repo.get_by_account_id(account_id)
            # Verify account belongs to user
            account = self.account_repo.get_by_id(account_id)
            if not account or account.user_id != current_user.id:
                # Fallback to all if invalid
                transactions = self.transaction_repo.get_by_user_id(current_user.id)
                total_balance = sum(acc.balance for acc in self.account_repo.get_by_user_id(current_user.id))
            else:
                total_balance = account.balance
        else:
            transactions = self.transaction_repo.get_by_user_id(current_user.id)
            total_balance = sum(acc.balance for acc in self.account_repo.get_by_user_id(current_user.id))

        accounts = self.account_repo.get_by_user_id(current_user.id)
        
        total_income = sum(t.amount for t in transactions if t.type == TransactionType.Income)
        total_expenses = sum(t.amount for t in transactions if t.type == TransactionType.Expense)
        
        if account_id:
            recent = [t for t in transactions][:10] # Simplified for now
        else:
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
            "accounts": accounts,
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
