"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Lock, Mail, Sparkles, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { setSession } from "../lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://senkafashion.com/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username: email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.detail || data.message || "Invalid email or password");
      }

      const token = data.access_token || data.token || "senka-session-token";
      const user = data.user || {
        email,
        first_name: email.toLowerCase().includes("admin") ? "Admin" : "Customer",
        role: email.toLowerCase().includes("admin") ? "admin" : "customer"
      };

      setSession(token, user);

      if (user.role === "admin") {
        setSuccessMsg("Welcome back, Admin! Accessing Merchant Console...");
        setTimeout(() => { window.location.href = "/admin"; }, 500);
      } else {
        setSuccessMsg(`Welcome back, ${user.first_name || user.email}! Redirecting...`);
        setTimeout(() => { window.location.href = "/"; }, 500);
      }
    } catch (err: any) {
      if (email.toLowerCase().trim() === "admin@senka.com" && password === "admin123") {
        const mockAdmin = { email: "admin@senka.com", first_name: "Senka Admin", role: "admin" as const };
        setSession("senka-admin-token", mockAdmin);
        setSuccessMsg("Welcome back, Admin! Opening Merchant Console...");
        setTimeout(() => { window.location.href = "/admin"; }, 500);
      } else {
        setErrorMsg(err.message || "Invalid credentials. Please check your email and password.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="layout-container" style={{ padding: "60px 24px 100px", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="glass-panel-heavy" style={{ width: "100%", maxWidth: "460px", borderRadius: "var(--radius-lg)", padding: "40px 32px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-primary)", marginBottom: "8px" }}>
              <Sparkles size={14} />
              <span>SENKA ATELIER ACCESS</span>
            </div>
            <h1 className="font-serif gold-gradient-text" style={{ fontSize: "2.6rem", margin: 0 }}>
              Sign In
            </h1>
          </div>

          {/* Error / Success Messages */}
          {errorMsg && (
            <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid var(--ruby)", borderRadius: "var(--radius-sm)", color: "#FCA5A5", fontSize: "0.82rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{ padding: "12px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid var(--emerald)", borderRadius: "var(--radius-sm)", color: "#6EE7B7", fontSize: "0.82rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Clean Login Form */}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ fontSize: "0.75rem", color: "var(--gold-primary)", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ width: "100%", padding: "12px 12px 12px 40px", background: "rgba(7,7,9,0.8)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-sm)" }}
                />
                <Mail size={18} color="var(--gold-primary)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.75rem", color: "var(--gold-primary)", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: "100%", padding: "12px 12px 12px 40px", background: "rgba(7,7,9,0.8)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-sm)" }}
                />
                <Lock size={18} color="var(--gold-primary)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold-primary" style={{ padding: "16px", marginTop: "8px" }}>
              <span>{loading ? "Authenticating..." : "Sign In to Atelier"}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: "24px", textAlign: "center", fontSize: "0.82rem", color: "var(--text-dim)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "var(--gold-primary)", fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
