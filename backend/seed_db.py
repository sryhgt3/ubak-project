import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User, UserRole, Account, AccountType, Transaction
from security import get_password_hash
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def seed_user(db: Session, username: str, email: str, password: str, role: UserRole, env: str):
    """Helper function to seed a single user or update their password in production."""
    user = db.query(User).filter(User.username == username).first()
    if not user:
        new_user = User(
            username=username,
            email=email,
            hashed_password=get_password_hash(password),
            role=role
        )
        db.add(new_user)
        print(f"Added default {role.value} user: {username}")
        db.commit()
        db.refresh(new_user)
        return new_user
    elif env == "production":
        # In production, we force update the password to match .env
        user.hashed_password = get_password_hash(password)
        db.commit()
        print(f"Updated password for {role.value} user: {username} (Production Mode)")
        return user
    return user

def ensure_default_accounts_and_migration(db: Session):
    users = db.query(User).all()
    for user in users:
        # 1. Ensure at least one account exists
        account = db.query(Account).filter(Account.user_id == user.id).first()
        if not account:
            account = Account(
                user_id=user.id,
                name="Main Wallet",
                type=AccountType.Cash,
                balance=0.0
            )
            db.add(account)
            db.flush()
            print(f"Created default account 'Main Wallet' for user: {user.username}")
        
        # 2. Migrate transactions with NULL account_id
        null_transactions = db.query(Transaction).filter(
            Transaction.user_id == user.id,
            Transaction.account_id == None
        ).all()
        
        if null_transactions:
            print(f"Migrating {len(null_transactions)} transactions for user {user.username}")
            for tx in null_transactions:
                tx.account_id = account.id
    db.commit()

def seed_db():
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    
    env = os.getenv("ENVIRONMENT", "development").lower()
    
    # Get passwords from environment variables
    admin_pass = os.getenv("DEFAULT_ADMIN_PASSWORD")
    vip_pass = os.getenv("DEFAULT_VIP_PASSWORD")
    free_pass = os.getenv("DEFAULT_FREE_PASSWORD")

    if env == "production":
        if not all([admin_pass, vip_pass, free_pass]):
            print("CRITICAL ERROR: In PRODUCTION mode, you MUST set passwords in .env")
            return
    else:
        admin_pass = admin_pass or "UbakAdmin123"
        vip_pass = vip_pass or "UbakVip123"
        free_pass = free_pass or "UbakFree123"

    db: Session = SessionLocal()
    try:
        print(f"Starting database seeding in {env} mode...")

        # Seed initial users
        seed_user(db, "admin", "admin@ubak.com", admin_pass, UserRole.Admin, env)
        seed_user(db, "vip_user", "vip@ubak.com", vip_pass, UserRole.VIP, env)
        seed_user(db, "free_user", "free@ubak.com", free_pass, UserRole.Free, env)
            
        # Run migration/default account logic
        ensure_default_accounts_and_migration(db)
        
        print("Seeding and migration completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
