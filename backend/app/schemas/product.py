from pydantic import BaseModel, Field

class ProductBase(BaseModel):
    sku: str
    name: str
    slug: str
    short_description: str | None = None
    description: str | None = None
    price: float = Field(..., gt=0)
    currency: str = "PKR"

class ProductCreate(ProductBase):
    category_id: int | None = None
    stock: int = 0

class ProductOut(ProductBase):
    id: int
    stock: int
    featured: bool = False
    published: bool = True
