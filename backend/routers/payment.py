import os
import hashlib
import logging
import json
import uuid

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import midtransclient

from dependencies import get_db, get_current_user
from models import User, UserRole, PaymentOrder
from schemas import PaymentResponse

router = APIRouter(prefix="/api/payment", tags=["payment"])

# =========================
# LOGGER CONFIG
# =========================
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# =========================
# MIDTRANS CONFIG
# =========================
SERVER_KEY = os.getenv("MIDTRANS_SERVER_KEY", "your_server_key")
IS_PRODUCTION = os.getenv("MIDTRANS_IS_PRODUCTION", "False").lower() == "true"

if not SERVER_KEY or SERVER_KEY == "your_server_key":
    raise RuntimeError("MIDTRANS_SERVER_KEY is not configured")

snap = midtransclient.Snap(
    is_production=IS_PRODUCTION,
    server_key=SERVER_KEY
)


# =========================
# CREATE PAYMENT
# =========================
@router.post("/create", response_model=PaymentResponse)
async def create_payment(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Only Free users can upgrade
    if current_user.role != UserRole.Free:
        raise HTTPException(status_code=400, detail="Only Free users can upgrade")

    order_id = f"VIP-{uuid.uuid4().hex[:8].upper()}-{current_user.id}"
    amount = 10000

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
            "name": "VIP Membership"
        }]
    }

    try:
        transaction = snap.create_transaction(param)

        # Save order
        order = PaymentOrder(
            order_id=order_id,
            user_id=current_user.id,
            amount=amount,
            status="pending"
        )

        db.add(order)
        db.commit()

        return PaymentResponse(
            token=transaction["token"],
            redirect_url=transaction["redirect_url"],
            order_id=order_id
        )

    except Exception as e:
        db.rollback()
        logger.error(f"Create payment error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Payment creation failed")


# =========================
# MIDTRANS WEBHOOK
# =========================
@router.post("/midtrans-notification")
async def midtrans_webhook(
    request: Request,
    db: Session = Depends(get_db)
):

    data = await request.json()
    logger.info(f"Midtrans webhook: {json.dumps(data)}")

    try:
        # =========================
        # EXTRACT SAFE FIELDS
        # =========================
        order_id = data.get("order_id")
        status_code = str(data.get("status_code", "")).strip()
        gross_amount = str(data.get("gross_amount", "")).strip()
        signature_key = data.get("signature_key")
        transaction_status = data.get("transaction_status")

        if not order_id or not signature_key:
            raise HTTPException(status_code=400, detail="Invalid payload")

        # =========================
        # SIGNATURE VALIDATION
        # =========================
        signature_str = (
            str(order_id).strip()
            + status_code
            + gross_amount
            + str(SERVER_KEY).strip()
        )

        expected_signature = hashlib.sha512(
            signature_str.encode()
        ).hexdigest()

        if expected_signature != signature_key:
            logger.warning("Invalid signature detected")
            raise HTTPException(status_code=400, detail="Invalid signature")

        # =========================
        # FIND ORDER
        # =========================
        order = db.query(PaymentOrder).filter(
            PaymentOrder.order_id == order_id
        ).first()

        if not order:
            logger.warning(f"Order not found: {order_id}")
            return {"message": "order not found"}

        # =========================
        # IDEMPOTENCY CHECK
        # =========================
        if order.status == transaction_status:
            return {"message": "duplicate ignored"}

        if order.status in ["settlement", "capture"] and transaction_status in ["settlement", "capture"]:
            return {"message": "already processed"}

        # =========================
        # UPDATE ORDER STATUS
        # =========================
        order.status = transaction_status

        # =========================
        # UPGRADE USER
        # =========================
        if transaction_status in ["settlement", "capture"]:
            user = db.query(User).filter(User.id == order.user_id).first()

            if user and user.role != UserRole.VIP:
                user.role = UserRole.VIP
                db.add(user)

        db.commit()

        return {"message": "success"}

    except HTTPException as e:
        db.rollback()
        logger.error(f"HTTP error: {e.detail}")
        raise e

    except Exception as e:
        db.rollback()
        logger.error(f"Webhook error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")