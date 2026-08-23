"use client";

import React, { useState } from "react";
import { X, Check, ShoppingBag, Truck, ShieldCheck, Tag, Heart } from "lucide-react";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string | number;
    name: string;
    price: number;
    comparePrice?: number;
    discount?: string;
    description?: string;
    tag?: string;
    image?: string;
    secondaryImage?: string;
  } | null;
  onAddToCart: (product: any) => void;
  onToggleWishlist?: (product: any) => void;
  isWishlisted?: boolean;
}

export default function QuickViewModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [cityInput, setCityInput] = useState("");
  const [deliveryChecked, setDeliveryChecked] = useState(false);
  const [added, setAdded] = useState(false);

  if (!isOpen || !product) return null;

  const currentImage = selectedImage || product.image || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop";
  const secondaryImg = product.secondaryImage || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop";

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setDeliveryChecked(true);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(12px)" }} />

      {/* Modal Card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "920px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#0E0E13",
          border: "1px solid var(--gold-primary)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(226, 192, 116, 0.2)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          zIndex: 111,
        }}
        className="quickview-grid"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 120,
            color: "var(--text-main)",
            background: "rgba(7, 7, 9, 0.7)",
            border: "1px solid var(--gold-line)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={20} />
        </button>

        {/* Left Column: Gallery & Angle Thumbnails */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              width: "100%",
              height: "380px",
              borderRadius: "var(--radius-md)",
              background: `url(${currentImage}) center/cover no-repeat`,
              border: "1px solid var(--gold-line)",
              position: "relative",
            }}
          >
            {product.discount && (
              <span style={{ position: "absolute", top: "12px", left: "12px", background: "var(--ruby)", color: "#FFF", fontSize: "0.72rem", fontWeight: 700, padding: "4px 10px", borderRadius: "12px" }}>
                {product.discount}
              </span>
            )}
          </div>

          {/* Thumbnail Gallery Row */}
          <div style={{ display: "flex", gap: "12px" }}>
            {[product.image, secondaryImg].filter(Boolean).map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(imgUrl!)}
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "var(--radius-sm)",
                  background: `url(${imgUrl}) center/cover no-repeat`,
                  border: currentImage === imgUrl ? "2px solid var(--gold-primary)" : "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Information & Delivery Checker */}
        <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-primary)", background: "rgba(226,192,116,0.1)", padding: "2px 10px", borderRadius: "var(--radius-full)" }}>
                {product.tag || "Bestseller"}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--emerald)" }}>In Stock • Certified 18K</span>
            </div>

            <h2 className="font-serif" style={{ fontSize: "1.8rem", color: "var(--text-main)", margin: "0 0 12px", lineHeight: 1.15 }}>
              {product.name}
            </h2>

            {/* Pricing */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "18px" }}>
              <span style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--gold-light)" }}>
                PKR {Number(product.price || 0).toLocaleString()}
              </span>
              {product.comparePrice && (
                <span style={{ fontSize: "1.05rem", color: "var(--text-dim)", textDecoration: "line-through" }}>
                  PKR {Number(product.comparePrice || 0).toLocaleString()}
                </span>
              )}

            </div>


            {/* City Pincode Delivery Checker */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "0.75rem", color: "var(--gold-primary)", display: "block", marginBottom: "6px" }}>
                Check Express Courier Delivery
              </label>
              <form onSubmit={handleCheckDelivery} style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Enter City (e.g. Lahore, Karachi, Multan)"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  style={{ flex: 1, padding: "8px 12px", background: "rgba(7,7,9,0.8)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-sm)", fontSize: "0.82rem" }}
                />
                <button type="submit" className="btn-gold-outline" style={{ padding: "8px 14px", fontSize: "0.75rem" }}>
                  Check
                </button>
              </form>
              {deliveryChecked && (
                <p style={{ fontSize: "0.75rem", color: "var(--emerald)", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Truck size={14} /> Express delivery available to <strong>{cityInput}</strong> in 24–48 hours!
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handleAdd} className="btn-gold-primary" style={{ flex: 1, padding: "14px" }}>
              {added ? (
                <>
                  <Check size={18} />
                  <span>Added to Shopping Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Add to Shopping Bag</span>
                </>
              )}
            </button>

            {onToggleWishlist && (
              <button
                onClick={() => onToggleWishlist(product)}
                style={{
                  padding: "14px",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--gold-primary)",
                  background: isWishlisted ? "var(--gold-primary)" : "transparent",
                  color: isWishlisted ? "#070709" : "var(--gold-light)",
                }}
              >
                <Heart size={20} fill={isWishlisted ? "#070709" : "none"} />
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .quickview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
