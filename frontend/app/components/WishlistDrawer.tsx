"use client";

import React from "react";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";

export interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  category?: string;
}

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: WishlistItem[];
  onRemoveItem: (id: string | number) => void;
  onMoveToCart: (item: WishlistItem) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onMoveToCart,
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }} />

      {/* Drawer */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "440px",
          height: "100vh",
          background: "#0E0E13",
          borderLeft: "1px solid var(--gold-line)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.8)",
          zIndex: 101,
        }}
      >
        {/* Header */}
        <div style={{ padding: "24px", borderBottom: "1px solid rgba(226,192,116,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Heart size={20} color="var(--gold-primary)" fill="var(--gold-primary)" />
            <h2 className="font-serif gold-gradient-text" style={{ fontSize: "1.6rem", margin: 0 }}>
              Saved Wishlist ({items.length})
            </h2>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-main)", padding: "4px" }}>
            <X size={24} />
          </button>
        </div>

        {/* Item List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {items.length === 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textTransform: "center", color: "var(--text-muted)", gap: "12px" }}>
              <Heart size={40} color="var(--gold-dark)" />
              <p style={{ fontSize: "1rem" }}>Your wishlist is currently empty.</p>
              <button onClick={onClose} className="btn-gold-outline" style={{ fontSize: "0.75rem", padding: "10px 20px" }}>
                Browse Catalog & Save Favorites
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "16px",
                  background: "rgba(18, 18, 24, 0.7)",
                  border: "1px solid rgba(226, 192, 116, 0.15)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "var(--radius-sm)",
                    background: item.image ? `url(${item.image}) center/cover no-repeat` : "rgba(226,192,116,0.1)",
                    border: "1px solid rgba(226,192,116,0.2)",
                  }}
                />

                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h4 style={{ fontSize: "0.95rem", color: "var(--text-main)", fontWeight: 600, margin: "0 0 4px" }}>
                        {item.name}
                      </h4>
                      <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--gold-light)" }}>
                        PKR {item.price.toLocaleString()}
                      </span>
                    </div>
                    <button onClick={() => onRemoveItem(item.id)} style={{ color: "var(--text-dim)", padding: "2px" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => onMoveToCart(item)}
                    className="btn-gold-primary"
                    style={{ padding: "8px 12px", fontSize: "0.75rem", marginTop: "12px" }}
                  >
                    <ShoppingBag size={14} />
                    <span>Move to Shopping Bag</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
