"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Heart, User, LogOut, ShieldCheck, Menu, X, LayoutDashboard } from "lucide-react";
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
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

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

  // Refresh session on every route change so it doesn't expire mid-session
  useEffect(() => {
    const { user } = getSession();
    setCurrentUser(user);
  }, [pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    clearSession();
    setCurrentUser(null);
    router.push("/login");
  };

  const isAdmin = currentUser?.role === "admin";
  const displayName = currentUser?.first_name || (currentUser?.email?.split("@")[0] ?? "");

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
          {/* Brand */}
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

          {/* Desktop Navigation */}
          <nav style={{ display: "none", alignItems: "center", gap: "28px" }} className="desktop-nav">
            <Link href="/" style={navLink("/")}>Home</Link>
            <Link href="/products" style={navLink("/products")}>Collections</Link>
            <Link href="/about" style={navLink("/about")}>About</Link>
            <Link href="/contact" style={navLink("/contact")}>Contact</Link>
          </nav>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>

            {/* Wishlist */}
            <button onClick={onOpenWishlist} style={{ position: "relative", color: "var(--text-main)", padding: "6px" }} aria-label="Wishlist">
              <Heart size={20} color={wishlistCount > 0 ? "var(--gold-primary)" : "currentColor"} fill={wishlistCount > 0 ? "var(--gold-primary)" : "none"} />
              {wishlistCount > 0 && (
                <span style={{ position: "absolute", top: "0px", right: "0px", width: "16px", height: "16px", borderRadius: "50%", background: "var(--gold-primary)", color: "#070709", fontSize: "0.65rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <div ref={profileRef} style={{ position: "relative" }}>
                {/* Profile Pill — click to open dropdown */}
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    padding: "5px 12px",
                    background: isAdmin ? "rgba(226,192,116,0.18)" : "rgba(255,255,255,0.06)",
                    border: isAdmin ? "1px solid var(--gold-primary)" : "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.75rem",
                    color: isAdmin ? "var(--gold-light)" : "var(--text-main)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                  }}
                >
                  {isAdmin ? <ShieldCheck size={14} color="var(--gold-primary)" /> : <User size={14} />}
                  <span>{displayName}</span>
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      right: 0,
                      minWidth: "180px",
                      background: "rgba(10,10,14,0.98)",
                      border: "1px solid var(--gold-line)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
                      overflow: "hidden",
                      zIndex: 200,
                    }}
                  >
                    {/* Admin Portal shortcut — only for admins */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "12px 16px",
                          fontSize: "0.82rem",
                          color: "var(--gold-light)",
                          background: "rgba(226,192,116,0.06)",
                          borderBottom: "1px solid var(--gold-line)",
                        }}
                      >
                        <LayoutDashboard size={14} color="var(--gold-primary)" />
                        Merchant Portal
                      </Link>
                    )}
                    {/* My Orders */}
                    <Link
                      href="/orders"
                      onClick={() => setProfileOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px 16px",
                        fontSize: "0.82rem",
                        color: "var(--text-muted)",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <ShoppingBag size={14} />
                      My Orders
                    </Link>
                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px 16px",
                        fontSize: "0.82rem",
                        color: "#ef4444",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" style={{ color: "var(--text-main)", padding: "6px" }} aria-label="Account">
                <User size={20} />
              </Link>
            )}

            {/* Cart */}
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
                cursor: "pointer",
              }}
            >
              <ShoppingBag size={18} color="var(--gold-primary)" />
              <span style={{ fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.05em" }}>Bag</span>
              {cartCount > 0 && (
                <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--gold-primary)", color: "#070709", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
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

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div style={{ background: "rgba(7,7,9,0.98)", borderTop: "1px solid var(--gold-line)", padding: "16px 24px 24px" }}>
            {["/", "/products", "/about", "/contact"].map((href) => (
              <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}
                style={{ display: "block", padding: "12px 0", color: pathname === href ? "var(--gold-primary)" : "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {href === "/" ? "Home" : href === "/products" ? "Collections" : href.replace("/", "").charAt(0).toUpperCase() + href.replace("/", "").slice(1)}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}
                style={{ display: "block", padding: "12px 0", color: "var(--gold-light)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                Merchant Portal
              </Link>
            )}
            {currentUser ? (
              <button onClick={handleLogout} style={{ marginTop: "12px", width: "100%", padding: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-sm)", color: "#ef4444", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                style={{ display: "block", marginTop: "12px", padding: "12px", background: "var(--gold-glow)", border: "1px solid var(--gold-primary)", borderRadius: "var(--radius-sm)", color: "var(--gold-light)", fontSize: "0.85rem", textAlign: "center" }}>
                Login
              </Link>
            )}
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
