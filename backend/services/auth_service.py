from fastapi import HTTPException, status
from datetime import timedelta
from models import UserRole
from schemas import LoginRequest
from security import verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from repositories.user_repository import UserRepository

class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def authenticate_user(self, login_data: LoginRequest):
        try:
            user = self.user_repo.get_by_username(login_data.username)
            if not user or not verify_password(login_data.password, user.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect username or password",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            setup_completed = True
            if user.role != UserRole.Admin:
                try:
                    fields = [user.monthly_income, user.savings_goal, user.dream_item, user.max_spending]
                    if any(v is None for v in fields):
                        setup_completed = False
                except Exception:
                    setup_completed = False

            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": user.username, "role": user.role.value}, expires_delta=access_token_expires
            )
            return {
                "access_token": access_token, 
                "token_type": "bearer", 
                "role": user.role.value,
                "setup_completed": setup_completed
            }
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            print(f"Login error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal Server Error: {str(e)}. Make sure your database is updated."
            )
