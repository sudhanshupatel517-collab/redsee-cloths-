import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle, Mail } from "lucide-react";

export function Newsletter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el) => el.classList.add("revealed"));
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#080808",
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, rgba(139,0,0,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Diagonal pattern */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "repeating-linear-gradient(-45deg, rgba(255,255,255,0.01) 0, rgba(255,255,255,0.01) 1px, transparent 0, transparent 50%)",
        backgroundSize: "30px 30px",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)", position: "relative", zIndex: 1 }}>
        <div
          className="reveal"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(30px)",
            padding: "clamp(40px, 6vw, 72px)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Corner accents */}
          {[
            { top: 0, left: 0, borderTop: "2px solid #cc0000", borderLeft: "2px solid #cc0000" },
            { top: 0, right: 0, borderTop: "2px solid #cc0000", borderRight: "2px solid #cc0000" },
            { bottom: 0, left: 0, borderBottom: "2px solid #cc0000", borderLeft: "2px solid #cc0000" },
            { bottom: 0, right: 0, borderBottom: "2px solid #cc0000", borderRight: "2px solid #cc0000" },
          ].map((style, i) => (
            <div key={i} style={{ position: "absolute", width: 40, height: 40, boxShadow: "0 0 10px rgba(204,0,0,0.4)", ...style }} />
          ))}

          {/* Icon */}
          <div
            className="reveal stagger-1"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(204,0,0,0.1)",
              border: "1px solid rgba(204,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: "0 0 20px rgba(204,0,0,0.2)",
            }}
          >
            <Mail size={24} color="#cc0000" />
          </div>

          {/* Label */}
          <div className="reveal stagger-1" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "6px", color: "#cc0000", textTransform: "uppercase", marginBottom: 16 }}>
            Join The Inner Circle
          </div>

          {/* Title */}
          <h2
            className="reveal stagger-2"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(40px, 6vw, 64px)",
              color: "#fff",
              letterSpacing: "0.05em",
              lineHeight: 0.95,
              marginBottom: 16,
            }}
          >
            GET EARLY ACCESS
            <br />
            TO EVERY <span style={{ color: "#cc0000", textShadow: "0 0 20px rgba(204,0,0,0.6)" }}>DROP</span>
          </h2>

          <p
            className="reveal stagger-3"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 15,
              color: "#666",
              lineHeight: 1.7,
              maxWidth: 440,
              margin: "0 auto 40px",
            }}
          >
            Be first to know about exclusive drops, limited releases, flash sales, and members-only offers.
          </p>

          {/* Form */}
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="reveal stagger-4"
              style={{ display: "flex", gap: 0, maxWidth: 480, margin: "0 auto", flexWrap: "wrap" }}
            >
              <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
                <Mail
                  size={14}
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: focused ? "#cc0000" : "#444",
                    transition: "color 0.2s ease",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="your@email.com"
                  required
                  style={{
                    width: "100%",
                    padding: "18px 16px 18px 42px",
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${focused ? "#cc0000" : "rgba(255,255,255,0.1)"}`,
                    borderRight: "none",
                    color: "#fff",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: focused ? "0 0 15px rgba(204,0,0,0.1)" : "none",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: "18px 28px",
                  background: "linear-gradient(135deg, #8b0000, #cc0000)",
                  border: "none",
                  color: "#fff",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 16,
                  letterSpacing: "2px",
                  cursor: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "0 0 30px rgba(204,0,0,0.5)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "none";
                }}
              >
                SUBSCRIBE <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <div
              className="reveal"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                animation: "fadeInUp 0.5s ease",
              }}
            >
              <CheckCircle size={40} color="#cc0000" style={{ filter: "drop-shadow(0 0 10px rgba(204,0,0,0.6))" }} />
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: "0.1em", color: "#fff" }}>
                YOU'RE IN.
              </div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "#555" }}>
                Welcome to the inner circle. Check your inbox.
              </p>
            </div>
          )}

          {/* Perks */}
          <div
            className="reveal stagger-5"
            style={{ display: "flex", justifyContent: "center", gap: "clamp(20px, 4vw, 48px)", marginTop: 32, flexWrap: "wrap" }}
          >
            {["Early Access", "Exclusive Offers", "Members-Only Drops"].map((perk) => (
              <div key={perk} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#cc0000", boxShadow: "0 0 8px rgba(204,0,0,0.8)" }} />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "#555", letterSpacing: "1px" }}>
                  {perk}
                </span>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: "#333", letterSpacing: "1px", marginTop: 20 }}>
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
