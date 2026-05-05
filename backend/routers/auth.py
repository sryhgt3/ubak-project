from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from dependencies import get_db
from schemas import Token, LoginRequest, GoogleLoginRequest, RegisterRequest, RegisterResponse
from services.auth_service import AuthService
from repositories.user_repository import UserRepository

router = APIRouter(tags=["auth"])

def get_user_repository(db: Session = Depends(get_db)):
    return UserRepository(db)

def get_auth_service(user_repo: UserRepository = Depends(get_user_repository)):
    return AuthService(user_repo)

@router.post("/register", response_model=RegisterResponse)
async def register(register_data: RegisterRequest, service: AuthService = Depends(get_auth_service)):
    return service.register_user(register_data)

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, service: AuthService = Depends(get_auth_service)):
    return service.authenticate_user(login_data)

@router.post("/auth/google", response_model=Token)
async def google_login(google_data: GoogleLoginRequest, service: AuthService = Depends(get_auth_service)):
    return await service.authenticate_google_user(google_data)
