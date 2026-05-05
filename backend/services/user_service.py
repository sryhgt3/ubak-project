from fastapi import HTTPException
from models import User, UserRole, TransactionType, AccountType
from schemas import ProfileUpdate, UserAccountCreate, AccountCreate, TransactionCreate
from security import get_password_hash
from repositories.user_repository import UserRepository
from services.account_service import AccountService
from services.transaction_service import TransactionService

class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def get_user_profile(self, user: User):
        setup_completed = True
        if user.role != UserRole.Admin:
            if any(v is None for v in [user.monthly_income, user.savings_goal, user.dream_item, user.max_spending]):
                setup_completed = False
                
        return {
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "monthly_income": user.monthly_income,
            "savings_goal": user.savings_goal,
            "dream_item": user.dream_item,
            "max_spending": user.max_spending,
            "setup_completed": setup_completed
        }

    def update_user_profile(
        self, 
        update_data: ProfileUpdate, 
        user: User, 
        account_service: AccountService,
        transaction_service: TransactionService
    ):
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

        # Track if monthly_income was previously unset
        was_setup_incomplete = user.monthly_income is None

        if update_data.monthly_income is not None:
            user.monthly_income = update_data.monthly_income
        if update_data.savings_goal is not None:
            user.savings_goal = update_data.savings_goal
        if update_data.dream_item is not None:
            user.dream_item = update_data.dream_item
        if update_data.max_spending is not None:
            user.max_spending = update_data.max_spending
            
        # Create or Initialize Main Wallet if setup is being completed
        if user.monthly_income is not None and user.role != UserRole.Admin:
            existing_accounts = account_service.get_user_accounts(user)
            
            def create_initial_transaction(account_id: int, amount: float):
                init_tx = TransactionCreate(
                    amount=amount,
                    type=TransactionType.Income,
                    category="Salary",
                    description="Initial Monthly Income",
                    account_id=account_id
                )
                transaction_service.create_transaction(init_tx, user)

            if not existing_accounts:
                main_account_data = AccountCreate(
                    name="Main Wallet",
                    type=AccountType.Cash,
                    balance=0, # Start with 0 then let transaction service update it
                    max_spending=user.max_spending
                )
                new_account = account_service.create_account(main_account_data, user)
                create_initial_transaction(new_account.id, float(user.monthly_income))
            elif was_setup_incomplete:
                # For seeded users, seed_db.py might have already created a "Main Wallet" with 0 balance.
                # If they are just now completing setup, we should initialize that wallet.
                main_wallet = next((acc for acc in existing_accounts if acc.name == "Main Wallet"), None)
                if main_wallet and main_wallet.balance == 0:
                    if user.max_spending is not None:
                        main_wallet.max_spending = user.max_spending
                    # Update wallet via transaction to record it in charts
                    create_initial_transaction(main_wallet.id, float(user.monthly_income))

        self.user_repo.commit_changes()
        return {"message": "Profile updated successfully"}

    def create_new_account(self, account: UserAccountCreate, current_user: User):
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
