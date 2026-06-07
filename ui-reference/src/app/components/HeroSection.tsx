import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";

const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1773614784481-338d3fabd022?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
    label: "FW 2025 DROP 01",
    title: ["THE RED", "COLLECTION"],
    sub: "Luxury streetwear for the bold generation",
    cta1: "Shop Collection",
    cta2: "Watch Film",
    align: "left",
  },
  {
    img: "https://images.unsplash.com/photo-1654076698795-a9f6c4c691f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
    label: "EXCLUSIVE DROP",
    title: ["BORN IN", "DARKNESS"],
    sub: "Where the streets meet high fashion",
    cta1: "Explore Drops",
    cta2: "View Lookbook",
    align: "center",
  },
  {
    img: "https://images.unsplash.com/photo-1777499255585-992dd01ac559?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
    label: "LIMITED EDITION",
    title: ["REDEFINE", "YOUR STYLE"],
    sub: "Only 100 units worldwide. Claim yours.",
    cta1: "Shop Now",
    cta2: "Learn More",
    align: "right",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 500);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMousePos({
        x: (e.clientX - rect.left - rect.width / 2) / rect.width,
        y: (e.clientY - rect.top - rect.height / 2) / rect.height,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const slide = SLIDES[current];

  return (
    <div
      ref={containerRef}
      id="hero"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: 600,
        overflow: "hidden",
        background: "#080808",
      }}
    >
      {/* Slide images */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            transition: "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            opacity: i === current ? 1 : 0,
            transform: `scale(${i === current ? 1.02 : 1}) translate(${mousePos.x * -8}px, ${mousePos.y * -8}px)`,
            transitionProperty: "opacity, transform",
            transitionDuration: "0.8s, 8s",
          }}
        >
          <img
            src={s.img}
            alt={s.title.join(" ")}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
          />
        </div>
      ))}

      {/* Overlays */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,1) 0%, rgba(8,8,8,0.4) 30%, transparent 70%)" }} />

      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.01) 3px, rgba(255,255,255,0.01) 4px)",
      }} />

      {/* Red glow orb */}
      <div style={{
        position: "absolute",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,0,0,0.25) 0%, transparent 70%)",
        bottom: -200,
        left: -100,
        pointerEvents: "none",
        animation: "floatSlow 8s ease-in-out infinite",
      }} />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 clamp(24px, 6vw, 100px)",
          paddingTop: 120,
          maxWidth: slide.align === "center" ? "100%" : "800px",
          marginLeft: slide.align === "right" ? "auto" : 0,
          marginRight: slide.align === "left" ? "auto" : 0,
        }}
      >
        {/* Label */}
        <div
          key={`label-${current}`}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "11px",
            letterSpacing: "6px",
            color: "#cc0000",
            textTransform: "uppercase",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 12,
            animation: "fadeInUp 0.6s ease both",
          }}
        >
          <span style={{ display: "block", width: 30, height: 1, background: "#cc0000", boxShadow: "0 0 8px #cc0000" }} />
          {slide.label}
        </div>

        {/* Title */}
        <div style={{ overflow: "hidden" }}>
          {slide.title.map((line, i) => (
            <div
              key={`${current}-line-${i}`}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(72px, 13vw, 160px)",
                color: "#ffffff",
                lineHeight: 0.9,
                letterSpacing: "0.05em",
                animation: `fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.12}s both`,
                textShadow: i === 0 ? "0 0 60px rgba(204,0,0,0.2)" : "none",
              }}
            >
              {i === 1 ? (
                <>
                  {line.split("").slice(0, -4).join("")}
                  <span style={{ color: "#cc0000", textShadow: "0 0 30px rgba(204,0,0,0.8)" }}>
                    {line.slice(-4)}
                  </span>
                </>
              ) : (
                line
              )}
            </div>
          ))}
        </div>

        {/* Sub */}
        <p
          key={`sub-${current}`}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(14px, 1.5vw, 17px)",
            color: "#888",
            marginTop: 20,
            maxWidth: 400,
            lineHeight: 1.6,
            animation: "fadeInUp 0.8s ease 0.3s both",
          }}
        >
          {slide.sub}
        </p>

        {/* CTAs */}
        <div
          key={`cta-${current}`}
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
            flexWrap: "wrap",
            animation: "fadeInUp 0.8s ease 0.45s both",
          }}
        >
          <button
            style={{
              padding: "16px 36px",
              background: "linear-gradient(135deg, #8b0000, #cc0000)",
              border: "none",
              color: "#fff",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 18,
              letterSpacing: "3px",
              cursor: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 0 30px rgba(204,0,0,0.4)",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = "0 0 50px rgba(204,0,0,0.7), 0 0 100px rgba(204,0,0,0.3)";
              el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = "0 0 30px rgba(204,0,0,0.4)";
              el.style.transform = "translateY(0)";
            }}
          >
            {slide.cta1}
            <ArrowRight size={16} />
          </button>
          <button
            style={{
              padding: "16px 36px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 18,
              letterSpacing: "3px",
              cursor: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              transition: "all 0.3s ease",
              backdropFilter: "blur(4px)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(204,0,0,0.6)";
              el.style.background = "rgba(204,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.2)";
              el.style.background = "transparent";
            }}
          >
            <Play size={14} fill="currentColor" />
            {slide.cta2}
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 56,
            animation: "fadeInUp 0.8s ease 0.6s both",
          }}
        >
          {[
            { value: "50K+", label: "Customers" },
            { value: "200+", label: "Products" },
            { value: "4.9★", label: "Rating" },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#fff", letterSpacing: "0.05em" }}>{stat.value}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "3px", color: "#555", textTransform: "uppercase" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating card */}
      <div
        style={{
          position: "absolute",
          right: "clamp(20px, 5vw, 60px)",
          bottom: "clamp(80px, 12vh, 140px)",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "20px 24px",
          minWidth: 180,
          animation: "float 4s ease-in-out infinite",
          display: "none",
        }}
        className="float-card"
      >
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "3px", color: "#cc0000", textTransform: "uppercase", marginBottom: 8 }}>
          NEW DROP
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.1em", marginBottom: 4 }}>
          DROP 002
        </div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "#888" }}>
          Limited to 100 units
        </div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#cc0000", boxShadow: "0 0 8px #cc0000", animation: "glowPulse 1.5s infinite" }} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: "#cc0000", letterSpacing: "2px" }}>LIVE NOW</span>
        </div>
      </div>

      {/* Slide indicators */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? 32 : 8,
              height: 2,
              background: i === current ? "#cc0000" : "rgba(255,255,255,0.2)",
              border: "none",
              cursor: "none",
              transition: "all 0.4s ease",
              boxShadow: i === current ? "0 0 8px rgba(204,0,0,0.8)" : "none",
            }}
          />
        ))}
      </div>

      {/* Side slide counter */}
      <div
        style={{
          position: "absolute",
          right: 24,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ width: 1, height: 50, background: "rgba(255,255,255,0.08)" }} />
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              background: "none",
              border: "none",
              cursor: "none",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{
              width: i === current ? 6 : 4,
              height: i === current ? 6 : 4,
              borderRadius: "50%",
              background: i === current ? "#cc0000" : "rgba(255,255,255,0.2)",
              boxShadow: i === current ? "0 0 8px rgba(204,0,0,0.8)" : "none",
              transition: "all 0.3s ease",
            }} />
          </button>
        ))}
        <div style={{ width: 1, height: 50, background: "rgba(255,255,255,0.08)" }} />
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 9,
          letterSpacing: "2px",
          color: "#444",
          writingMode: "vertical-rl",
        }}>
          {String(current + 1).padStart(2, "0")}/{String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>

      {/* Ticker */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          overflow: "hidden",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          padding: "10px 0",
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 0,
            whiteSpace: "nowrap",
            animation: "marquee 30s linear infinite",
          }}
        >
          {[...Array(2)].map((_, ri) => (
            <div key={ri} style={{ display: "flex", gap: 0 }}>
              {["REDSEE", "·", "FW25", "·", "NEW DROPS", "·", "LUXURY STREETWEAR", "·", "BORN IN DARKNESS", "·", "LIMITED EDITION", "·", "CYBERPUNK FASHION", "·"].map((t, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 13,
                    letterSpacing: "4px",
                    color: t === "·" ? "#cc0000" : "#333",
                    padding: "0 20px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom center scroll indicator - animated mouse */}
      <div
        style={{
          position: "absolute",
          bottom: 104,
          left: "clamp(24px, 6vw, 100px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          animation: "fadeInUp 1s ease 1.2s both",
        }}
      >
        <div
          style={{
            width: 22,
            height: 36,
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 12,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            paddingTop: 6,
          }}
        >
          <div
            style={{
              width: 3,
              height: 6,
              background: "#cc0000",
              borderRadius: 2,
              boxShadow: "0 0 6px rgba(204,0,0,0.8)",
              animation: "scrollDot 2s ease-in-out infinite",
            }}
          />
        </div>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 9,
          letterSpacing: "3px",
          color: "#444",
          textTransform: "uppercase",
        }}>
          SCROLL
        </span>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .float-card { display: block !important; }
        }
        @keyframes scrollDot {
          0% { transform: translateY(0); opacity: 1; }
          60% { transform: translateY(12px); opacity: 0.3; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
