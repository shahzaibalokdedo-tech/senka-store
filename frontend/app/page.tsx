"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import CategoryNav from "./components/CategoryNav";
import HeroSlider from "./components/HeroSlider";
import CartDrawer, { CartItem } from "./components/CartDrawer";
import WishlistDrawer, { WishlistItem } from "./components/WishlistDrawer";
import QuickViewModal from "./components/QuickViewModal";
import { Heart, Eye, ShoppingBag, Star, ShieldCheck, Award, Truck, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { fetchProducts, ProductItem } from "./lib/api";

export default function HomePage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: "Royal Solitaire Halo Ring", price: 249000, quantity: 1, metal: "18K Gold" },
  ]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<number | string | null>(null);

  useEffect(() => {
    fetchProducts().then((data) => setProducts(data));
  }, []);

  const handleAddToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: Number(product.price || 0),
        quantity: 1,
        image: product.image || product.image_url,
        metal: product.metal_type || product.metal || "18K Gold Atelier"
      }];
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
      {/* Top Navbar */}
      <Navbar
        cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
        wishlistCount={wishlistItems.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      {/* Category Navigation Bar (Voylla Style) */}
      <CategoryNav />

      {/* Editorial Hero Slider (Adore By Priyanka Style) */}
      <HeroSlider />

      {/* Trust & Hallmark Strip */}
      <section style={{ borderBottom: "1px solid var(--gold-line)", background: "rgba(14, 14, 19, 0.6)", padding: "20px 0" }}>
        <div className="layout-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <Award size={22} color="var(--gold-primary)" />
            <span style={{ fontSize: "0.82rem", letterSpacing: "0.06em", color: "var(--gold-light)" }}>100% Certified 18K Gold</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <ShieldCheck size={22} color="var(--gold-primary)" />
            <span style={{ fontSize: "0.82rem", letterSpacing: "0.06em", color: "var(--gold-light)" }}>Lifetime Valuation & Exchange</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <Truck size={22} color="var(--gold-primary)" />
            <span style={{ fontSize: "0.82rem", letterSpacing: "0.06em", color: "var(--gold-light)" }}>Express Insured Delivery across Pakistan</span>
          </div>
        </div>
      </section>

      {/* Shop by Occasion / Craft Grid */}
      <section style={{ padding: "70px 0 40px" }}>
        <div className="layout-container">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 40px" }}>
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-primary)" }}>CURATED STYLES</span>
            <h2 className="font-serif gold-gradient-text" style={{ fontSize: "2.8rem", margin: "8px 0 12px" }}>
              Shop by Craft & Occasion
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Explore heritage craftsmanship tailored for weddings, celebrations, and refined daily wear.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {[
              { title: "Kundan & Polki Edit", subtitle: "Handcrafted Heritage", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop" },
              { title: "Solitaire Halo Rings", subtitle: "Diamond Excellence", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop" },
              { title: "Oxidised Silver Essentials", subtitle: "Daily Wear Chic", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop" },
              { title: "Bridal Charm Sets", subtitle: "For Grand Celebrations", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop" },
            ].map((item, idx) => (
              <Link
                key={idx}
                href="/products"
                className="glass-panel"
                style={{
                  height: "280px",
                  borderRadius: "var(--radius-md)",
                  backgroundImage: `linear-gradient(0deg, rgba(7,7,9,0.9) 0%, rgba(7,7,9,0.2) 60%), url(${item.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "24px",
                  textDecoration: "none",
                  transition: "transform 0.3s ease, border-color 0.3s ease",
                }}
              >
                <span style={{ fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold-primary)" }}>{item.subtitle}</span>
                <h3 className="font-serif" style={{ fontSize: "1.6rem", color: "var(--text-main)", margin: "4px 0 0" }}>{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Bestsellers Product Showcase */}
      <section style={{ padding: "40px 0 80px" }}>
        <div className="layout-container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-primary)" }}>TRENDING PIECES</span>
              <h2 className="font-serif gold-gradient-text" style={{ fontSize: "2.8rem", margin: "4px 0 0" }}>
                Bestselling Fashion Jewellery
              </h2>
            </div>
            <Link href="/products" className="btn-gold-outline" style={{ fontSize: "0.8rem", padding: "10px 20px" }}>
              View Entire Collection
            </Link>
          </div>

          {/* Product Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: "28px" }}>
            {products.map((p) => {
              const isWishlisted = wishlistItems.some((item) => item.id === p.id);
              const isHovered = hoveredCardId === p.id;

              return (
                <div
                  key={p.id}
                  className="glass-panel card-3d"
                  onMouseEnter={() => setHoveredCardId(p.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  style={{
                    borderRadius: "var(--radius-md)",
                    padding: "18px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {/* Image Box with Dual Image Hover Swap */}
                    <div
                      style={{
                        height: "280px",
                        borderRadius: "var(--radius-sm)",
                        overflow: "hidden",
                        position: "relative",
                        background: `url(${isHovered ? p.secondaryImage : p.image}) center/cover no-repeat`,
                        border: "1px solid rgba(226, 192, 116, 0.2)",
                        transition: "background-image 0.4s ease-in-out",
                        marginBottom: "18px",
                      }}
                    >
                      {/* Badges */}
                      <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px" }}>
                        <span style={{ background: "rgba(7, 7, 9, 0.85)", backdropFilter: "blur(8px)", border: "1px solid var(--gold-line)", padding: "4px 10px", borderRadius: "var(--radius-full)", fontSize: "0.68rem", color: "var(--gold-light)", textTransform: "uppercase" }}>
                          {p.tag}
                        </span>
                        {p.discount && (
                          <span style={{ background: "var(--ruby)", color: "#FFF", fontWeight: 700, padding: "4px 8px", borderRadius: "12px", fontSize: "0.68rem" }}>
                            {p.discount}
                          </span>
                        )}
                      </div>

                      {/* Wishlist Heart Button */}
                      <button
                        onClick={() => handleToggleWishlist(p)}
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          background: "rgba(7, 7, 9, 0.75)",
                          border: "1px solid var(--gold-line)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isWishlisted ? "var(--gold-primary)" : "var(--text-main)",
                        }}
                      >
                        <Heart size={16} fill={isWishlisted ? "var(--gold-primary)" : "none"} />
                      </button>

                      {/* Quick View Button */}
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

                    {/* Product Meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--gold-primary)", marginBottom: "6px" }}>
                      <Star size={14} fill="var(--gold-primary)" color="var(--gold-primary)" />
                      <span>{p.rating || 5.0} ({p.reviews || 24} reviews)</span>
                    </div>

                    <h3 className="font-serif" style={{ fontSize: "1.4rem", color: "var(--text-main)", margin: "0 0 10px" }}>
                      {p.name}
                    </h3>
                  </div>

                  {/* Pricing & Add Button */}
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
        </div>
      </section>

      {/* Drawers */}
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

      {/* Footer */}
      <footer style={{ marginTop: "auto", borderTop: "1px solid var(--gold-line)", background: "#050507", padding: "60px 0 30px" }}>
        <div className="layout-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "40px", marginBottom: "40px" }}>
          <div>
            <span className="font-serif gold-gradient-text" style={{ fontSize: "1.8rem", fontWeight: 700, letterSpacing: "0.15em" }}>
              SENKA
            </span>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6, marginTop: "12px" }}>
              Pakistan&apos;s luxury fashion jewellery studio inspired by Voylla & Ishhaara elegance. 100% hallmarked gold, Kundan, Polki & sterling silver.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold-primary)", marginBottom: "16px" }}>
              Shop Categories
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <Link href="/products">Earrings & Jhumkas</Link>
              <Link href="/products">Kundan & Polki Sets</Link>
              <Link href="/products">Solitaire Rings</Link>
              <Link href="/products">Bangles & Cuffs</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold-primary)", marginBottom: "16px" }}>
              Help & Concierge
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <Link href="/about">Heritage Story</Link>
              <Link href="/contact">Book Consultation</Link>
              <Link href="/admin">Merchant Portal</Link>
            </div>
          </div>
        </div>
        <div className="layout-container" style={{ textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px", fontSize: "0.75rem", color: "var(--text-dim)" }}>
          © 2026 Senka Fashion Jewellery Studio. PKR Pricing & Express Insured Shipping Enforced.
        </div>
      </footer>
    </div>
  );
}
