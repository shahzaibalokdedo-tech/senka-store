"use client";

import React from "react";
import Link from "next/link";

const categories = [
  {
    name: "Earrings",
    count: "120+ Styles",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Necklaces",
    count: "85+ Styles",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Solitaire Rings",
    count: "95+ Styles",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Kundan & Polki",
    count: "60+ Styles",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Oxidised Silver",
    count: "110+ Styles",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Bangles & Cuffs",
    count: "75+ Styles",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Bridal Sets",
    count: "40+ Styles",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400&auto=format&fit=crop",
  },
];

export default function CategoryNav() {
  return (
    <section style={{ padding: "24px 0", background: "rgba(14, 14, 19, 0.4)", borderBottom: "1px solid var(--gold-line)" }}>
      <div className="layout-container">
        <div style={{ display: "flex", gap: "24px", overflowX: "auto", paddingBottom: "10px", scrollbarWidth: "none" }} className="category-scroll">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href="/products"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                flexShrink: 0,
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "82px",
                  height: "82px",
                  borderRadius: "50%",
                  padding: "3px",
                  background: "linear-gradient(135deg, var(--gold-primary), var(--gold-dark))",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                className="category-circle"
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: `url(${cat.image}) center/cover no-repeat`,
                    border: "2px solid #070709",
                  }}
                />
              </div>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)", letterSpacing: "0.02em" }}>
                {cat.name}
              </span>
              <span style={{ fontSize: "0.68rem", color: "var(--gold-primary)", marginTop: "-6px" }}>
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .category-circle:hover {
          transform: scale(1.08);
          box-shadow: 0 10px 25px rgba(226, 192, 116, 0.35) !important;
        }
        .category-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
