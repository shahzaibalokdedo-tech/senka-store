"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const slides = [
  {
    tag: "FESTIVE GLAMOUR 2026",
    title: "Royal Kundan & Polki Collections",
    desc: "Handcrafted statement neckpieces and bridal sets forged in hallmark 18K gold and pure gemstones.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1400&auto=format&fit=crop",
    cta: "Explore Kundan Edit",
  },
  {
    tag: "SIGNATURE SOLITAIRES",
    title: "The Modern Heirloom Series",
    desc: "Precision cushion-cut diamonds & halo rings crafted for timeless milestone celebrations.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1400&auto=format&fit=crop",
    cta: "Shop Solitaires",
  },
  {
    tag: "EVERYDAY LUXURY",
    title: "Minimal Oxidised & AD Silver",
    desc: "Elevated everyday accessories engineered with tarnish-resistant finish and contemporary flair.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1400&auto=format&fit=crop",
    cta: "Shop Daily Wear",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section style={{ position: "relative", width: "100%", height: "540px", overflow: "hidden", borderBottom: "1px solid var(--gold-line)" }}>
      {/* Background Image Carousel with Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(90deg, rgba(7,7,9,0.9) 0%, rgba(7,7,9,0.5) 50%, rgba(7,7,9,0.3) 100%), url(${slide.image})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          transition: "background-image 0.8s ease-in-out",
        }}
      />

      {/* Content Overlay Container */}
      <div className="layout-container" style={{ position: "relative", height: "100%", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: "600px", zIndex: 10 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              background: "rgba(226, 192, 116, 0.12)",
              border: "1px solid var(--gold-line)",
              borderRadius: "var(--radius-full)",
              fontSize: "0.75rem",
              color: "var(--gold-light)",
              letterSpacing: "0.15em",
              marginBottom: "20px",
            }}
          >
            <Sparkles size={14} color="var(--gold-primary)" />
            <span>{slide.tag}</span>
          </div>

          <h1 className="font-serif gold-gradient-text" style={{ fontSize: "clamp(2.5rem, 4.5vw, 4.2rem)", lineHeight: 1.08, margin: "0 0 20px" }}>
            {slide.title}
          </h1>

          <p style={{ fontSize: "1.05rem", color: "var(--text-main)", lineHeight: 1.6, marginBottom: "32px", opacity: 0.9 }}>
            {slide.desc}
          </p>

          <Link href="/products" className="btn-gold-primary">
            <span>{slide.cta}</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Slider Controls */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
        style={{
          position: "absolute",
          left: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(7,7,9,0.7)",
          border: "1px solid var(--gold-line)",
          color: "var(--gold-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        style={{
          position: "absolute",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(7,7,9,0.7)",
          border: "1px solid var(--gold-line)",
          color: "var(--gold-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ChevronRight size={22} />
      </button>

      {/* Slide Indicators */}
      <div style={{ position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "10px", zIndex: 20 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            style={{
              width: i === currentSlide ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === currentSlide ? "var(--gold-primary)" : "rgba(255,255,255,0.3)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}
