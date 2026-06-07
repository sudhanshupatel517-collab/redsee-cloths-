import { useEffect, useRef, useState } from "react";
import { Zap, ArrowRight } from "lucide-react";

function useCountdown(targetDate: Date) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, targetDate.getTime() - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime({ h, m, s });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return time;
}

const SALE_PRODUCTS = [
  {
    name: "RS-CORE Hoodie",
    original: 165,
    sale: 99,
    img: "https://images.unsplash.com/photo-1601063476271-a159c71ab0b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    stock: 7,
    off: 40,
  },
  {
    name: "Oversized Tee Pack",
    original: 240,
    sale: 139,
    img: "https://images.unsplash.com/photo-1652823780977-b22c0ed84c97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    stock: 4,
    off: 42,
  },
  {
    name: "Cyber Cargo",
    original: 190,
    sale: 119,
    img: "https://images.unsplash.com/photo-1628030328071-538b251a4455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    stock: 12,
    off: 37,
  },
  {
    name: "Runner Pro Collab",
    original: 280,
    sale: 179,
    img: "https://images.unsplash.com/photo-1672920800748-a5fb6dfd0c2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    stock: 2,
    off: 36,
  },
];

export function FlashSale() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const targetDate = useRef(new Date(Date.now() + 8 * 3600000 + 23 * 60000 + 47000));
  const { h, m, s } = useCountdown(targetDate.current);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => el.classList.add("revealed"));
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="flash-sale"
      ref={sectionRef}
      style={{
        position: "relative",
        padding: "100px 0",
        overflow: "hidden",
        background: "#080808",
      }}
    >
      {/* Animated red bg stripes */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, rgba(139,0,0,0.15) 0%, transparent 50%, rgba(139,0,0,0.08) 100%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: "linear-gradient(90deg, transparent, #cc0000, #ff4444, #cc0000, transparent)",
        boxShadow: "0 0 20px rgba(204,0,0,0.8)",
        animation: "glowPulse 3s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        background: "linear-gradient(90deg, transparent, #cc0000, #ff4444, #cc0000, transparent)",
        boxShadow: "0 0 20px rgba(204,0,0,0.8)",
        animation: "glowPulse 3s ease-in-out infinite 1.5s",
      }} />

      {/* Diagonal stripes decoration */}
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "40%",
        height: "100%",
        background: "repeating-linear-gradient(-45deg, rgba(204,0,0,0.02) 0, rgba(204,0,0,0.02) 1px, transparent 0, transparent 50%)",
        backgroundSize: "20px 20px",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="reveal" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <Zap size={16} color="#cc0000" fill="#cc0000" style={{ animation: "glowPulse 1.5s infinite" }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "6px", color: "#cc0000", textTransform: "uppercase" }}>
              Flash Sale
            </span>
            <Zap size={16} color="#cc0000" fill="#cc0000" style={{ animation: "glowPulse 1.5s infinite 0.5s" }} />
          </div>
          <h2
            className="reveal stagger-1"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(56px, 9vw, 100px)",
              color: "#fff",
              letterSpacing: "0.05em",
              lineHeight: 0.9,
            }}
          >
            ENDS IN
          </h2>

          {/* Countdown */}
          <div
            className="reveal stagger-2"
            style={{ display: "flex", justifyContent: "center", gap: "clamp(12px, 3vw, 32px)", marginTop: 24 }}
          >
            {[
              { val: h, label: "HRS" },
              { val: m, label: "MIN" },
              { val: s, label: "SEC" },
            ].map((unit, i) => (
              <div key={unit.label} style={{ display: "flex", alignItems: "center", gap: "clamp(12px, 3vw, 32px)" }}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(56px, 9vw, 100px)",
                      color: "#fff",
                      lineHeight: 1,
                      letterSpacing: "0.05em",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(204,0,0,0.3)",
                      padding: "0 clamp(16px, 2.5vw, 28px)",
                      boxShadow: "0 0 20px rgba(204,0,0,0.15), inset 0 0 30px rgba(204,0,0,0.05)",
                      minWidth: "clamp(90px, 12vw, 140px)",
                      animation: "borderGlow 3s ease-in-out infinite",
                      animationDelay: `${i * 0.5}s`,
                    }}
                  >
                    {String(unit.val).padStart(2, "0")}
                  </div>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 9,
                    letterSpacing: "4px",
                    color: "#cc0000",
                    textTransform: "uppercase",
                    marginTop: 8,
                  }}>
                    {unit.label}
                  </div>
                </div>
                {i < 2 && (
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(40px, 6vw, 80px)",
                    color: "#cc0000",
                    lineHeight: 1,
                    textShadow: "0 0 20px rgba(204,0,0,0.8)",
                    animation: "textGlowPulse 1s ease-in-out infinite",
                    marginBottom: 24,
                  }}>
                    :
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sale products */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginBottom: 48 }}>
          {SALE_PRODUCTS.map((p, i) => (
            <SaleCard key={p.name} product={p} delay={i * 0.1} />
          ))}
        </div>

        {/* CTA */}
        <div className="reveal" style={{ textAlign: "center" }}>
          <button
            style={{
              padding: "18px 56px",
              background: "transparent",
              border: "2px solid #cc0000",
              color: "#fff",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 20,
              letterSpacing: "4px",
              cursor: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              position: "relative",
              overflow: "hidden",
              transition: "all 0.4s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "#cc0000";
              el.style.boxShadow = "0 0 40px rgba(204,0,0,0.6), 0 0 80px rgba(204,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.boxShadow = "none";
            }}
          >
            <Zap size={18} fill="currentColor" />
            SHOP ALL SALE ITEMS
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

