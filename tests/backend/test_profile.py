import sys
import os
sys.path.append(os.path.abspath('backend'))
from schemas import ProfileUpdate
from models import User, UserRole
from services.user_service import UserService

class MockRepo:
    def get_by_username_exclude_id(self, *args): return None
    def get_by_email_exclude_id(self, *args): return None
    def commit_changes(self): print("MockDB commit")

mock_repo = MockRepo()
svc = UserService(mock_repo)

user = User(id=1, username="test", hashed_password="old_hash", monthly_income=1000, savings_goal="Goal", dream_item="Dream", max_spending=500, role=UserRole.VIP)

update1 = ProfileUpdate(
    username="test",
    monthly_income=2000,
    max_spending=100
)
# should not update password since it's None
svc.update_user_profile(update1, user)
print(f"Update 1 -> income: {user.monthly_income}, max_spend: {user.max_spending}, pass: {user.hashed_password}")

update2 = ProfileUpdate(
    password="new_password123"
)
svc.update_user_profile(update2, user)
print(f"Update 2 -> pass changed: {user.hashed_password != 'old_hash'}")
