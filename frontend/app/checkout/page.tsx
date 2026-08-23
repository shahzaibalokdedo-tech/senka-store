"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import confetti from "canvas-confetti";
import {
  Lock, CheckCircle2, ArrowLeft, Loader2,
  Truck, ShieldCheck, MessageCircle, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { createOrder, fetchSiteSettings } from "../lib/api";
import { getSession } from "../lib/auth";

const paymentMethods = [
  {
    id: "cod",
    title: "Cash on Delivery (COD)",
    subtitle: "Pay upon receipt & physical inspection of your jewellery",
    icon: Truck,
    badge: "RECOMMENDED",
    enabled: true,
  },
  {
    id: "whatsapp",
    title: "Order via WhatsApp / Direct Contact",
    subtitle: "Confirm details & custom sizes with studio agent (0332 0409268)",
    icon: MessageCircle,
    badge: "INSTANT",
    enabled: true,
  },
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Islamabad");
  const [shippingFee, setShippingFee] = useState(250);

  // Auto-fill logged in user & fetch live admin delivery charge
  useEffect(() => {
    // Auto-fill user from session
    const { user } = getSession();
    if (user) {
      if (user.first_name) setFirstName(user.first_name);
      if (user.last_name) setLastName(user.last_name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }

    // Fetch dynamic delivery fee from Admin Site Settings
    fetchSiteSettings().then((settings) => {
      const delSetting = settings.find((s) => s.key === "delivery_charge");
      if (delSetting && delSetting.value) {
        const parsed = parseFloat(delSetting.value);
        if (!isNaN(parsed)) setShippingFee(parsed);
      }
    });
  }, []);

  const sampleCart = [
    { product_id: 1, name: "Royal Solitaire Halo Ring", metal: "18K Gold", unit_price: 249000, quantity: 1 },
    { product_id: 2, name: "Pearl Emerald Pendant Set", metal: "Platinum", unit_price: 185000, quantity: 1 },
  ];

  const subtotal = sampleCart.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const total = subtotal + shippingFee; // No tax per user requirement

  const validateEmailFormat = (emailStr: string): boolean => {
    if (!emailStr) return true; // Optional or validate required
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(emailStr.trim())) return false;
    const parts = emailStr.split("@");
    if (parts.length !== 2) return false;
    const domain = parts[1].toLowerCase();
    if (!domain.includes(".")) return false;
    const ext = domain.split(".").pop();
    if (!ext || ext.length < 2) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (email && !validateEmailFormat(email)) {
      setEmailError("Please enter a valid email address (e.g. name@gmail.com, name@yahoo.com)");
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      items: sampleCart.map((i) => ({ product_id: i.product_id, quantity: i.quantity, unit_price: i.unit_price, name: i.name })),
      customer_name: `${firstName || "Customer"} ${lastName || ""}`.trim(),
      customer_email: email || undefined,
      customer_phone: phone || "03320409268",
      shipping_address: address || "G9 Markaz",
      first_name: firstName || "Customer",
      last_name: lastName || "",
      email: email || undefined,
      phone: phone || "03320409268",
      address: address || "G9 Markaz",
      city: city || "Islamabad",
      payment_method: paymentMethod,
    };


    const res = await createOrder(orderPayload);
    setIsSubmitting(false);
    setOrderNumber(res.order_number || "SNK-984210");
    setOrderTotal(res.total || total);
    setSubmitted(true);

    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#E2C074", "#F7E4B3", "#A68238", "#FFFFFF", "#FFF8E7"],
    });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="layout-container" style={{ padding: "60px 24px 100px" }}>
        <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--gold-primary)", fontSize: "0.85rem", marginBottom: "32px" }}>
          <ArrowLeft size={16} />
          <span>Return to Catalog</span>
        </Link>

        {submitted ? (
          /* ── ORDER SUCCESS ── */
          <div className="glass-panel-heavy gold-glow-border" style={{ maxWidth: "640px", margin: "0 auto", borderRadius: "var(--radius-lg)", padding: "52px 40px", textAlign: "center" }}>
            <CheckCircle2 size={68} color="var(--gold-primary)" style={{ margin: "0 auto 20px" }} />
            <h1 className="font-serif gold-gradient-text" style={{ fontSize: "2.6rem", margin: "0 0 12px" }}>
              Order Confirmed!
            </h1>
            <p style={{ fontSize: "1.05rem", color: "var(--text-main)", marginBottom: "6px" }}>
              Thank you for choosing Senka Atelier.
            </p>
            {email && (
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "20px" }}>
                A confirmation email has been sent to <strong style={{ color: "var(--gold-light)" }}>{email}</strong>
              </p>
            )}
            <p style={{ fontSize: "0.8rem", color: "var(--gold-light)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "28px" }}>
              Order Reference: <strong>{orderNumber}</strong>
            </p>

            <div style={{ padding: "20px", background: "rgba(7,7,9,0.8)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-md)", marginBottom: "24px", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                <span>Total Paid (PKR)</span>
                <strong style={{ color: "var(--gold-light)" }}>PKR {(orderTotal || total).toLocaleString()}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "var(--text-dim)", marginBottom: "8px" }}>
                <span>Payment Method</span>
                <span style={{ textTransform: "uppercase", fontWeight: 600, color: "var(--gold-light)" }}>{paymentMethod}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-dim)" }}>
                <span>Delivery Status</span>
                <span style={{ color: "var(--emerald)" }}>Insured Priority Dispatch (3–5 days)</span>
              </div>
            </div>

            {/* Direct WhatsApp Contact Button */}
            <div style={{ marginBottom: "28px" }}>
              <a
                href={`https://wa.me/923320409268?text=Hello%20Senka%20Atelier,%20my%20Order%20Ref%20is%20${orderNumber}.%20I%20would%20like%20to%20confirm%20my%20details.`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "16px",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid var(--emerald)",
                  borderRadius: "var(--radius-full)",
                  color: "#6EE7B7",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <MessageCircle size={20} />
                <span>Contact Studio on WhatsApp (0332 0409268)</span>
              </a>
            </div>

            <Link href="/" className="btn-gold-primary" style={{ width: "100%", padding: "16px" }}>
              Return to Homepage
            </Link>
          </div>
        ) : (
          /* ── CHECKOUT FORM ── */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "40px" }} className="checkout-grid">
            {/* Left: Form */}
            <div>
              <h1 className="font-serif gold-gradient-text" style={{ fontSize: "2.8rem", margin: "0 0 6px" }}>Checkout</h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "32px" }}>All orders include insured delivery across Pakistan.</p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Shipping Info */}
                <div className="glass-panel-heavy" style={{ borderRadius: "var(--radius-md)", padding: "28px" }}>
                  <h3 style={{ fontSize: "1rem", color: "var(--gold-light)", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <ShieldCheck size={16} color="var(--gold-primary)" />
                    <span>1. Shipping Information (Pakistan)</span>
                  </h3>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ fontSize: "0.7rem", color: "var(--gold-primary)", display: "block", marginBottom: "5px", textTransform: "uppercase" }}>First Name</label>
                      <input required type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Zara" style={{ width: "100%", padding: "11px", background: "rgba(7,7,9,0.8)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-sm)" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.7rem", color: "var(--gold-primary)", display: "block", marginBottom: "5px", textTransform: "uppercase" }}>Last Name</label>
                      <input required type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Khan" style={{ width: "100%", padding: "11px", background: "rgba(7,7,9,0.8)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-sm)" }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "0.7rem", color: "var(--gold-primary)", display: "block", marginBottom: "5px", textTransform: "uppercase" }}>
                      Email Address (Order Confirmation Receipt)
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                      placeholder="e.g. name@gmail.com, name@yahoo.com"
                      style={{ width: "100%", padding: "11px", background: "rgba(7,7,9,0.8)", border: emailError ? "1px solid var(--ruby)" : "1px solid var(--gold-line)", borderRadius: "var(--radius-sm)" }}
                    />
                    {emailError && (
                      <div style={{ color: "#FCA5A5", fontSize: "0.78rem", marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <AlertCircle size={14} />
                        <span>{emailError}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "0.7rem", color: "var(--gold-primary)", display: "block", marginBottom: "5px", textTransform: "uppercase" }}>Mobile / WhatsApp Number</label>
                    <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0332 0409268" style={{ width: "100%", padding: "11px", background: "rgba(7,7,9,0.8)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-sm)" }} />
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "0.7rem", color: "var(--gold-primary)", display: "block", marginBottom: "5px", textTransform: "uppercase" }}>Street Address</label>
                    <input required type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House #, Street, Block" style={{ width: "100%", padding: "11px", background: "rgba(7,7,9,0.8)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-sm)" }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ fontSize: "0.7rem", color: "var(--gold-primary)", display: "block", marginBottom: "5px", textTransform: "uppercase" }}>City</label>
                      <select value={city} onChange={(e) => setCity(e.target.value)} style={{ width: "100%", padding: "11px", background: "rgba(7,7,9,0.8)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-sm)", color: "var(--text-main)" }}>
                        {["Islamabad","Lahore","Karachi","Rawalpindi","Faisalabad","Multan","Peshawar","Quetta","Sialkot","Gujranwala"].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: "0.7rem", color: "var(--gold-primary)", display: "block", marginBottom: "5px", textTransform: "uppercase" }}>Postal Code</label>
                      <input type="text" placeholder="44000" style={{ width: "100%", padding: "11px", background: "rgba(7,7,9,0.8)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-sm)" }} />
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector (COD + WhatsApp) */}
                <div className="glass-panel-heavy" style={{ borderRadius: "var(--radius-md)", padding: "28px" }}>
                  <h3 style={{ fontSize: "1rem", color: "var(--gold-light)", marginBottom: "18px" }}>2. Select Payment & Order Method</h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {paymentMethods.map((p) => {
                      const isSelected = paymentMethod === p.id;
                      return (
                        <label
                          key={p.id}
                          onClick={() => setPaymentMethod(p.id)}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "14px",
                            padding: "16px",
                            borderRadius: "var(--radius-sm)",
                            border: isSelected ? "1px solid var(--gold-primary)" : "1px solid rgba(255,255,255,0.08)",
                            background: isSelected ? "rgba(226,192,116,0.12)" : "rgba(7,7,9,0.5)",
                            cursor: "pointer",
                          }}
                        >
                          <input type="radio" name="payment" checked={isSelected} onChange={() => {}} style={{ marginTop: "3px" }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                              <p.icon size={16} color={isSelected ? "var(--gold-primary)" : "var(--text-muted)"} />
                              <strong style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>{p.title}</strong>
                              {p.badge && (
                                <span style={{ fontSize: "0.6rem", padding: "1px 6px", borderRadius: "10px", background: "rgba(226,192,116,0.15)", color: "var(--gold-primary)", border: "1px solid var(--gold-line)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                              {p.subtitle}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* Direct WhatsApp Callout */}
                  <div style={{ marginTop: "20px", padding: "16px", background: "rgba(16, 185, 129, 0.08)", border: "1px dashed var(--emerald)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <div style={{ color: "var(--emerald)", fontWeight: 600, fontSize: "0.85rem" }}>Need Instant Assistance?</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Call or WhatsApp our studio direct hotline: <strong style={{ color: "var(--gold-light)" }}>0332 0409268</strong></div>
                    </div>
                    <a
                      href="https://wa.me/923320409268?text=Hello%20Senka%20Atelier,%20I%20would%20like%20to%20place%20an%20order."
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: "8px 14px", background: "rgba(16, 185, 129, 0.2)", border: "1px solid var(--emerald)", borderRadius: "var(--radius-full)", color: "#6EE7B7", fontSize: "0.78rem", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp Direct</span>
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold-primary"
                  style={{ padding: "18px", fontSize: "0.95rem" }}
                >
                  {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" /><span>Recording Order...</span></>
                  ) : (
                    <><Lock size={18} /><span>Place Order — PKR {total.toLocaleString()}</span></>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Order Summary */}
            <div>
              <div className="glass-panel-heavy" style={{ borderRadius: "var(--radius-md)", padding: "28px", position: "sticky", top: "100px" }}>
                <h3 className="font-serif gold-gradient-text" style={{ fontSize: "1.5rem", margin: "0 0 20px" }}>Order Summary</h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
                  {sampleCart.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                      <div>
                        <span style={{ color: "var(--text-main)", display: "block", fontWeight: 500 }}>{item.name}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{item.metal} × {item.quantity}</span>
                      </div>
                      <span style={{ color: "var(--gold-light)", fontWeight: 600 }}>PKR {(item.unit_price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.84rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                    <span>Subtotal</span><span>PKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                    <span>Delivery Charges</span><span style={{ color: "var(--gold-light)", fontWeight: 600 }}>PKR {shippingFee.toLocaleString()}</span>
                  </div>
                  <div style={{ borderTop: "1px solid var(--gold-line)", paddingTop: "14px", marginTop: "4px", display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: 700 }}>
                    <span style={{ color: "var(--text-main)" }}>Total</span>
                    <span className="gold-gradient-text">PKR {total.toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ marginTop: "18px", padding: "12px", background: "rgba(226,192,116,0.06)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-sm)", fontSize: "0.78rem", color: "var(--gold-light)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={14} />
                  <span>Insured courier shipping · 3–5 business days</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
