from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
from models import User
from schemas import UserOut, ProfileUpdate, UserSummary, AccountCreate
from services.user_service import UserService
from repositories.user_repository import UserRepository

router = APIRouter(tags=["users"])

def get_user_repository(db: Session = Depends(get_db)):
    return UserRepository(db)

def get_user_service(user_repo: UserRepository = Depends(get_user_repository)):
    return UserService(user_repo)

@router.get("/me", response_model=UserOut)
async def get_me(
    current_user: User = Depends(get_current_user), 
    service: UserService = Depends(get_user_service)
):
    return service.get_user_profile(current_user)

@router.put("/me")
async def update_me(
    update_data: ProfileUpdate, 
    current_user: User = Depends(get_current_user), 
    service: UserService = Depends(get_user_service)
):
    return service.update_user_profile(update_data, current_user)

@router.post("/accounts", response_model=UserSummary)
async def create_account(
    account: AccountCreate, 
    current_user: User = Depends(get_current_user), 
    service: UserService = Depends(get_user_service)
):
    return service.create_new_account(account, current_user)

@router.post("/seed")
async def seed_users(service: UserService = Depends(get_user_service)):
    return service.seed_initial_users()
