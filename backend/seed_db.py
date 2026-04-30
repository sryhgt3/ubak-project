import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User, UserRole
from security import get_password_hash
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def seed_db():
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        print("Starting database seeding...")

        # Get default passwords from environment variables
        admin_pass = os.getenv("DEFAULT_ADMIN_PASSWORD", "admin123")
        vip_pass = os.getenv("DEFAULT_VIP_PASSWORD", "vip123")
        free_pass = os.getenv("DEFAULT_FREE_PASSWORD", "free123")

        # 1. Default Admin
        if not db.query(User).filter(User.username == "admin").first():
            admin_user = User(
                username="admin",
                email="admin@ubak.com",
                hashed_password=get_password_hash(admin_pass),
                role=UserRole.Admin
            )
            db.add(admin_user)
            print("Added default admin user.")
        
        # 2. Default VIP User
        if not db.query(User).filter(User.username == "vip_user").first():
            vip_user = User(
                username="vip_user",
                email="vip@ubak.com",
                hashed_password=get_password_hash(vip_pass),
                role=UserRole.VIP
            )
            db.add(vip_user)
            print("Added default VIP user.")
            
        # 3. Default Free User
        if not db.query(User).filter(User.username == "free_user").first():
            free_user = User(
                username="free_user",
                email="free@ubak.com",
                hashed_password=get_password_hash(free_pass),
                role=UserRole.Free
            )
            db.add(free_user)
            print("Added default free user.")
            
        db.commit()
        print("Seeding completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
