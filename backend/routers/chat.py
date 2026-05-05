from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from schemas import ChatRequest, ChatResponse, ChatSessionOut, ChatMessageOut
from services.chat_service import ChatService
from repositories.chat_repository import ChatRepository
from dependencies import get_db, get_current_vip_user, get_current_user
from models import User

router = APIRouter(prefix="/api/chat", tags=["chat"])

def get_chat_repository(db: Session = Depends(get_db)):
    return ChatRepository(db)

def get_chat_service(chat_repo: ChatRepository = Depends(get_chat_repository)):
    return ChatService(chat_repo)

@router.post("/", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest, 
    service: ChatService = Depends(get_chat_service), 
    current_user: User = Depends(get_current_vip_user)
):
    return service.get_chat_response(request, current_user)

@router.get("/sessions", response_model=List[ChatSessionOut])
async def get_chat_sessions(
    service: ChatService = Depends(get_chat_service), 
    current_user: User = Depends(get_current_user)
):
    return service.get_user_sessions(current_user)

@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageOut])
async def get_session_messages(
    session_id: int, 
    service: ChatService = Depends(get_chat_service), 
    current_user: User = Depends(get_current_user)
):
    return service.get_session_messages(session_id, current_user)
