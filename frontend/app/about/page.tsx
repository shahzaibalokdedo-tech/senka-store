"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { Diamond, Award, Users, Globe, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

const timeline = [
  { year: "2015", title: "The Beginning", desc: "Senka was born in a small Lahore workshop, with a single mission: to bring heirloom-quality craftsmanship to modern fashion jewellery." },
  { year: "2018", title: "First Collection", desc: "Our debut Kundan & Polki collection sold out in 48 hours, establishing Senka as Pakistan's most anticipated jewellery label." },
  { year: "2020", title: "Bridal Edit", desc: "We launched our iconic Bridal Edit — handcrafted sets worn by over 200 brides across Lahore, Karachi, and Islamabad." },
  { year: "2023", title: "Digital Studio", desc: "Senka went online — making our 18K gold hallmarked jewellery accessible to customers across all of Pakistan." },
  { year: "2025", title: "Today", desc: "From solitaire rings to full bridal sets — over 50,000 pieces crafted, and every one tells a story." },
];

const values = [
  { icon: Diamond, title: "Hallmarked Quality", desc: "Every Senka piece is verified 18K gold or sterling silver — no shortcuts, ever." },
  { icon: Award, title: "Artisan Crafted", desc: "Each piece passes through 12 skilled hands before reaching yours." },
  { icon: Users, title: "Women-Founded", desc: "Built by Pakistani women, for Pakistani women who deserve to feel extraordinary." },
  { icon: Globe, title: "Shipped Nationwide", desc: "Free insured courier delivery to every city in Pakistan within 3–5 days." },
  { icon: ShieldCheck, title: "Authenticity Guaranteed", desc: "Every order comes with an authenticity certificate and a 1-year craftsmanship warranty." },
  { icon: Sparkles, title: "Bespoke Orders", desc: "Custom engravings, stone selections, and sizing — talk to our studio team." },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main>
        {/* Hero */}
        <section style={{ padding: "80px 0 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 0%, rgba(226,192,116,0.14) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div className="layout-container" style={{ position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.72rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-primary)", marginBottom: "16px", border: "1px solid var(--gold-line)", padding: "6px 16px", borderRadius: "var(--radius-full)" }}>
              <Sparkles size={12} />
              <span>Our Story</span>
            </div>
            <h1 className="font-serif gold-gradient-text" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", margin: "0 0 20px", lineHeight: 1.1 }}>
              Crafted with Soul,<br />Worn with Pride
            </h1>
            <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: "640px", margin: "0 auto 36px", lineHeight: 1.7 }}>
              Senka is Pakistan's foremost luxury fashion jewellery studio — where ancient Mughal goldsmithing traditions meet contemporary design. Every piece we create carries a story centuries in the making.
            </p>
            <Link href="/products" className="btn-gold-primary">
              <Diamond size={18} />
              <span>Explore the Collection</span>
            </Link>
          </div>
        </section>

        {/* Our Values */}
        <section style={{ padding: "60px 0 80px" }}>
          <div className="layout-container">
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-primary)" }}>What We Stand For</span>
              <h2 className="font-serif gold-gradient-text" style={{ fontSize: "2.6rem", margin: "6px 0 0" }}>The Senka Promise</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
              {values.map((v, i) => (
                <div key={i} className="glass-panel shimmer-gold-card card-3d" style={{ borderRadius: "var(--radius-md)", padding: "28px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--gold-glow)", border: "1px solid var(--gold-line)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                    <v.icon size={22} color="var(--gold-primary)" />
                  </div>
                  <h3 className="font-serif" style={{ fontSize: "1.3rem", color: "var(--gold-light)", margin: "0 0 10px" }}>{v.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section style={{ padding: "60px 0 80px", background: "rgba(10,10,14,0.6)" }}>
          <div className="layout-container">
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-primary)" }}>Our Journey</span>
              <h2 className="font-serif gold-gradient-text" style={{ fontSize: "2.6rem", margin: "6px 0 0" }}>A Decade in the Making</h2>
            </div>
            <div style={{ position: "relative", maxWidth: "700px", margin: "0 auto" }}>
              <div style={{ position: "absolute", left: "28px", top: 0, bottom: 0, width: "1px", background: "var(--gold-line)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
                {timeline.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "32px", paddingLeft: "8px" }}>
                    <div style={{ flexShrink: 0, width: "40px", height: "40px", borderRadius: "50%", background: "var(--bg-obsidian)", border: "2px solid var(--gold-primary)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                      <span className="font-serif gold-gradient-text" style={{ fontSize: "0.6rem", fontWeight: 700 }}>{item.year}</span>
                    </div>
                    <div className="glass-panel" style={{ flex: 1, borderRadius: "var(--radius-md)", padding: "20px 24px" }}>
                      <div style={{ fontSize: "0.72rem", color: "var(--gold-primary)", letterSpacing: "0.15em", marginBottom: "4px" }}>{item.year}</div>
                      <h3 className="font-serif" style={{ fontSize: "1.2rem", color: "var(--gold-light)", margin: "0 0 8px" }}>{item.title}</h3>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "80px 0", textAlign: "center" }}>
          <div className="layout-container">
            <div className="glass-panel-heavy" style={{ borderRadius: "var(--radius-lg)", padding: "60px 40px", maxWidth: "700px", margin: "0 auto" }}>
              <h2 className="font-serif gold-gradient-text" style={{ fontSize: "2.8rem", margin: "0 0 16px" }}>
                Ready to Find Your Piece?
              </h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.7 }}>
                Browse our full collection of Kundan, Solitaire, Oxidised Silver, and Bridal sets — all delivered insured to your door.
              </p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/products" className="btn-gold-primary">
                  <span>Shop Now</span>
                  <ArrowRight size={18} />
                </Link>
                <Link href="/contact" className="btn-gold-outline">
                  <span>Talk to Studio</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
