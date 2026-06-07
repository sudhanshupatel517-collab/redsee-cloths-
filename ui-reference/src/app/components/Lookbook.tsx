import { useEffect, useRef, useState } from "react";
import { ArrowRight, Instagram } from "lucide-react";

const LOOKBOOK = [
  {
    img: "https://images.unsplash.com/photo-1773614784481-338d3fabd022?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    title: "CHAPTER 01",
    sub: "THE VOID",
    span: "col-span-2 row-span-2",
    orientation: "portrait",
  },
  {
    img: "https://images.unsplash.com/photo-1763454640760-3242809ce4d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    title: "CHAPTER 02",
    sub: "EARTH BOUND",
    span: "col-span-1 row-span-1",
    orientation: "portrait",
  },
  {
    img: "https://images.unsplash.com/photo-1770062421988-7929b4748e29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    title: "CHAPTER 03",
    sub: "SHIMMER",
    span: "col-span-1 row-span-1",
    orientation: "portrait",
  },
  {
    img: "https://images.unsplash.com/photo-1777499252952-83fbad1e937a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    title: "CHAPTER 04",
    sub: "ELECTRIC BLUE",
    span: "col-span-1 row-span-1",
    orientation: "portrait",
  },
  {
    img: "https://images.unsplash.com/photo-1776721894195-225dccdc4739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    title: "CHAPTER 05",
    sub: "WATCHMAN",
    span: "col-span-1 row-span-1",
    orientation: "portrait",
  },
];

export function Lookbook() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => el.classList.add("revealed"));
          }
        });
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="lookbook"
      ref={sectionRef}
      style={{
        background: "#080808",
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Red glow top */}
      <div style={{
        position: "absolute",
        top: -200,
        left: "30%",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,0,0,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 24 }}>
          <div>
            <div className="reveal section-label" style={{ marginBottom: 12 }}>— Editorial</div>
            <h2
              className="reveal stagger-1"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(48px, 7vw, 80px)",
                color: "#fff",
                letterSpacing: "0.05em",
                lineHeight: 0.95,
              }}
            >
              REDSEE
              <br />
              <span style={{ color: "#cc0000", textShadow: "0 0 30px rgba(204,0,0,0.5)" }}>LOOKBOOK</span>
            </h2>
          </div>
          <div className="reveal stagger-2" style={{ maxWidth: 300 }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "#555", lineHeight: 1.8, marginBottom: 20 }}>
              A cinematic exploration of identity, culture, and the streets that define us.
            </p>
            <a
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "#cc0000",
                textDecoration: "none",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "12px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontWeight: 500,
                transition: "gap 0.2s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.gap = "14px")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.gap = "8px")}
            >
              VIEW FULL EDITORIAL <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Editorial grid */}
        <div className="lookbook-grid">
          {/* Large hero image */}
          <div className="reveal lb-hero" style={{ position: "relative", overflow: "hidden", cursor: "none", minHeight: 500 }}>
            <LookbookImg item={LOOKBOOK[0]} large />
          </div>
          <div className="reveal stagger-1 lb-sm" style={{ position: "relative", overflow: "hidden", cursor: "none", minHeight: 240 }}>
            <LookbookImg item={LOOKBOOK[1]} />
          </div>
          <div className="reveal stagger-2 lb-sm" style={{ position: "relative", overflow: "hidden", cursor: "none", minHeight: 240 }}>
            <LookbookImg item={LOOKBOOK[2]} />
          </div>
          <div className="reveal stagger-3 lb-sm" style={{ position: "relative", overflow: "hidden", cursor: "none", minHeight: 240 }}>
            <LookbookImg item={LOOKBOOK[3]} />
          </div>
          <div className="reveal stagger-4 lb-sm" style={{ position: "relative", overflow: "hidden", cursor: "none", minHeight: 240 }}>
            <LookbookImg item={LOOKBOOK[4]} />
          </div>
        </div>
        <style>{`
          .lookbook-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 12px;
          }
          .lb-hero {
            grid-column: 1 / 3;
            grid-row: 1 / 3;
          }
          .lb-sm {
            grid-column: auto;
            grid-row: auto;
          }
          @media (max-width: 768px) {
            .lookbook-grid {
              grid-template-columns: 1fr 1fr;
              grid-template-rows: auto;
            }
            .lb-hero {
              grid-column: 1 / 3;
              grid-row: auto;
              min-height: 300px !important;
            }
            .lb-sm {
              min-height: 180px !important;
            }
          }
          @media (max-width: 480px) {
            .lookbook-grid {
              grid-template-columns: 1fr;
            }
            .lb-hero {
              grid-column: 1;
              min-height: 280px !important;
            }
          }
        `}</style>

        {/* Magazine strip */}
        <div
          className="reveal"
          style={{
            marginTop: 60,
            padding: "32px 40px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "4px", color: "#555", textTransform: "uppercase", marginBottom: 6 }}>
              As seen in
            </div>
            <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
              {["HYPEBEAST", "HIGHSNOBIETY", "VOGUE", "GQ", "COMPLEX"].map((pub) => (
                <span
                  key={pub}
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 20,
                    letterSpacing: "0.1em",
                    color: "#2a2a2a",
                    transition: "color 0.3s ease",
                    cursor: "none",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#888")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#2a2a2a")}
                >
                  {pub}
                </span>
              ))}
            </div>
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent",
              color: "#fff",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "#cc0000";
              el.style.background = "rgba(204,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.1)";
              el.style.background = "transparent";
            }}
          >
            <Instagram size={14} />
            Follow @REDSEE
          </button>
        </div>
      </div>
    </section>
  );
}

function LookbookImg({ item, large }: { item: typeof LOOKBOOK[0]; large?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={item.img}
        alt={item.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          position: "absolute",
          inset: 0,
        }}
      />
      <div style={{
        position: "absolute",
        inset: 0,
        background: hovered
          ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)"
          : "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
        transition: "background 0.4s ease",
      }} />
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: large ? "24px 28px" : "16px 16px",
        transform: hovered ? "translateY(0)" : "translateY(4px)",
        transition: "transform 0.4s ease, opacity 0.4s ease",
        opacity: hovered ? 1 : 0.7,
      }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 9,
          letterSpacing: "4px",
          color: "#cc0000",
          textTransform: "uppercase",
          marginBottom: 4,
        }}>
          {item.title}
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: large ? 36 : 22,
          letterSpacing: "0.1em",
          color: "#fff",
        }}>
          {item.sub}
        </div>
      </div>
    </div>
  );
}