function SaleCard({ product, delay }: { product: typeof SALE_PRODUCTS[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="reveal"
      style={{
        background: "#111",
        border: "1px solid rgba(204,0,0,0.15)",
        position: "relative",
        overflow: "hidden",
        cursor: "none",
        transitionDelay: `${delay}s`,
        transition: "transform 0.4s ease, box-shadow 0.4s ease, border-color 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(204,0,0,0.15)" : "none",
        borderColor: hovered ? "rgba(204,0,0,0.4)" : "rgba(204,0,0,0.15)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Off badge */}
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        background: "#cc0000",
        padding: "8px 12px",
        zIndex: 2,
        boxShadow: "0 0 15px rgba(204,0,0,0.6)",
      }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#fff", letterSpacing: "0.05em" }}>-{product.off}%</span>
      </div>

      <div style={{ position: "relative", overflow: "hidden", paddingBottom: "85%" }}>
        <img
          src={product.img}
          alt={product.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            transition: "transform 0.6s ease",
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
      </div>

      <div style={{ padding: "16px" }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 8 }}>
          {product.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "#cc0000", letterSpacing: "0.05em" }}>
              ${product.sale}
            </span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "#444", textDecoration: "line-through", marginLeft: 8 }}>
              ${product.original}
            </span>
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: "#cc0000", letterSpacing: "1px" }}>
            {product.stock} LEFT
          </span>
        </div>
        {/* Stock bar */}
        <div style={{ marginTop: 10, height: 2, background: "rgba(255,255,255,0.08)", position: "relative" }}>
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${(product.stock / 20) * 100}%`,
            background: "#cc0000",
            boxShadow: "0 0 6px rgba(204,0,0,0.8)",
          }} />
        </div>
        <button
          style={{
            marginTop: 14,
            width: "100%",
            padding: "10px",
            background: hovered ? "#cc0000" : "rgba(204,0,0,0.1)",
            border: "1px solid rgba(204,0,0,0.4)",
            color: "#fff",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 14,
            letterSpacing: "2px",
            cursor: "none",
            transition: "all 0.3s ease",
            boxShadow: hovered ? "0 0 20px rgba(204,0,0,0.4)" : "none",
          }}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
