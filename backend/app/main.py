from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.api.routes.products import router as product_router
from app.api.routes.payments import router as payment_router
from app.api.routes.orders import router as orders_router
from app.api.routes.admin import router as admin_router
from app.core.config import settings

from app.db.database import engine, Base
from app.db.seed import seed_database
import app.models  # Register all models with Base

# Auto-create tables & seed default database data
try:
    Base.metadata.create_all(bind=engine)
    seed_database()
except Exception as e:
    print(f"Database initialization warning: {e}")

app = FastAPI(title="Senka API", version="2.0.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(product_router)
app.include_router(payment_router)
app.include_router(orders_router)
app.include_router(admin_router)


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "senka-api",
        "version": "2.0.0",
        "currency": "PKR"
    }

@app.get("/")
def root():
    return {"message": "Senka Luxury API v2 Live"}

