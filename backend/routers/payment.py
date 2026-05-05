import os
import hashlib
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import midtransclient
from datetime import datetime
import uuid

from dependencies import get_db, get_current_user
from models import User, UserRole, PaymentOrder
from schemas import PaymentResponse, MidtransWebhook

router = APIRouter(prefix="/api/payment", tags=["payment"])

# Midtrans Configuration
SERVER_KEY = os.getenv("MIDTRANS_SERVER_KEY", "your_server_key")
IS_PRODUCTION = os.getenv("MIDTRANS_IS_PRODUCTION", "False").lower() == "true"

snap = midtransclient.Snap(
    is_production=IS_PRODUCTION,
    server_key=SERVER_KEY
)

@router.post("/create", response_model=PaymentResponse)
async def create_payment(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only Free users can upgrade
    if current_user.role != UserRole.Free:
        raise HTTPException(status_code=400, detail="Only Free users can upgrade to VIP")

    order_id = f"VIP-{uuid.uuid4().hex[:8].upper()}-{current_user.id}"
    amount = 10000

    # 1. Create Midtrans Transaction
    param = {
        "transaction_details": {
            "order_id": order_id,
            "gross_amount": amount
        },
        "customer_details": {
            "first_name": current_user.username,
            "email": current_user.email or f"{current_user.username}@example.com"
        },
        "item_details": [{
            "id": "VIP_UPGRADE",
            "price": amount,
            "quantity": 1,
            "name": "Upgrade to VIP Membership"
        }]
    }

    try:
        transaction = snap.create_transaction(param)
        snap_token = transaction['token']
        redirect_url = transaction['redirect_url']

        # 2. Save PaymentOrder to Database
        new_order = PaymentOrder(
            order_id=order_id,
            user_id=current_user.id,
            amount=amount,
            status="pending"
        )
        db.add(new_order)
        db.commit()

        return PaymentResponse(token=snap_token, redirect_url=redirect_url)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def midtrans_webhook(
    data: MidtransWebhook,
    db: Session = Depends(get_db)
):
    # 1. Validate Signature (Optional but recommended)
    # signature = hashlib.sha512((data.order_id + data.status_code + data.gross_amount + SERVER_KEY).encode()).hexdigest()
    # if signature != data.signature_key:
    #     raise HTTPException(status_code=400, detail="Invalid signature")

    # 2. Find Order
    order = db.query(PaymentOrder).filter(PaymentOrder.order_id == data.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # 3. Update Order Status
    status = data.transaction_status
    order.status = status
    
    # 4. If Settlement, Update User to VIP
    if status in ["settlement", "capture"]:
        user = db.query(User).filter(User.id == order.user_id).first()
        if user:
            user.role = UserRole.VIP
            db.add(user)

    db.add(order)
    db.commit()

    return {"message": "Webhook received successfully"}
