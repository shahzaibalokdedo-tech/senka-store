"""
Admin Routes — Site Settings, Customer Management, Category CRUD, Bulk Email
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.product import Category, Product, SiteSettings
from app.models.user import User
from app.services.email import send_custom_email

router = APIRouter(prefix="/api/admin", tags=["admin"])

# ─────────────────────────────────────────────
# SITE SETTINGS
# ─────────────────────────────────────────────

DEFAULT_SETTINGS = [
    {"key": "announcement_text", "value": "✨ Free Insured Shipping Across Pakistan · Use code SENKA10 for 10% off · New Bridal Edit Now Live", "label": "Announcement Bar Text"},
    {"key": "brand_name", "value": "SENKA", "label": "Brand Name"},
    {"key": "brand_tagline", "value": "LUXURY FASHION STUDIO", "label": "Brand Tagline"},
    {"key": "announcement_enabled", "value": "true", "label": "Show Announcement Bar"},
    {"key": "contact_email", "value": "Senkajewellers@gmail.com", "label": "Contact Email"},
    {"key": "contact_phone", "value": "03320409268", "label": "Contact Phone"},
    {"key": "contact_address", "value": "G9 Islamabad, Pakistan", "label": "Studio Address"},
    {"key": "delivery_charge", "value": "250", "label": "Courier Delivery Charge (PKR)"},
    {"key": "hero_title", "value": "Wear the Story of Centuries", "label": "Hero Banner Title"},
    {"key": "hero_subtitle", "value": "Crafted with 18K gold, Kashmir emeralds, and unrivalled artisanal precision.", "label": "Hero Banner Subtitle"},
]


def seed_default_settings(db: Session):
    for s in DEFAULT_SETTINGS:
        existing = db.query(SiteSettings).filter(SiteSettings.key == s["key"]).first()
        if not existing:
            db.add(SiteSettings(key=s["key"], value=s["value"], label=s["label"]))
    db.commit()


@router.get("/settings")
def get_all_settings(db: Session = Depends(get_db)):
    seed_default_settings(db)
    rows = db.query(SiteSettings).all()
    return {"settings": [{"id": r.id, "key": r.key, "value": r.value, "label": r.label} for r in rows]}


class SettingUpdate(BaseModel):
    key: str
    value: str

@router.put("/settings")
def update_setting(payload: SettingUpdate, db: Session = Depends(get_db)):
    row = db.query(SiteSettings).filter(SiteSettings.key == payload.key).first()
    if not row:
        row = SiteSettings(key=payload.key, value=payload.value, label=payload.key)
        db.add(row)
    else:
        row.value = payload.value
    db.commit()
    return {"message": f"Setting '{payload.key}' updated successfully", "value": payload.value}


# ─────────────────────────────────────────────
# CATEGORY MANAGEMENT
# ─────────────────────────────────────────────

class CategoryCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    image_url: Optional[str] = None

@router.get("/categories")
def list_all_categories(db: Session = Depends(get_db)):
    cats = db.query(Category).all()
    return {"categories": [{"id": c.id, "name": c.name, "slug": c.slug, "image_url": c.image_url, "is_active": c.is_active, "product_count": len(c.products)} for c in cats]}

@router.post("/categories")
def create_category(payload: CategoryCreate, db: Session = Depends(get_db)):
    slug = payload.slug or payload.name.lower().replace(" ", "-").replace("&", "and")
    existing = db.query(Category).filter(Category.slug == slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category with this slug already exists")
    cat = Category(name=payload.name, slug=slug, image_url=payload.image_url, is_active=True)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return {"message": "Category created", "id": cat.id, "name": cat.name, "slug": cat.slug}

@router.delete("/categories/{cat_id}")
def delete_category(cat_id: int, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    # Un-assign products instead of deleting them
    for product in cat.products:
        product.category_id = None
    db.delete(cat)
    db.commit()
    return {"message": f"Category '{cat.name}' deleted"}

@router.put("/categories/{cat_id}")
def update_category(cat_id: int, payload: CategoryCreate, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    cat.name = payload.name
    if payload.slug:
        cat.slug = payload.slug
    if payload.image_url:
        cat.image_url = payload.image_url
    db.commit()
    return {"message": "Category updated", "id": cat.id}


# ─────────────────────────────────────────────
# PRODUCT MANAGEMENT (Admin Full CRUD)
# ─────────────────────────────────────────────

class ProductCreate(BaseModel):
    name: str
    sku: Optional[str] = None
    slug: Optional[str] = None
    price: float
    compare_price: Optional[float] = None
    stock: int = 1
    category_id: Optional[int] = None
    image_url: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None

@router.post("/products")
def admin_create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    import re, random
    slug = payload.slug or re.sub(r"[^a-z0-9]+", "-", payload.name.lower()).strip("-")
    # Ensure unique slug
    base_slug = slug
    counter = 1
    while db.query(Product).filter(Product.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    sku = payload.sku or f"SNK-{random.randint(100,999)}-{random.randint(100,999)}"

    from app.models.product import ProductImage
    product = Product(
        name=payload.name,
        sku=sku,
        slug=slug,
        price=payload.price,
        compare_price=payload.compare_price,
        stock=payload.stock,
        category_id=payload.category_id,
        short_description=payload.short_description or "",
        description=payload.description or "",
        currency="PKR",
        published=True,
    )
    db.add(product)
    db.flush()

    if payload.image_url:
        img = ProductImage(product_id=product.id, image_url=payload.image_url, is_primary=True)
        db.add(img)

    db.commit()
    db.refresh(product)
    return {"message": "Product created", "id": product.id, "name": product.name, "sku": product.sku}

@router.delete("/products/{product_id}")
def admin_delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    name = product.name
    db.delete(product)
    db.commit()
    return {"message": f"Product '{name}' deleted"}


# ─────────────────────────────────────────────
# CUSTOMER MANAGEMENT
# ─────────────────────────────────────────────

@router.get("/customers")
def list_customers(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.id.asc()).all()
    return {
        "customers": [
            {
                "id": str(u.id),
                "email": u.email,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "phone": u.phone,
                "role": u.role,
            }
            for u in users
        ]
    }


# ─────────────────────────────────────────────
# EMAIL TO CUSTOMERS
# ─────────────────────────────────────────────

class EmailPayload(BaseModel):
    to_email: str
    subject: str
    body: str

@router.post("/email/send")
def send_email_to_customer(payload: EmailPayload):
    success = send_custom_email(payload.to_email, payload.subject, payload.body)
    if not success:
        return {"message": "Email queued (SMTP disabled — configure .env to enable live sending)", "sent": False}
    return {"message": f"Email sent to {payload.to_email}", "sent": True}
