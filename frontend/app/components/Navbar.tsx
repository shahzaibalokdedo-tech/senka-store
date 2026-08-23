"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Heart, User, LogOut, ShieldCheck, Menu, X } from "lucide-react";
import AnnouncementBar from "./AnnouncementBar";
import { getSession, clearSession, AuthUser } from "../lib/auth";

interface NavbarProps {
  cartCount?: number;
  wishlistCount?: number;
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
}

export default function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const navLink = (href: string) => ({
    color: pathname === href ? "var(--gold-primary)" : "var(--text-muted)",
    fontSize: "0.85rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    fontWeight: pathname === href ? 600 : 400,
    borderBottom: pathname === href ? "1px solid var(--gold-primary)" : "1px solid transparent",
    paddingBottom: "2px",
    transition: "color 0.2s ease, border-color 0.2s ease",
  });

  useEffect(() => {
    const { user } = getSession();
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    window.location.href = "/login";
  };

  return (
    <>
      <AnnouncementBar />
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(7, 7, 9, 0.92)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid var(--gold-line)",
        }}
      >
        <div className="layout-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "76px" }}>
          {/* Brand Monogram & Name */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "1px solid var(--gold-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--gold-glow)",
                boxShadow: "0 0 20px rgba(226, 192, 116, 0.3)",
              }}
            >
              <span className="font-serif gold-gradient-text" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                S
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className="font-serif gold-gradient-text" style={{ fontSize: "1.65rem", fontWeight: 700, letterSpacing: "0.18em", lineHeight: 1 }}>
                SENKA
              </span>
              <span style={{ fontSize: "0.52rem", letterSpacing: "0.4em", color: "var(--gold-primary)", textTransform: "uppercase", marginTop: "3px" }}>
                LUXURY FASHION STUDIO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav style={{ display: "none", alignItems: "center", gap: "28px" }} className="desktop-nav">
            <Link href="/" style={navLink("/")}>
              Home
            </Link>
            <Link href="/products" style={navLink("/products")}>
              Collections
            </Link>
            <Link href="/about" style={navLink("/about")}>
              About
            </Link>
            <Link href="/contact" style={navLink("/contact")}>
              Contact
            </Link>
          </nav>

          {/* Actions (Wishlist, User Role & Cart) */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>

            {/* Wishlist Toggle Button */}
            <button onClick={onOpenWishlist} style={{ position: "relative", color: "var(--text-main)", padding: "6px" }} aria-label="Wishlist">
              <Heart size={20} color={wishlistCount > 0 ? "var(--gold-primary)" : "currentColor"} fill={wishlistCount > 0 ? "var(--gold-primary)" : "none"} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "var(--gold-primary)",
                    color: "#070709",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Logged In User Pill or Login Link */}
            {currentUser ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    padding: "4px 10px",
                    background: currentUser.role === "admin" ? "rgba(226,192,116,0.18)" : "rgba(255,255,255,0.06)",
                    border: currentUser.role === "admin" ? "1px solid var(--gold-primary)" : "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.75rem",
                    color: currentUser.role === "admin" ? "var(--gold-light)" : "var(--text-main)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {currentUser.role === "admin" && <ShieldCheck size={14} color="var(--gold-primary)" />}
                  <span>{currentUser.first_name || currentUser.email.split("@")[0]}</span>
                </div>
                <button onClick={handleLogout} style={{ color: "var(--text-dim)", padding: "4px" }} title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link href="/login" style={{ color: "var(--text-main)", padding: "6px" }} aria-label="Account">
                <User size={20} />
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: "linear-gradient(135deg, rgba(226, 192, 116, 0.2), rgba(14, 14, 19, 0.8))",
                border: "1px solid var(--gold-primary)",
                borderRadius: "var(--radius-full)",
                color: "var(--gold-light)",
                boxShadow: "0 0 20px rgba(226, 192, 116, 0.2)",
              }}
            >
              <ShoppingBag size={18} color="var(--gold-primary)" />
              <span style={{ fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.05em" }}>Bag</span>
              {cartCount > 0 && (
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "var(--gold-primary)",
                    color: "#070709",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: "var(--text-main)", display: "none" }} className="mobile-menu-btn">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Popup Ticker */}
        {searchOpen && (
          <div style={{ padding: "16px 24px", background: "rgba(14, 14, 19, 0.98)", borderBottom: "1px solid var(--gold-line)" }}>
            <div className="layout-container" style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search Kundan sets, Solitaire rings, Oxidised bangles, Bridal edit..."
                autoFocus
                style={{
                  width: "100%",
                  padding: "14px 20px 14px 44px",
                  background: "rgba(7, 7, 9, 0.85)",
                  border: "1px solid var(--gold-primary)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.95rem",
                  color: "var(--text-main)",
                  outline: "none",
                }}
              />
              <Search size={20} color="var(--gold-primary)" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>
        )}

        <style jsx>{`
          @media (min-width: 768px) {
            .desktop-nav { display: flex !important; }
          }
          @media (max-width: 767px) {
            .mobile-menu-btn { display: block !important; }
          }
        `}</style>
      </header>
    </>
  );
}
