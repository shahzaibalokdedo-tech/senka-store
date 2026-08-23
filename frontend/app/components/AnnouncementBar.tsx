"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ChevronLeft, ChevronRight, X } from "lucide-react";

const announcements = [
  "✨ Free Insured Shipping Across Pakistan on Orders Over PKR 50,000 | Code: SENKA10",
  "💎 100% Certified 18K Gold, Kundan & Polki Jewelry | Lifetime Valuation",
  "🌸 Festive Glam Collection 2026 Live Now | Extra 15% OFF on Sets",
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #8B6828 0%, #E2C074 50%, #8B6828 100%)",
        color: "#070709",
        padding: "8px 16px",
        fontSize: "0.78rem",
        fontWeight: 600,
        letterSpacing: "0.06em",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 60,
      }}
    >
      <button
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1))}
        style={{ color: "#070709", opacity: 0.8, padding: "2px" }}
      >
        <ChevronLeft size={14} />
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", textAlign: "center" }}>
        <Sparkles size={14} color="#070709" />
        <span>{announcements[currentIndex]}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % announcements.length)}
          style={{ color: "#070709", opacity: 0.8, padding: "2px" }}
        >
          <ChevronRight size={14} />
        </button>
        <button onClick={() => setVisible(false)} style={{ color: "#070709", opacity: 0.7, padding: "2px" }}>
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
