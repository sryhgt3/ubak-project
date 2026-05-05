from repositories.user_repository import UserRepository
from repositories.transaction_repository import TransactionRepository
from schemas import UserSummary
from models import UserRole

class AdminService:
    def __init__(self, user_repo: UserRepository, transaction_repo: TransactionRepository):
        self.user_repo = user_repo
        self.transaction_repo = transaction_repo

    def get_all_users(self):
        users = self.user_repo.get_all()
        return [
            UserSummary(id=u.id, username=u.username, email=u.email, role=u.role)
            for u in users
        ]

    def get_system_stats(self):
        users = self.user_repo.get_all()
        total_users = len(users)
        vip_count = len([u for u in users if u.role == UserRole.VIP])
        free_count = len([u for u in users if u.role == UserRole.Free])
        admin_count = len([u for u in users if u.role == UserRole.Admin])
        
        # In a real app, you'd aggregate all transactions across all users here
        # For simplicity, we'll just count them
        all_transactions_count = 0 
        for u in users:
            all_transactions_count += len(u.transactions)
            
        return {
            "total_users": total_users,
            "vip_count": vip_count,
            "free_count": free_count,
            "admin_count": admin_count,
            "total_transactions": all_transactions_count,
            "status": "Healthy"
        }
