import uuid
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.db.database import engine, SessionLocal, Base
import app.models
from app.models.user import User
from app.models.product import Category, Product, ProductImage

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def seed_database():
    # 1. Create tables if missing
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        # Check if already seeded
        if db.query(Category).first():
            print("Database already contains data. Skipping seed.")
            return

        print("Seeding database in MS SQL Server...")

        # 2. Seed Admin User
        admin_user = User(
            id=uuid.uuid4(),
            email="admin@senka.com",
            password_hash=pwd_context.hash("admin123"[:72]),
            first_name="Senka",
            last_name="Admin",
            phone="+92 300 0000000",
            role="admin",
            is_active=True
        )
        db.add(admin_user)

        # 3. Seed Categories
        categories_data = [
            {"name": "Solitaire Rings", "slug": "rings"},
            {"name": "Necklaces & Pendants", "slug": "necklaces"},
            {"name": "Kundan & Polki", "slug": "kundan-polki"},
            {"name": "Oxidised Silver", "slug": "oxidised-silver"},
            {"name": "Bangles & Cuffs", "slug": "bangles"},
            {"name": "Earrings & Jhumkas", "slug": "earrings"},
            {"name": "Bridal Sets", "slug": "bridal"},
        ]
        
        cat_map = {}
        for c in categories_data:
            cat = Category(name=c["name"], slug=c["slug"], is_active=True)
            db.add(cat)
            db.flush()
            cat_map[c["slug"]] = cat.id

        # 4. Seed Products
        products_data = [
            {
                "sku": "SNK-RNG-001",
                "name": "Royal Solitaire Halo Ring",
                "slug": "royal-solitaire-halo-ring",
                "short_description": "Handcrafted 18K yellow gold band set with cushion-cut diamond halo.",
                "description": "Certified hallmark 18K gold band with precision hand-set diamond halo. Crafted for lifetime heirloom value.",
                "price": 249000.00,
                "compare_price": 295000.00,
                "stock": 8,
                "category_id": cat_map["rings"],
                "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop"
            },
            {
                "sku": "SNK-NCK-002",
                "name": "Pearl Halo Emerald Pendant Set",
                "slug": "pearl-halo-emerald-pendant-set",
                "short_description": "Colombian emerald encased in lustrous South Sea pearl halo.",
                "description": "Exquisite pendant set in platinum white gold with genuine emerald stone.",
                "price": 185000.00,
                "compare_price": 220000.00,
                "stock": 5,
                "category_id": cat_map["necklaces"],
                "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
            },
            {
                "sku": "SNK-BDL-003",
                "name": "Royal Kundan Bridal Necklace Set",
                "slug": "royal-kundan-bridal-necklace-set",
                "short_description": "Heritage Kundan & Polki grand bridal necklace with ruby drops.",
                "description": "Masterpiece bridal set featuring uncut diamonds, Kundan foil work, and natural pearls.",
                "price": 419000.00,
                "compare_price": 490000.00,
                "stock": 2,
                "category_id": cat_map["kundan-polki"],
                "image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop"
            },
            {
                "sku": "SNK-OXI-004",
                "name": "Oxidised Silver Royal Choker",
                "slug": "oxidised-silver-royal-choker",
                "short_description": "Hand-engraved oxidised sterling silver choker with ghungroo detail.",
                "description": "Traditional artisan oxidised silver piece engineered with tarnish-resistant finish.",
                "price": 95000.00,
                "compare_price": 120000.00,
                "stock": 12,
                "category_id": cat_map["oxidised-silver"],
                "image": "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop"
            },
            {
                "sku": "SNK-BNG-005",
                "name": "Sapphire & Diamond Tennis Cuff",
                "slug": "sapphire-diamond-tennis-cuff",
                "short_description": "Continuous line of royal sapphires and round brilliant diamonds.",
                "description": "Sleek platinum tennis cuff with double-safety lock clasp.",
                "price": 280000.00,
                "compare_price": 320000.00,
                "stock": 6,
                "category_id": cat_map["bangles"],
                "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop"
            },
            {
                "sku": "SNK-EAR-006",
                "name": "Celestial Diamond Drop Earrings",
                "slug": "celestial-diamond-drop-earrings",
                "short_description": "Cascading brilliant-cut diamond drop earrings in 18K yellow gold.",
                "description": "High-shine chandelier drop earrings featuring conflict-free certified diamonds.",
                "price": 165000.00,
                "compare_price": 190000.00,
                "stock": 10,
                "category_id": cat_map["earrings"],
                "image": "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop"
            }
        ]

        for p_data in products_data:
            img_url = p_data.pop("image")
            prod = Product(**p_data, currency="PKR", featured=True, published=True)
            db.add(prod)
            db.flush()

            prod_img = ProductImage(product_id=prod.id, image_url=img_url, is_primary=True, sort_order=0)
            db.add(prod_img)

        db.commit()
        print("MS SQL Server database successfully seeded!")
    except Exception as e:
        db.rollback()
        print("Error during database seed:", e)
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
