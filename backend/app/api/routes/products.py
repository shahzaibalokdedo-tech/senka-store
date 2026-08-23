from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.database import get_db
from app.models.product import Product, Category, ProductImage
from app.schemas.product import ProductCreate, ProductOut

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).filter(Category.is_active == True).all()
    return {
        "categories": [
            {"id": c.id, "name": c.name, "slug": c.slug}
            for c in categories
        ]
    }

@router.get("/")
def list_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.published == True)

    if category and category.lower() != "all":
        cat = db.query(Category).filter(
            or_(Category.slug == category.lower(), Category.name.ilike(f"%{category}%"))
        ).first()
        if cat:
            query = query.filter(Product.category_id == cat.id)

    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.short_description.ilike(f"%{search}%"),
                Product.sku.ilike(f"%{search}%")
            )
        )

    if sort == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    items = query.limit(limit).all()

    result = []
    for p in items:
        primary_img = db.query(ProductImage).filter(ProductImage.product_id == p.id, ProductImage.is_primary == True).first()
        if not primary_img:
            primary_img = db.query(ProductImage).filter(ProductImage.product_id == p.id).first()
        
        image_url = primary_img.image_url if primary_img else "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop"

        cat_name = p.category.name if p.category else "Signature"

        discount_str = None
        if p.compare_price and float(p.compare_price) > float(p.price):
            perc = int(round((1 - float(p.price) / float(p.compare_price)) * 100))
            discount_str = f"{perc}% OFF"

        result.append({
            "id": p.id,
            "sku": p.sku,
            "name": p.name,
            "slug": p.slug,
            "price": float(p.price),
            "compare_price": float(p.compare_price) if p.compare_price else None,
            "discount": discount_str,
            "currency": p.currency,
            "stock": p.stock,
            "category": cat_name,
            "short_description": p.short_description,
            "description": p.description,
            "image": image_url,
            "tag": "Signature" if p.featured else "Catalog"
        })

    return {"items": result}

@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    images = db.query(ProductImage).filter(ProductImage.product_id == product.id).all()
    image_list = [img.image_url for img in images] or ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop"]

    return {
        "id": product.id,
        "sku": product.sku,
        "name": product.name,
        "slug": product.slug,
        "price": float(product.price),
        "compare_price": float(product.compare_price) if product.compare_price else None,
        "currency": product.currency,
        "stock": product.stock,
        "description": product.description,
        "category": product.category.name if product.category else "General",
        "images": image_list
    }

@router.post("/")
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    product = Product(
        sku=payload.sku,
        name=payload.name,
        slug=payload.slug,
        short_description=payload.short_description,
        description=payload.description,
        price=payload.price,
        currency=payload.currency,
        stock=payload.stock,
        category_id=payload.category_id
    )
    db.add(product)
    db.commit()
    db.refresh(product)

    return {
        "id": product.id,
        "sku": product.sku,
        "name": product.name,
        "price": float(product.price),
        "stock": product.stock
    }

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return {"message": f"Product {product_id} deleted successfully"}
