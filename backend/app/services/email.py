"""
Gmail SMTP Email Service for Senka
====================================
Set in .env:
    SMTP_EMAIL=your.gmail@gmail.com
    SMTP_PASSWORD=xxxx xxxx xxxx xxxx   (Gmail App Password — 16 chars)
    SMTP_ENABLED=True

Get a Gmail App Password at:
    https://myaccount.google.com/apppasswords
"""
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import settings


def send_order_confirmation(
    to_email: str,
    customer_name: str,
    order_number: str,
    items: list,
    subtotal: float,
    tax: float,
    total: float,
    payment_method: str,
    city: str,
) -> bool:
    """Send a beautifully formatted order confirmation email."""
    if not settings.smtp_enabled or not settings.smtp_email or not settings.smtp_password:
        print(f"[Email] SMTP disabled — skipping confirmation for {to_email}. Order: {order_number}")
        return False

    items_rows = ""
    for item in items:
        items_rows += f"""
        <tr>
          <td style="padding:10px 14px;color:#F7F3EB;border-bottom:1px solid #2a2a2a;">{item.get('name','Product')}</td>
          <td style="padding:10px 14px;color:#B8B0A0;border-bottom:1px solid #2a2a2a;text-align:center;">{item.get('quantity',1)}</td>
          <td style="padding:10px 14px;color:#E2C074;border-bottom:1px solid #2a2a2a;text-align:right;font-weight:600;">PKR {item.get('unit_price',0):,.0f}</td>
        </tr>"""

    html = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background-color:#050507;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <!-- Header -->
        <div style="text-align:center;padding:32px;background:linear-gradient(135deg,#0c0c10,#1a1a22);border:1px solid #3a3020;border-radius:16px;margin-bottom:24px;">
          <div style="font-size:2.4rem;font-weight:700;letter-spacing:0.18em;color:#E2C074;margin-bottom:4px;">SENKA</div>
          <div style="font-size:0.65rem;letter-spacing:0.4em;color:#A68238;text-transform:uppercase;">LUXURY FASHION STUDIO</div>
        </div>

        <!-- Confirmation Banner -->
        <div style="background:linear-gradient(135deg,#1a1509,#0c0c10);border:1px solid #E2C074;border-radius:12px;padding:28px;text-align:center;margin-bottom:24px;">
          <div style="font-size:2rem;margin-bottom:8px;">✨</div>
          <h1 style="color:#E2C074;font-size:1.6rem;margin:0 0 8px;">Order Confirmed!</h1>
          <p style="color:#B8B0A0;margin:0 0 12px;">Thank you, {customer_name}. Your order has been placed successfully.</p>
          <div style="display:inline-block;padding:8px 20px;background:rgba(226,192,116,0.15);border:1px solid #E2C074;border-radius:50px;">
            <span style="color:#F8E6B8;font-size:0.9rem;font-weight:600;">Order Ref: {order_number}</span>
          </div>
        </div>

        <!-- Order Table -->
        <div style="background:#0c0c10;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;margin-bottom:24px;">
          <div style="padding:16px 20px;background:#111118;border-bottom:1px solid #2a2a2a;">
            <span style="color:#E2C074;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;">Order Details</span>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#0a0a0e;">
                <th style="padding:10px 14px;color:#A68238;font-size:0.8rem;text-align:left;font-weight:500;">Item</th>
                <th style="padding:10px 14px;color:#A68238;font-size:0.8rem;text-align:center;font-weight:500;">Qty</th>
                <th style="padding:10px 14px;color:#A68238;font-size:0.8rem;text-align:right;font-weight:500;">Price</th>
              </tr>
            </thead>
            <tbody>{items_rows}</tbody>
          </table>
          <div style="padding:16px 20px;border-top:1px solid #E2C074;">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
              <span style="color:#B8B0A0;font-size:0.85rem;">Subtotal</span>
              <span style="color:#F7F3EB;font-size:0.85rem;">PKR {subtotal:,.0f}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#B8B0A0;font-size:0.85rem;">Delivery Charges</span>
              <span style="color:#E2C074;font-size:0.85rem;font-weight:600;">PKR {(total - subtotal):,.0f}</span>
            </div>
            <div style="display:flex;justify-content:space-between;border-top:1px solid #333;padding-top:10px;margin-top:6px;">
              <span style="color:#E2C074;font-size:1.1rem;font-weight:700;">Total</span>
              <span style="color:#E2C074;font-size:1.1rem;font-weight:700;">PKR {total:,.0f}</span>
            </div>
          </div>
        </div>

        <!-- Delivery Info -->
        <div style="background:#0c0c10;border:1px solid #2a2a2a;border-radius:12px;padding:20px;margin-bottom:24px;">
          <p style="color:#A68238;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 10px;">Shipping To</p>
          <p style="color:#F7F3EB;margin:0 0 4px;">{city}</p>
          <p style="color:#B8B0A0;font-size:0.85rem;margin:0;">Payment Method: {payment_method.upper()}</p>
          <p style="color:#10B981;font-size:0.85rem;margin:8px 0 0;">📦 Expected delivery within 3–5 business days via insured courier.</p>
        </div>

        <!-- Footer -->
        <div style="text-align:center;padding:20px;">
          <p style="color:#7A7468;font-size:0.8rem;margin:0 0 4px;">Senka Luxury Fashion Studio — Pakistan</p>
          <p style="color:#7A7468;font-size:0.75rem;margin:0;">This is an automated confirmation. Reply to this email for support.</p>
        </div>
      </div>
    </body>
    </html>
    """

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"✨ Order {order_number} Confirmed — Senka Atelier"
        msg["From"] = f"Senka Luxury Studio <{settings.smtp_email}>"
        msg["To"] = to_email

        msg.attach(MIMEText(f"Order {order_number} confirmed. Total: PKR {total:,.0f}", "plain"))
        msg.attach(MIMEText(html, "html"))

        context = ssl.create_default_context()
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.ehlo()
            server.starttls(context=context)
            server.login(settings.smtp_email, settings.smtp_password)
            server.sendmail(settings.smtp_email, to_email, msg.as_string())

        print(f"[Email] [OK] Confirmation sent to {to_email} for order {order_number}")
        return True

    except Exception as e:
        print(f"[Email] [FAIL] Failed to send to {to_email}: {e}")
        return False


def send_custom_email(to_email: str, subject: str, body_html: str) -> bool:
    """Admin: Send any custom HTML email to a customer."""
    if not settings.smtp_enabled or not settings.smtp_email or not settings.smtp_password:
        print(f"[Email] SMTP disabled — cannot send custom email to {to_email}")
        return False
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"Senka Luxury Studio <{settings.smtp_email}>"
        msg["To"] = to_email
        msg.attach(MIMEText(body_html, "html"))

        context = ssl.create_default_context()
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.ehlo()
            server.starttls(context=context)
            server.login(settings.smtp_email, settings.smtp_password)
            server.sendmail(settings.smtp_email, to_email, msg.as_string())

        print(f"[Email] [OK] Custom email sent to {to_email}")
        return True
    except Exception as e:
        print(f"[Email] [FAIL] Failed: {e}")
        return False
