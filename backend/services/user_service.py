from fastapi import HTTPException
from models import User, UserRole
from schemas import ProfileUpdate, AccountCreate
from security import get_password_hash
from repositories.user_repository import UserRepository

class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def get_user_profile(self, user: User):
        setup_completed = True
        if user.role != UserRole.Admin:
            if any(v is None for v in [user.monthly_income, user.savings_goal, user.dream_item, user.max_spending]):
                setup_completed = False
                
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "vip_expiration": user.vip_expiration,
            "telegram_chat_id": user.telegram_chat_id,
            "monthly_income": user.monthly_income,
            "savings_goal": user.savings_goal,
            "dream_item": user.dream_item,
            "max_spending": user.max_spending,
            "setup_completed": setup_completed
        }

    def update_user_profile(self, update_data: ProfileUpdate, user: User):
        if update_data.username:
            existing = self.user_repo.get_by_username_exclude_id(update_data.username, user.id)
            if existing:
                raise HTTPException(status_code=400, detail="Username already taken")
            user.username = update_data.username
        
        if update_data.email:
            existing = self.user_repo.get_by_email_exclude_id(update_data.email, user.id)
            if existing:
                raise HTTPException(status_code=400, detail="Email already taken")
            user.email = update_data.email

        if update_data.password:
            user.hashed_password = get_password_hash(update_data.password)

        if update_data.monthly_income is not None:
            user.monthly_income = update_data.monthly_income
        if update_data.savings_goal is not None:
            user.savings_goal = update_data.savings_goal
        if update_data.dream_item is not None:
            user.dream_item = update_data.dream_item
        if update_data.max_spending is not None:
            user.max_spending = update_data.max_spending
            
        self.user_repo.commit_changes()
        return {"message": "Profile updated successfully"}

    def create_new_account(self, account: AccountCreate, current_user: User):
        if current_user.role != UserRole.Admin:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        if self.user_repo.get_by_username(account.username):
            raise HTTPException(status_code=400, detail="Username already exists")
        
        if self.user_repo.get_by_email(account.email):
            raise HTTPException(status_code=400, detail="Email already exists")
            
        hashed_password = get_password_hash(account.password)
        new_user = User(
            username=account.username, 
            email=account.email, 
            hashed_password=hashed_password, 
            role=account.role
        )
        return self.user_repo.create(new_user)

    def seed_initial_users(self):
        roles_to_create = [
            ("admin", "admin123", UserRole.Admin),
            ("vip_user", "vip123", UserRole.VIP),
            ("free_user", "free123", UserRole.Free),
        ]
        for uname, pword, role in roles_to_create:
            if not self.user_repo.get_by_username(uname):
                user = User(username=uname, hashed_password=get_password_hash(pword), role=role)
                self.user_repo.create(user)
        return {"message": "Users seeded successfully"}

    def get_all_users(self):
        users = self.user_repo.db.query(User).all()
        result = []
        for u in users:
            result.append(self.get_user_profile(u))
        return result

    def update_user_role(self, user_id: int, role_data):
        user = self.user_repo.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.role = role_data.role
        if role_data.role == UserRole.VIP:
            user.vip_expiration = role_data.vip_expiration
        else:
            user.vip_expiration = None
            
        self.user_repo.commit_changes()
        return self.get_user_profile(user)

    def delete_user(self, user_id: int):
        user = self.user_repo.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        self.user_repo.db.delete(user)
        self.user_repo.commit_changes()
        return {"message": "User deleted successfully"}
