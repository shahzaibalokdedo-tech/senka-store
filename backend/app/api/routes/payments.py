from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.payment_service import PaymentService

router = APIRouter(prefix="/api/payments", tags=["payments"])

class PaymentIntentRequest(BaseModel):
    amount: float
    currency: str = "PKR"
    order_id: str | None = None

@router.post("/create-intent")
def create_payment_intent(payload: PaymentIntentRequest):
    provider = PaymentService(provider="mock")
    return provider.create_intent(payload.amount, payload.currency, payload.order_id)

@router.post("/callback")
def payment_callback(payload: dict):
    if not payload:
        raise HTTPException(status_code=400, detail="Missing payload")

    return {
        "status": "received",
        "message": "Payment callback received",
        "payload": payload
    }
