from typing import Any, Dict

class PaymentService:
    def __init__(self, provider: str = "mock"):
        self.provider = provider

    def create_intent(self, amount: float, currency: str = "PKR", order_id: str | None = None) -> Dict[str, Any]:
        if self.provider == "mock":
            return {
                "status": "pending",
                "provider": "mock",
                "amount": amount,
                "currency": currency,
                "order_id": order_id,
                "payment_reference": f"mock_{order_id or 'temp'}",
                "redirect_url": "/checkout/success"
            }

        return {
            "status": "not_configured",
            "provider": self.provider,
            "message": "Real payment provider configuration is required"
        }

    def verify_callback(self, payload: Dict[str, Any]) -> bool:
        if self.provider == "mock":
            return True
        return False
