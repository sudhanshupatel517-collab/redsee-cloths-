import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    label: "Oversized",
    tag: "THE STATEMENT",
    img: "https://images.unsplash.com/photo-1652823780977-b22c0ed84c97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    count: "24 pieces",
    accent: "#cc0000",
  },
  {
    label: "Hoodies",
    tag: "COLD CULTURE",
    img: "https://images.unsplash.com/photo-1601063476271-a159c71ab0b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    count: "18 pieces",
    accent: "#fff",
  },
  {
    label: "Cargo",
    tag: "UTILITY LUXE",
    img: "https://images.unsplash.com/photo-1628030328071-538b251a4455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    count: "15 pieces",
    accent: "#fff",
  },
  {
    label: "Footwear",
    tag: "GROUND LEVEL",
    img: "https://images.unsplash.com/photo-1672920800748-a5fb6dfd0c2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    count: "12 pieces",
    accent: "#cc0000",
  },
  {
    label: "Streetwear",
    tag: "URBAN CODE",
    img: "https://images.unsplash.com/photo-1632682582909-2b3a2581eef7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    count: "32 pieces",
    accent: "#fff",
  },
  {
    label: "Denim",
    tag: "CLASSIC RAW",
    img: "https://images.unsplash.com/photo-1595175131454-8eba9a7e1997?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    count: "10 pieces",
    accent: "#fff",
  },
];

export function FeaturedCollection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => {
              el.classList.add("revealed");
            });
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
      id="featured"
      ref={sectionRef}
      style={{ background: "#080808", padding: "120px 0", position: "relative", overflow: "hidden" }}
    >
      {/* Bg grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
        {/* Header */}
        <div style={{ marginBottom: 64, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div className="reveal section-label" style={{ marginBottom: 12 }}>
              — Shop by Category
            </div>
            <h2
              className="reveal stagger-1"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(48px, 7vw, 80px)",
                color: "#fff",
                lineHeight: 0.95,
                letterSpacing: "0.05em",
              }}
            >
              FEATURED
              <br />
              <span style={{ color: "#cc0000", textShadow: "0 0 30px rgba(204,0,0,0.5)" }}>COLLECTION</span>
            </h2>
          </div>
          <a
            href="#"
            className="reveal stagger-2"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#888",
              textDecoration: "none",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              transition: "color 0.2s ease",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: 4,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#cc0000")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#888")}
          >
            View All <ArrowRight size={14} />
          </a>
        </div>

        {/* Grid */}
        <div className="featured-grid">
          <CategoryCard cat={CATEGORIES[0]} span="1 / 6" rowSpan="1 / 3" className="reveal" delay={0} large />
          <CategoryCard cat={CATEGORIES[1]} span="6 / 10" rowSpan="1 / 2" className="reveal stagger-1" delay={0.1} />
          <CategoryCard cat={CATEGORIES[2]} span="10 / 13" rowSpan="1 / 2" className="reveal stagger-2" delay={0.2} />
          <CategoryCard cat={CATEGORIES[3]} span="6 / 9" rowSpan="2 / 3" className="reveal stagger-3" delay={0.3} />
          <CategoryCard cat={CATEGORIES[4]} span="9 / 13" rowSpan="2 / 4" className="reveal stagger-2" delay={0.15} large />
          <CategoryCard cat={CATEGORIES[5]} span="1 / 5" rowSpan="3 / 4" className="reveal stagger-1" delay={0.2} />
          <CategoryCard cat={CATEGORIES[3]} span="5 / 9" rowSpan="3 / 4" className="reveal stagger-3" delay={0.35} />
        </div>

        <style>{`
          .featured-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            grid-auto-rows: 220px;
            gap: 12px;
          }
          @media (max-width: 900px) {
            .featured-grid {
              grid-template-columns: 1fr 1fr;
              grid-auto-rows: 200px;
            }
            .featured-grid > * {
              grid-column: auto !important;
              grid-row: auto !important;
            }
          }
          @media (max-width: 480px) {
            .featured-grid {
              grid-template-columns: 1fr;
              grid-auto-rows: 240px;
            }
          }
          .cat-card-img {
            transform: scale(1);
            transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          }
          .cat-card:hover .cat-card-img {
            transform: scale(1.09);
          }
          .cat-card-overlay {
            transition: background 0.5s ease;
          }
          .cat-card:hover .cat-card-overlay {
            background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%) !important;
          }
          .cat-card-arrow {
            transition: all 0.3s ease;
          }
          .cat-card:hover .cat-card-arrow {
            background: #cc0000 !important;
            border-color: #cc0000 !important;
            box-shadow: 0 0 15px rgba(204,0,0,0.6) !important;
          }
          .cat-card-content {
            transform: translateY(4px);
            transition: transform 0.4s ease;
          }
          .cat-card:hover .cat-card-content {
            transform: translateY(0);
          }
        `}</style>
      </div>
    </section>
  );
}

function CategoryCard({ cat, span, rowSpan, className, delay, large }: {
  cat: typeof CATEGORIES[0];
  span: string;
  rowSpan: string;
  className: string;
  delay: number;
  large?: boolean;
}) {
  return (
    <div
      className={`${className} cat-card`}
      style={{
        gridColumn: span,
        gridRow: rowSpan,
        position: "relative",
        overflow: "hidden",
        cursor: "none",
        transitionDelay: `${delay}s`,
        background: "#111",
      }}
    >
      {/* Image — zoom handled via CSS class */}
      <img
        src={cat.img}
        alt={cat.label}
        className="cat-card-img"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          position: "absolute",
          inset: 0,
        }}
      />

      {/* Overlay */}
      <div
        className="cat-card-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      {/* Red top accent line */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: cat.accent === "#cc0000"
          ? "linear-gradient(90deg, #8b0000, #cc0000, #ff4444)"
          : "transparent",
        boxShadow: cat.accent === "#cc0000" ? "0 0 10px rgba(204,0,0,0.8)" : "none",
      }} />

      {/* Content */}
      <div
        className="cat-card-content"
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: large ? "24px 24px" : "16px 18px" }}
      >
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 9,
          letterSpacing: "4px",
          color: cat.accent === "#cc0000" ? "#cc0000" : "rgba(255,255,255,0.4)",
          marginBottom: 5,
          textTransform: "uppercase",
        }}>
          {cat.tag}
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: large ? "clamp(36px, 5vw, 52px)" : "clamp(26px, 3.5vw, 38px)",
          color: "#fff",
          letterSpacing: "0.08em",
          lineHeight: 1,
        }}>
          {cat.label}
        </div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "2px" }}>
            {cat.count}
          </span>
          <div
            className="cat-card-arrow"
            style={{
              width: 32,
              height: 32,
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowRight size={14} color="#fff" />
          </div>
        </div>
      </div>
    </div>
  );
}
