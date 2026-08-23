"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CartDrawer, { CartItem } from "../components/CartDrawer";
import WishlistDrawer, { WishlistItem } from "../components/WishlistDrawer";
import QuickViewModal from "../components/QuickViewModal";
import { Search, Heart, Eye, ShoppingBag, Star } from "lucide-react";

const allProducts = [
  {
    id: 1,
    name: "Royal Solitaire Halo Ring",
    price: 249000,
    comparePrice: 295000,
    discount: "16% OFF",
    rating: 5,
    reviews: 48,
    category: "Rings",
    tag: "Signature",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Pearl Emerald Pendant Set",
    price: 185000,
    comparePrice: 220000,
    discount: "15% OFF",
    rating: 4.9,
    reviews: 32,
    category: "Necklaces",
    tag: "New",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Royal Kundan Bridal Set",
    price: 419000,
    comparePrice: 490000,
    discount: "14% OFF",
    rating: 5,
    reviews: 64,
    category: "Bridal",
    tag: "Luxury",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Oxidised Silver Choker",
    price: 95000,
    comparePrice: 120000,
    discount: "20% OFF",
    rating: 4.8,
    reviews: 19,
    category: "Oxidised",
    tag: "Festive",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Sapphire Tennis Cuff",
    price: 280000,
    comparePrice: 320000,
    discount: "12% OFF",
    rating: 5,
    reviews: 27,
    category: "Bracelets",
    tag: "Classic",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Celestial Diamond Earrings",
    price: 165000,
    comparePrice: 190000,
    discount: "13% OFF",
    rating: 4.9,
    reviews: 41,
    category: "Earrings",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
  },
];

import { fetchProducts, ProductItem } from "../lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [hoveredId, setHoveredId] = useState<number | string | null>(null);

  const categories = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Bridal", "Oxidised Silver"];

  useEffect(() => {
    fetchProducts(selectedCategory, searchTerm).then((data) => setProducts(data));
  }, [selectedCategory, searchTerm]);

  const filtered = products;

  const handleAddToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleToggleWishlist = (product: any) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image }];
    });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
        wishlistCount={wishlistItems.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      <main className="layout-container" style={{ padding: "50px 24px 100px" }}>
        {/* Title */}
        <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 40px" }}>
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-primary)" }}>
            SENKA FASHION CATALOG
          </span>
          <h1 className="font-serif gold-gradient-text" style={{ fontSize: "3rem", margin: "8px 0 12px" }}>
            Jewellery Collections
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Filter by styles, Kundan, Oxidised silver, or Solitaire heirloom rings.
          </p>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "36px",
            padding: "16px 20px",
            background: "rgba(18, 18, 24, 0.6)",
            border: "1px solid var(--gold-line)",
            borderRadius: "var(--radius-md)",
          }}
        >
          {/* Categories */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.8rem",
                  border: selectedCategory === cat ? "1px solid var(--gold-primary)" : "1px solid rgba(255,255,255,0.08)",
                  background: selectedCategory === cat ? "var(--gold-glow)" : "transparent",
                  color: selectedCategory === cat ? "var(--gold-light)" : "var(--text-muted)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: "relative", minWidth: "240px" }}>
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 14px 8px 38px",
                background: "rgba(7,7,9,0.8)",
                border: "1px solid var(--gold-line)",
                borderRadius: "var(--radius-full)",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />
            <Search size={16} color="var(--gold-primary)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          </div>
        </div>

        {/* Products Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "28px" }}>
          {filtered.map((p) => {
            const isWishlisted = wishlistItems.some((item) => item.id === p.id);
            const isHovered = hoveredId === p.id;

            return (
              <div
                key={p.id}
                className="glass-panel card-3d"
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  borderRadius: "var(--radius-md)",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      height: "260px",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      position: "relative",
                      background: `url(${isHovered ? p.secondaryImage : p.image}) center/cover no-repeat`,
                      border: "1px solid rgba(226, 192, 116, 0.2)",
                      transition: "background-image 0.4s ease-in-out",
                      marginBottom: "16px",
                    }}
                  >
                    <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px" }}>
                      <span style={{ background: "rgba(7,7,9,0.85)", border: "1px solid var(--gold-line)", padding: "4px 10px", borderRadius: "var(--radius-full)", fontSize: "0.68rem", color: "var(--gold-light)", textTransform: "uppercase" }}>
                        {p.tag}
                      </span>
                      {p.discount && (
                        <span style={{ background: "var(--ruby)", color: "#FFF", fontWeight: 700, padding: "4px 8px", borderRadius: "12px", fontSize: "0.68rem" }}>
                          {p.discount}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleWishlist(p)}
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        background: "rgba(7,7,9,0.75)",
                        border: "1px solid var(--gold-line)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isWishlisted ? "var(--gold-primary)" : "var(--text-main)",
                      }}
                    >
                      <Heart size={16} fill={isWishlisted ? "var(--gold-primary)" : "none"} />
                    </button>

                    <button
                      onClick={() => setQuickViewProduct(p)}
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        right: "12px",
                        background: "rgba(7, 7, 9, 0.85)",
                        border: "1px solid var(--gold-primary)",
                        color: "var(--gold-light)",
                        borderRadius: "var(--radius-full)",
                        padding: "8px 14px",
                        fontSize: "0.72rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Eye size={14} />
                      <span>Quick View</span>
                    </button>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--gold-primary)", marginBottom: "6px" }}>
                    <Star size={14} fill="var(--gold-primary)" color="var(--gold-primary)" />
                    <span>{p.rating || 5.0} ({p.reviews || 24} reviews)</span>
                  </div>

                  <h3 className="font-serif" style={{ fontSize: "1.4rem", color: "var(--text-main)", margin: "0 0 10px" }}>
                    {p.name}
                  </h3>
                </div>

                <div style={{ paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--gold-light)" }}>
                      PKR {p.price.toLocaleString()}
                    </span>
                    {(p.compare_price || p.comparePrice) && (
                      <span style={{ fontSize: "0.85rem", color: "var(--text-dim)", textDecoration: "line-through" }}>
                        PKR {(p.compare_price || p.comparePrice)?.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button onClick={() => handleAddToCart(p)} className="btn-gold-primary" style={{ width: "100%", padding: "12px", fontSize: "0.8rem" }}>
                    <ShoppingBag size={16} />
                    <span>Add to Shopping Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={(id, delta) => setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i)).filter((i) => i.quantity > 0))}
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((i) => i.id !== id))}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        items={wishlistItems}
        onRemoveItem={(id) => setWishlistItems((prev) => prev.filter((i) => i.id !== id))}
        onMoveToCart={(item) => {
          handleAddToCart(item);
          setWishlistItems((prev) => prev.filter((i) => i.id !== item.id));
        }}
      />

      <QuickViewModal
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={wishlistItems.some((i) => i.id === quickViewProduct?.id)}
      />
    </div>
  );
}
