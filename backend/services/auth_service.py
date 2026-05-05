import os
import httpx
from fastapi import HTTPException, status
from datetime import timedelta
from models import UserRole, User
from schemas import LoginRequest, GoogleLoginRequest
from security import verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_password_hash
from repositories.user_repository import UserRepository
from schemas import LoginRequest, GoogleLoginRequest, RegisterRequest

class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def register_user(self, register_data: RegisterRequest):
        # Check if username already exists
        if self.user_repo.get_by_username(register_data.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )

        # Check if email already exists
        if self.user_repo.get_by_email(register_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        hashed_password = get_password_hash(register_data.password)

        user = User(
            username=register_data.username,
            email=register_data.email,
            hashed_password=hashed_password,
            role=UserRole.Free  # Default role
        )
        self.user_repo.create(user)
        return {"message": "User registered successfully"}

    def authenticate_user(self, login_data: LoginRequest):
        try:
            user = self.user_repo.get_by_username(login_data.username)
            if not user or not verify_password(login_data.password, user.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect username or password",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            return self._create_user_token_response(user)
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            print(f"Login error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal Server Error: {str(e)}. Make sure your database is updated."
            )

    async def authenticate_google_user(self, google_data: GoogleLoginRequest):
        try:
            async with httpx.AsyncClient() as client:
                # Exchange code for tokens
                token_response = await client.post(
                    "https://oauth2.googleapis.com/token",
                    data={
                        "code": google_data.code,
                        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
                        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
                        "redirect_uri": google_data.redirect_uri,
                        "grant_type": "authorization_code",
                    },
                )
                
                if token_response.status_code != 200:
                    print(f"Google Token Exchange Error: {token_response.text}")
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Failed to exchange code: {token_response.text}"
                    )
                
                tokens = token_response.json()
                access_token_google = tokens.get("access_token")
                
                # Get user info
                user_info_response = await client.get(
                    "https://www.googleapis.com/oauth2/v2/userinfo",
                    headers={"Authorization": f"Bearer {access_token_google}"}
                )
                
                if user_info_response.status_code != 200:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Failed to get user info from Google"
                    )
                
                user_info = user_info_response.json()
                email = user_info.get("email")
                
                if not email:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Google account must have an email"
                    )
                
                # Check if user exists
                user = self.user_repo.get_by_email(email)
                
                if not user:
                    # Create new user
                    username = email.split('@')[0]
                    existing_user = self.user_repo.get_by_username(username)
                    if existing_user:
                        import random
                        username = f"{username}_{random.randint(1000, 9999)}"
                    
                    user = User(
                        username=username,
                        email=email,
                        hashed_password="google_sso",
                        role=UserRole.Free
                    )
                    self.user_repo.create(user)
                
                return self._create_user_token_response(user)
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            print(f"Google login error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal Server Error: {str(e)}"
            )

    def _create_user_token_response(self, user):
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
            "username": user.username,
            "setup_completed": setup_completed
        }
