const BRANDS = [
  "REDSEE", "·", "LUXURY STREETWEAR", "·", "FW25 COLLECTION", "·",
  "BORN IN DARKNESS", "·", "LIMITED DROPS", "·", "CYBERPUNK FASHION", "·",
  "PREMIUM QUALITY", "·", "WORLDWIDE SHIPPING", "·", "EST. 2024", "·",
];

export function BrandBar() {
  return (
    <div
      style={{
        background: "#0a0a0a",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        padding: "14px 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Fade edges */}
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 80,
        background: "linear-gradient(to right, #0a0a0a, transparent)",
        zIndex: 2,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: 80,
        background: "linear-gradient(to left, #0a0a0a, transparent)",
        zIndex: 2,
        pointerEvents: "none",
      }} />

      {/* Scrolling track */}
      <div
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: "marquee 35s linear infinite",
          width: "max-content",
        }}
      >
        {[...Array(2)].map((_, ri) => (
          <div key={ri} style={{ display: "flex" }}>
            {BRANDS.map((word, i) => (
              <span
                key={`${ri}-${i}`}
                style={{
                  fontFamily: word === "·" ? "'Bebas Neue', sans-serif" : "'Bebas Neue', sans-serif",
                  fontSize: word === "·" ? 18 : 13,
                  letterSpacing: word === "·" ? "0" : "5px",
                  color: word === "·" ? "#cc0000" : "#2a2a2a",
                  padding: word === "·" ? "0 20px" : "0 4px",
                  textShadow: word === "·" ? "0 0 8px rgba(204,0,0,0.6)" : "none",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Reverse direction variant below hero */
export function BrandBarReverse() {
  return (
    <div
      style={{
        background: "rgba(204,0,0,0.03)",
        borderTop: "1px solid rgba(204,0,0,0.1)",
        padding: "12px 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div style={{
        position: "absolute",
        left: 0, top: 0, bottom: 0, width: 60,
        background: "linear-gradient(to right, rgba(204,0,0,0.03), transparent)",
        zIndex: 2, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        right: 0, top: 0, bottom: 0, width: 60,
        background: "linear-gradient(to left, rgba(204,0,0,0.03), transparent)",
        zIndex: 2, pointerEvents: "none",
      }} />

      <div style={{
        display: "flex",
        whiteSpace: "nowrap",
        animation: "marquee 25s linear infinite reverse",
        width: "max-content",
      }}>
        {[...Array(2)].map((_, ri) => (
          <div key={ri} style={{ display: "flex", gap: 0 }}>
            {["NEW DROP", "·", "EXCLUSIVE", "·", "REDSEE", "·", "LUXURY", "·", "DARK AESTHETICS", "·", "CYBERPUNK", "·", "STREETWEAR", "·"].map((word, i) => (
              <span key={`${ri}-${i}`} style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 10,
                letterSpacing: word === "·" ? "0" : "4px",
                color: word === "·" ? "#cc0000" : "#1e1e1e",
                padding: word === "·" ? "0 16px" : "0 8px",
                textTransform: "uppercase",
                fontWeight: 600,
              }}>
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
