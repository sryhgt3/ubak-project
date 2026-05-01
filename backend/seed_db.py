import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User, UserRole
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
        return True
    elif env == "production":
        # In production, we force update the password to match .env
        user.hashed_password = get_password_hash(password)
        print(f"Updated password for {role.value} user: {username} (Production Mode)")
        return True
    return False

def seed_db():
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    
    env = os.getenv("ENVIRONMENT", "development").lower()
    
    # Get passwords from environment variables
    admin_pass = os.getenv("DEFAULT_ADMIN_PASSWORD")
    vip_pass = os.getenv("DEFAULT_VIP_PASSWORD")
    free_pass = os.getenv("DEFAULT_FREE_PASSWORD")

    if env == "production":
        # In production, passwords MUST be set in environment variables
        if not all([admin_pass, vip_pass, free_pass]):
            print("CRITICAL ERROR: In PRODUCTION mode, you MUST set DEFAULT_ADMIN_PASSWORD, ")
            print("DEFAULT_VIP_PASSWORD, and DEFAULT_FREE_PASSWORD in your .env file.")
            print("Seeding aborted for security.")
            return
    else:
        # In development, use provided passwords or fall back to defaults
        admin_pass = admin_pass or "UbakAdmin123"
        vip_pass = vip_pass or "UbakVip123"
        free_pass = free_pass or "UbakFree123"

    db: Session = SessionLocal()
    try:
        print(f"Starting database seeding in {env} mode...")

        # 1. Admin User
        seed_user(db, "admin", "admin@ubak.com", admin_pass, UserRole.Admin, env)
        
        # 2. VIP User
        seed_user(db, "vip_user", "vip@ubak.com", vip_pass, UserRole.VIP, env)
            
        # 3. Free User
        seed_user(db, "free_user", "free@ubak.com", free_pass, UserRole.Free, env)
            
        db.commit()
        print("Seeding completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
