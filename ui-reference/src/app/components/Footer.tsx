import { Instagram, Twitter, Youtube, Facebook, ArrowUp } from "lucide-react";

const LINKS = {
  Shop: ["New Arrivals", "Hoodies", "T-Shirts", "Cargo Pants", "Footwear", "Accessories", "Sale"],
  Support: ["Track Order", "Returns & Exchanges", "Size Guide", "FAQ", "Contact Us", "Live Chat"],
  Brand: ["Our Story", "Sustainability", "Careers", "Press", "Wholesale", "Affiliate Program"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"],
};

const SOCIAL = [
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Twitter, label: "Twitter", href: "#" },
  { Icon: Youtube, label: "YouTube", href: "#" },
  { Icon: Facebook, label: "Facebook", href: "#" },
];

export function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer style={{ background: "#080808", position: "relative", overflow: "hidden" }}>
      {/* Red top line */}
      <div style={{
        height: 1,
        background: "linear-gradient(90deg, transparent, #cc0000, #ff4444, #cc0000, transparent)",
        boxShadow: "0 0 20px rgba(204,0,0,0.6)",
      }} />

      {/* Main footer content */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "80px clamp(16px, 4vw, 40px) 40px" }}>
        <div className="footer-grid" style={{ marginBottom: 64 }}>
          <style>{`
            .footer-grid {
              display: grid;
              grid-template-columns: 2fr repeat(4, 1fr);
              gap: 48px;
            }
            @media (max-width: 900px) {
              .footer-grid {
                grid-template-columns: 1fr 1fr;
                gap: 32px;
              }
            }
            @media (max-width: 480px) {
              .footer-grid {
                grid-template-columns: 1fr;
              }
            }
          `}</style>
          {/* Brand col */}
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, letterSpacing: "0.15em", marginBottom: 16 }}>
              RED<span style={{ color: "#cc0000", textShadow: "0 0 20px rgba(204,0,0,0.5)" }}>SEE</span>
            </div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "#555", lineHeight: 1.8, maxWidth: 260, marginBottom: 24 }}>
              Luxury streetwear for the bold generation. Born in the streets. Made for the culture.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
              {SOCIAL.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    width: 40,
                    height: 40,
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#555",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    cursor: "none",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "#cc0000";
                    el.style.color = "#cc0000";
                    el.style.background = "rgba(204,0,0,0.08)";
                    el.style.boxShadow = "0 0 15px rgba(204,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(255,255,255,0.08)";
                    el.style.color = "#555";
                    el.style.background = "transparent";
                    el.style.boxShadow = "none";
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Contact info */}
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "#444", lineHeight: 2, letterSpacing: "1px" }}>
              <div>support@redsee.com</div>
              <div>+1 (800) RED-SEEE</div>
              <div>Mon-Fri 9AM–6PM EST</div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>

              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 10,
                letterSpacing: "4px",
                color: "#cc0000",
                textTransform: "uppercase",
                marginBottom: 20,
                fontWeight: 600,
              }}>
                {title}
              </div>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 13,
                        color: "#555",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                        cursor: "none",
                        display: "inline-block",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#555")}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.04)",
          paddingTop: 32,
          marginBottom: 32,
        }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "3px", color: "#333", textTransform: "uppercase", marginBottom: 16 }}>
            Secure Payment
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["VISA", "MASTERCARD", "AMEX", "PAYPAL", "APPLE PAY", "KLARNA"].map((method) => (
              <div
                key={method}
                style={{
                  padding: "6px 12px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "#333",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* Shipping strip */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.04)",
          paddingTop: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[
              "🌍 Worldwide Shipping",
              "↩️ 30-Day Returns",
              "🔒 Secure Checkout",
              "📦 Tracked Delivery",
            ].map((item) => (
              <span key={item} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "#444", letterSpacing: "1px" }}>
                {item}
              </span>
            ))}
          </div>

          {/* Back to top */}
          <button
            onClick={scrollTop}
            style={{
              width: 48,
              height: 48,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "#cc0000";
              el.style.background = "rgba(204,0,0,0.1)";
              el.style.boxShadow = "0 0 15px rgba(204,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.08)";
              el.style.background = "transparent";
              el.style.boxShadow = "none";
            }}
          >
            <ArrowUp size={18} />
          </button>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.04)",
          paddingTop: 24,
          marginTop: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "#333", letterSpacing: "1px" }}>
            © 2025 REDSEE™. All rights reserved.
          </span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "#222", letterSpacing: "2px" }}>
            LUXURY STREETWEAR · EST. 2024
          </span>
        </div>
      </div>

      {/* Large watermark */}
      <div style={{
        position: "absolute",
        bottom: -20,
        left: "50%",
        transform: "translateX(-50%)",
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(80px, 15vw, 180px)",
        color: "rgba(255,255,255,0.02)",
        letterSpacing: "0.1em",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        userSelect: "none",
      }}>
        REDSEE
      </div>
    </footer>
  );
}
