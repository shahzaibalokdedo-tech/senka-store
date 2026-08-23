"use client";

import React from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from "lucide-react";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  metal?: string;
  tag?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string | number, delta: number) => void;
  onRemoveItem: (id: string | number) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 500000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Slide Drawer Content */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "460px",
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
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid rgba(226, 192, 116, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 className="font-serif gold-gradient-text" style={{ fontSize: "1.6rem", margin: 0 }}>
              Shopping Bag
            </h2>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", background: "rgba(226,192,116,0.1)", padding: "2px 8px", borderRadius: "12px" }}>
              {items.reduce((sum, item) => sum + item.quantity, 0)} Items
            </span>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-main)", padding: "4px" }}>
            <X size={24} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ padding: "16px 24px", background: "rgba(226, 192, 116, 0.04)", borderBottom: "1px solid rgba(226,192,116,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "var(--gold-light)", marginBottom: "8px" }}>
            <Truck size={16} color="var(--gold-primary)" />
            {subtotal >= freeShippingThreshold ? (
              <span>Complimentary insured shipping unlocked across Pakistan!</span>
            ) : (
              <span>
                Add <strong>PKR {(freeShippingThreshold - subtotal).toLocaleString()}</strong> more for free insured shipping
              </span>
            )}
          </div>
          <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                background: "linear-gradient(90deg, var(--gold-dark), var(--gold-primary))",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {items.length === 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textTransform: "center", color: "var(--text-muted)", gap: "12px" }}>
              <p style={{ fontSize: "1.1rem" }}>Your shopping bag is currently empty.</p>
              <button onClick={onClose} className="btn-gold-outline" style={{ fontSize: "0.75rem", padding: "10px 20px" }}>
                Explore Atelier Pieces
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
                {/* Product Thumbnail / 3D Canvas Mock */}
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "var(--radius-sm)",
                    background: "radial-gradient(circle, rgba(226,192,116,0.2) 0%, rgba(14,14,19,0.9) 100%)",
                    border: "1px solid rgba(226,192,116,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="font-serif gold-gradient-text" style={{ fontSize: "1.8rem", fontWeight: 700 }}>
                    S
                  </span>
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h4 style={{ fontSize: "0.95rem", color: "var(--text-main)", fontWeight: 600, margin: "0 0 4px" }}>
                        {item.name}
                      </h4>
                      <p style={{ fontSize: "0.75rem", color: "var(--gold-primary)", margin: 0 }}>
                        {item.metal || "18K Gold Atelier"}
                      </p>
                    </div>
                    <button onClick={() => onRemoveItem(item.id)} style={{ color: "var(--text-dim)", padding: "2px" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                    {/* Quantity Controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-full)", padding: "2px 8px" }}>
                      <button onClick={() => onUpdateQuantity(item.id, -1)} style={{ color: "var(--text-muted)" }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)", minWidth: "16px", textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} style={{ color: "var(--text-muted)" }}>
                        <Plus size={12} />
                      </button>
                    </div>

                    <span style={{ fontWeight: 600, color: "var(--gold-light)", fontSize: "0.95rem" }}>
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div
            style={{
              padding: "24px",
              borderTop: "1px solid rgba(226, 192, 116, 0.2)",
              background: "rgba(7, 7, 9, 0.95)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
              <span className="font-serif gold-gradient-text" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                PKR {subtotal.toLocaleString()}
              </span>
            </div>

            <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", margin: 0 }}>
              Taxes and insured courier shipping calculated at checkout.
            </p>

            <Link href="/checkout" onClick={onClose} className="btn-gold-primary" style={{ width: "100%", padding: "16px" }}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </Link>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.72rem", color: "var(--text-muted)" }}>
              <ShieldCheck size={14} color="var(--gold-primary)" />
              <span>Insured 24-48hr Courier Delivery Across Pakistan</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
