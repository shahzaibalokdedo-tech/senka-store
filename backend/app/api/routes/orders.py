import random
import string
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.services.email import send_order_confirmation

router = APIRouter(prefix="/api/orders", tags=["orders"])


class OrderItemSchema(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    name: Optional[str] = None


class OrderCreateSchema(BaseModel):
    items: List[OrderItemSchema]
    first_name: str
    last_name: str
    email: Optional[str] = None   # Customer email for confirmation
    phone: str
    address: str
    city: str
    payment_method: str


from app.models.product import Product, SiteSettings

@router.post("/")
def create_order(payload: OrderCreateSchema, db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Order items cannot be empty")

    subtotal = sum(item.unit_price * item.quantity for item in payload.items)
    
    # Dynamic delivery charge from SiteSettings (default 250)
    del_setting = db.query(SiteSettings).filter(SiteSettings.key == "delivery_charge").first()
    try:
        shipping_fee = float(del_setting.value) if del_setting and del_setting.value else 250.0
    except Exception:
        shipping_fee = 250.0

    tax = 0.0  # No tax per user requirement
    total = round(subtotal + shipping_fee, 2)

    order_num = "SNK-" + "".join(random.choices(string.digits, k=6))

    order = Order(
        order_number=order_num,
        status="pending",
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        tax=tax,
        total=total,
        currency="PKR",
        payment_status="pending",
        payment_provider=payload.payment_method
    )
    db.add(order)
    db.flush()

    for item in payload.items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price
        )
        db.add(order_item)

    db.commit()
    db.refresh(order)

    # Send confirmation email if customer provided email
    if payload.email:
        customer_name = f"{payload.first_name} {payload.last_name}".strip()
        items_for_email = [
            {"name": item.name or f"Product #{item.product_id}", "quantity": item.quantity, "unit_price": item.unit_price}
            for item in payload.items
        ]
        send_order_confirmation(
            to_email=payload.email,
            customer_name=customer_name,
            order_number=order_num,
            items=items_for_email,
            subtotal=subtotal,
            tax=tax,
            total=total,
            payment_method=payload.payment_method,
            city=payload.city,
        )

    return {
        "id": order.id,
        "order_number": order.order_number,
        "subtotal": float(order.subtotal),
        "tax": float(order.tax),
        "total": float(order.total),
        "currency": order.currency,
        "status": order.status,
        "message": "Order placed successfully"
    }


@router.get("/")
def list_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(Order.created_at.desc()).limit(200).all()
    return {
        "orders": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "total": float(o.total),
                "subtotal": float(o.subtotal),
                "tax": float(o.tax),
                "currency": o.currency,
                "status": o.status,
                "payment_provider": o.payment_provider,
                "created_at": o.created_at.isoformat() if o.created_at else None,
                "items": [
                    {
                        "product_id": i.product_id,
                        "quantity": i.quantity,
                        "unit_price": float(i.unit_price)
                    }
                    for i in o.items
                ]
            }
            for o in orders
        ]
    }


@router.patch("/{order_id}/status")
def update_order_status(order_id: int, status: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status
    db.commit()
    return {"message": f"Order {order_id} status updated to {status}"}
