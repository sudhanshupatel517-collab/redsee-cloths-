import { useEffect, useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Jordan M.",
    handle: "@jordanstreet",
    avatar: "JM",
    rating: 5,
    text: "REDSEE completely changed how I dress. The quality is insane — feels like a $500 piece but the brand's aesthetic hits different. The Darkness Hoodie is literally the best thing I've ever owned.",
    product: "Darkness Hoodie",
    date: "Jan 2025",
    verified: true,
  },
  {
    name: "Aisha T.",
    handle: "@aishavibes",
    avatar: "AT",
    rating: 5,
    text: "Been following REDSEE since day one. Every drop just gets better. The cargo pants are ridiculously fire — I get stopped on the street constantly. This brand is built different.",
    product: "Cyber Cargo Pants",
    date: "Feb 2025",
    verified: true,
  },
  {
    name: "Kyle R.",
    handle: "@kylecreates",
    avatar: "KR",
    rating: 5,
    text: "Ordered the Runner Pro and they arrived in 3 days. Packaging was premium as hell — literally felt like opening a luxury item. Shoes are perfect. Will 100% be back for the next drop.",
    product: "REDSEE Runner Pro",
    date: "Mar 2025",
    verified: true,
  },
  {
    name: "Mei L.",
    handle: "@meilooks",
    avatar: "ML",
    rating: 5,
    text: "I was skeptical at first but the oversized tee is genuinely the best quality I've seen at this price point. The cut is perfect, the print doesn't fade. REDSEE is the real deal.",
    product: "RS-01 Oversized Tee",
    date: "Apr 2025",
    verified: true,
  },
  {
    name: "Dante S.",
    handle: "@dantestreet",
    avatar: "DS",
    rating: 5,
    text: "Three orders deep and never been disappointed. The flash sale last month was crazy — got the hoodie for $99 and it's worth double that easily. Already told all my crew.",
    product: "RS-CORE Hoodie",
    date: "May 2025",
    verified: true,
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

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

  useEffect(() => {
    if (!autoplay) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % REVIEWS.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [autoplay]);

  const prev = () => {
    setAutoplay(false);
    setCurrent((c) => (c - 1 + REVIEWS.length) % REVIEWS.length);
  };
  const next = () => {
    setAutoplay(false);
    setCurrent((c) => (c + 1) % REVIEWS.length);
  };

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#0a0a0a",
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        bottom: -200,
        right: -200,
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,0,0,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div className="reveal section-label" style={{ marginBottom: 12, textAlign: "center" }}>— Customer Stories</div>
          <h2 className="reveal stagger-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 7vw, 80px)", color: "#fff", letterSpacing: "0.05em", lineHeight: 0.95 }}>
            WHAT THEY <span style={{ color: "#cc0000" }}>SAY</span>
          </h2>
          {/* Star aggregate */}
          <div className="reveal stagger-2" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16 }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="#cc0000" color="#cc0000" />
            ))}
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "#888", marginLeft: 8 }}>
              4.9 / 5 from 2,400+ reviews
            </span>
          </div>
        </div>

        {/* Main review carousel */}
        <div className="reveal" style={{ position: "relative", maxWidth: 860, margin: "0 auto", marginBottom: 60 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(20px)",
              padding: "clamp(32px, 5vw, 56px)",
              position: "relative",
              overflow: "hidden",
              minHeight: 280,
              transition: "all 0.4s ease",
            }}
          >
            {/* Red corner accent */}
            <div style={{ position: "absolute", top: 0, left: 0, width: 60, height: 2, background: "#cc0000", boxShadow: "0 0 10px rgba(204,0,0,0.8)" }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: 2, height: 60, background: "#cc0000", boxShadow: "0 0 10px rgba(204,0,0,0.8)" }} />

            <Quote size={32} color="rgba(204,0,0,0.3)" style={{ marginBottom: 24 }} />

            <p
              key={current}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(16px, 2vw, 20px)",
                color: "#ddd",
                lineHeight: 1.7,
                marginBottom: 32,
                animation: "fadeIn 0.5s ease",
              }}
            >
              "{REVIEWS[current].text}"
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #8b0000, #cc0000)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    boxShadow: "0 0 15px rgba(204,0,0,0.3)",
                  }}
                >
                  {REVIEWS[current].avatar}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: "#fff" }}>
                      {REVIEWS[current].name}
                    </span>
                    {REVIEWS[current].verified && (
                      <span style={{
                        fontSize: 9,
                        fontFamily: "'Space Grotesk', sans-serif",
                        letterSpacing: "1px",
                        color: "#cc0000",
                        border: "1px solid rgba(204,0,0,0.4)",
                        padding: "1px 5px",
                        textTransform: "uppercase",
                      }}>
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "#555", marginTop: 2 }}>
                    {REVIEWS[current].handle} · {REVIEWS[current].product}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#cc0000" color="#cc0000" />
                ))}
              </div>
            </div>
          </div>

          {/* Nav buttons */}
          <button
            onClick={prev}
            style={{
              position: "absolute",
              left: -24,
              top: "50%",
              transform: "translateY(-50%)",
              width: 48,
              height: 48,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "#0a0a0a",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#cc0000"; el.style.background = "rgba(204,0,0,0.1)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.1)"; el.style.background = "#0a0a0a"; }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            style={{
              position: "absolute",
              right: -24,
              top: "50%",
              transform: "translateY(-50%)",
              width: 48,
              height: 48,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "#0a0a0a",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#cc0000"; el.style.background = "rgba(204,0,0,0.1)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.1)"; el.style.background = "#0a0a0a"; }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 80 }}>
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setAutoplay(false); setCurrent(i); }}
              style={{
                width: i === current ? 28 : 8,
                height: 2,
                background: i === current ? "#cc0000" : "rgba(255,255,255,0.15)",
                border: "none",
                cursor: "none",
                transition: "all 0.3s ease",
                boxShadow: i === current ? "0 0 8px rgba(204,0,0,0.8)" : "none",
              }}
            />
          ))}
        </div>

        {/* Review grid - mini cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {REVIEWS.map((review, i) => (
            <div
              key={review.name}
              className={`reveal stagger-${i + 1}`}
              onClick={() => { setAutoplay(false); setCurrent(i); }}
              style={{
                padding: "20px",
                background: i === current ? "rgba(204,0,0,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === current ? "rgba(204,0,0,0.3)" : "rgba(255,255,255,0.04)"}`,
                cursor: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(204,0,0,0.2)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = i === current ? "rgba(204,0,0,0.3)" : "rgba(255,255,255,0.04)"; }}
            >
              <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={10} fill="#cc0000" color="#cc0000" />
                ))}
              </div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "#666", lineHeight: 1.6, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                "{review.text}"
              </p>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "#444" }}>
                {review.name} · {review.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
