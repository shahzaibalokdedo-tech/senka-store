"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Mail, Phone, MapPin, Clock, Send, Globe, Share2, MessageCircle, Sparkles } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://senkafashion.com/api";


export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Send via backend email or log
    try {
      await fetch(`${API_BASE}/admin/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to_email: "Senkajewellers@gmail.com",
          subject: `New Contact Enquiry from ${name}`,
          body: `<p>From: ${name} (${email})<br>Phone: ${phone}<br><br>Message:<br>${message}</p>`,
        }),
      });
    } catch (_) {}
    setSending(false);
    setSent(true);
  };

  const contactDetails = [
    { icon: Phone, label: "WhatsApp & Call Studio", value: "0332 0409268", href: "https://wa.me/923320409268" },
    { icon: Mail, label: "Email Us", value: "Senkajewellers@gmail.com", href: "mailto:Senkajewellers@gmail.com" },
    { icon: MapPin, label: "Studio Location", value: "G9 Islamabad, Pakistan", href: "#" },
  ];

  const socials = [
    { icon: Globe, label: "Instagram", handle: "@senkaatelier", href: "https://instagram.com" },
    { icon: Share2, label: "Facebook", handle: "Senka Studio PK", href: "https://facebook.com" },
    { icon: MessageCircle, label: "WhatsApp Direct", handle: "0332 0409268", href: "https://wa.me/923320409268" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main>
        {/* Header */}
        <section style={{ padding: "80px 0 60px", textAlign: "center" }}>
          <div className="layout-container">
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.72rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-primary)", marginBottom: "16px", border: "1px solid var(--gold-line)", padding: "6px 16px", borderRadius: "var(--radius-full)" }}>
              <Sparkles size={12} />
              <span>Get in Touch</span>
            </div>
            <h1 className="font-serif gold-gradient-text" style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)", margin: "0 0 16px" }}>
              Talk to the Studio
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
              Bespoke orders, sizing questions, bridal consultations, or just a conversation — our studio team responds within 2 hours.
            </p>
          </div>
        </section>

        {/* Content Grid */}
        <section style={{ padding: "0 0 100px" }}>
          <div className="contact-grid layout-container" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "48px" }}>
            {/* Left: Contact Info */}
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "36px" }}>
                {contactDetails.map((item, i) => (
                  <a key={i} href={item.href} style={{ textDecoration: "none" }}>
                    <div className="glass-panel shimmer-gold-card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "18px 20px", borderRadius: "var(--radius-md)", transition: "border-color 0.3s ease" }}>
                      <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "var(--gold-glow)", border: "1px solid var(--gold-line)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <item.icon size={20} color="var(--gold-primary)" />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.72rem", color: "var(--gold-primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>{item.label}</div>
                        <div style={{ color: "var(--text-main)", fontWeight: 500 }}>{item.value}</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Direct Studio WhatsApp */}
              <div className="glass-panel" style={{ borderRadius: "var(--radius-md)", padding: "24px" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--gold-primary)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>Direct Studio Support</div>
                <a href="https://wa.me/923320409268" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-main)", fontSize: "0.9rem", textDecoration: "none" }}>
                  <MessageCircle size={20} color="var(--emerald)" />
                  <span style={{ fontWeight: 600 }}>WhatsApp Hotline</span>
                  <span style={{ marginLeft: "auto", color: "var(--gold-light)", fontFamily: "monospace" }}>0332 0409268</span>
                </a>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="glass-panel-heavy" style={{ borderRadius: "var(--radius-lg)", padding: "36px" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✨</div>
                  <h2 className="font-serif gold-gradient-text" style={{ fontSize: "2rem", margin: "0 0 12px" }}>Message Received!</h2>
                  <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
                    Our studio team will respond to your enquiry within 2 hours. Thank you for reaching out.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-serif gold-gradient-text" style={{ fontSize: "1.8rem", margin: "0 0 24px" }}>Send an Enquiry</h2>
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      <div>
                        <label style={{ fontSize: "0.72rem", color: "var(--gold-primary)", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>Full Name</label>
                        <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Zara Ahmed" style={{ width: "100%", padding: "12px", background: "rgba(7,7,9,0.8)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-sm)" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.72rem", color: "var(--gold-primary)", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>Phone</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 300 0000000" style={{ width: "100%", padding: "12px", background: "rgba(7,7,9,0.8)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-sm)" }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "0.72rem", color: "var(--gold-primary)", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>Email</label>
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={{ width: "100%", padding: "12px", background: "rgba(7,7,9,0.8)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-sm)" }} />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.72rem", color: "var(--gold-primary)", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>Message / Enquiry</label>
                      <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. I'd like to enquire about a custom bridal set — size 7, with emerald stones..." style={{ width: "100%", padding: "12px", background: "rgba(7,7,9,0.8)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-sm)", resize: "vertical" }} />
                    </div>

                    <button type="submit" disabled={sending} className="btn-gold-primary" style={{ padding: "16px" }}>
                      <Send size={18} />
                      <span>{sending ? "Sending..." : "Send Enquiry"}</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
