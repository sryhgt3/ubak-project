import os
import httpx
import random
import string
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel

from database import SessionLocal
from models import User, UserRole
from schemas import ChatRequest
from services.chat_service import ChatService
from dependencies import get_current_user

router = APIRouter(tags=["telegram"], prefix="/telegram")

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8993031197:AAHbcn0olc-Iq9h13c_MtBiOnac2YecA3vc")
TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"

# In-memory store for connect tokens (token -> chat_id)
# Cocok untuk skala kecil. Untuk production yang besar bisa gunakan tabel DB/Redis.
LINK_TOKENS = {}
# In-memory store for telegram chat history (chat_id -> list of dicts)
TELEGRAM_HISTORY = {}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def send_telegram_message(chat_id: int, text: str):
    async with httpx.AsyncClient() as client:
        payload = {"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}
        try:
            await client.post(f"{TELEGRAM_API_URL}/sendMessage", json=payload)
        except Exception as e:
            print(f"Error sending telegram message: {e}")

class VerifyTokenRequest(BaseModel):
    token: str

@router.post("/verify-token")
async def verify_telegram_token(
    request: VerifyTokenRequest, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in [UserRole.VIP, UserRole.Admin]:
        raise HTTPException(status_code=403, detail="Hanya user VIP yang dapat menghubungkan Telegram.")

    token = request.token.upper().strip()
    if token not in LINK_TOKENS:
        raise HTTPException(status_code=400, detail="Token tidak valid atau sudah kedaluwarsa.")
    
    chat_id = LINK_TOKENS.pop(token)
    
    # Lepaskan chat_id dari user lama jika ada yang nyangkut
    existing = db.query(User).filter(User.telegram_chat_id == chat_id).first()
    if existing:
        existing.telegram_chat_id = None
        
    user_to_update = db.query(User).filter(User.id == current_user.id).first()
    user_to_update.telegram_chat_id = chat_id
    db.commit()
    
    # Notify user on Telegram
    await send_telegram_message(chat_id, f"✅ *Akun berhasil dihubungkan!*\n\nSelamat datang, *{current_user.username}*! Sekarang Anda bisa mencatat transaksi keuangan (Pemasukan/Pengeluaran) langsung dari bot ini.")
    
    return {"message": "Berhasil menghubungkan Telegram!"}

@router.post("/disconnect")
async def disconnect_telegram(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.telegram_chat_id:
        raise HTTPException(status_code=400, detail="Akun belum terhubung ke Telegram.")
        
    chat_id = current_user.telegram_chat_id
    user_to_update = db.query(User).filter(User.id == current_user.id).first()
    user_to_update.telegram_chat_id = None
    db.commit()
    
    await send_telegram_message(chat_id, f"🔌 Akun Telegram Anda telah diputuskan dari user *{current_user.username}*.")
    
    return {"message": "Berhasil memutuskan tautan Telegram."}

@router.post("/webhook")
async def telegram_webhook(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    
    if "message" not in data:
        return {"status": "ok"}
        
    message = data["message"]
    chat_id = message["chat"]["id"]
    text = message.get("text", "").strip()
    
    if not text:
        return {"status": "ok"}

    # Check if already linked
    user = db.query(User).filter(User.telegram_chat_id == str(chat_id)).first()

    # Handle /start atau /connect
    if text.startswith("/start") or text.startswith("/connect"):
        if user:
            await send_telegram_message(chat_id, f"Anda sudah terhubung ke akun: *{user.username}*.\n\nKetik transaksi keuangan Anda langsung di sini, atau putuskan koneksi dari aplikasi web Ubak.")
            return {"status": "ok"}
            
        token = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        LINK_TOKENS[token] = str(chat_id)
        reply = (
            f"Halo! Token koneksi Anda adalah: `{token}`\n\n"
            "Langkah selanjutnya:\n"
            "1. Buka aplikasi web Ubak.\n"
            "2. Masuk ke halaman **Profile**.\n"
            "3. Masukkan kode di atas pada bagian **Telegram Integration**.\n"
        )
        await send_telegram_message(chat_id, reply)
        return {"status": "ok"}
    
    if not user:
        await send_telegram_message(chat_id, "Akun Anda belum terhubung. Silakan ketik /connect untuk mendapatkan token tautan.")
        return {"status": "ok"}

    # VIP Expiration Check
    if user.role not in [UserRole.VIP, UserRole.Admin]:
        await send_telegram_message(chat_id, "Status VIP Anda tidak valid. Anda harus menjadi VIP untuk menggunakan bot ini.")
        return {"status": "ok"}
        
    if user.vip_expiration and user.vip_expiration < datetime.utcnow():
        user.role = UserRole.Free
        db.commit()
        await send_telegram_message(chat_id, "Masa aktif VIP Anda telah habis. Silakan perpanjang untuk melanjutkan penggunaan bot.")
        return {"status": "ok"}

    # Forward to ChatService
    from schemas import ChatMessage
    
    if chat_id not in TELEGRAM_HISTORY:
        TELEGRAM_HISTORY[chat_id] = []
        
    chat_service = ChatService(db)
    chat_request = ChatRequest(message=text, history=TELEGRAM_HISTORY[chat_id], provider="gemini")
    
    try:
        response = chat_service.get_chat_response(chat_request, user)
        reply_text = response.response
        
        # Save to history
        TELEGRAM_HISTORY[chat_id].append(ChatMessage(role="user", content=text))
        TELEGRAM_HISTORY[chat_id].append(ChatMessage(role="assistant", content=reply_text))
        
        # Limit history to last 6 messages (3 interactions)
        if len(TELEGRAM_HISTORY[chat_id]) > 6:
            TELEGRAM_HISTORY[chat_id] = TELEGRAM_HISTORY[chat_id][-6:]
            
    except Exception as e:
        reply_text = "Maaf, terjadi kesalahan saat memproses permintaan Anda."
        print(e)
        
    await send_telegram_message(chat_id, reply_text)
    
    return {"status": "ok"}
