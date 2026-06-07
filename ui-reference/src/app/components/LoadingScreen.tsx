import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");

  useEffect(() => {
    document.body.classList.add("loading");
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 8 + 2;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => setPhase("reveal"), 300);
        setTimeout(() => {
          setPhase("done");
          document.body.classList.remove("loading");
          onComplete();
        }, 1200);
      }
      setProgress(Math.min(current, 100));
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#080808",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition: phase === "reveal" ? "opacity 0.8s ease, transform 0.8s ease" : "none",
        opacity: phase === "reveal" ? 0 : 1,
        transform: phase === "reveal" ? "scale(1.05)" : "scale(1)",
      }}
    >
      {/* Scanline effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
          pointerEvents: "none",
        }}
      />

      {/* Animated grid bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(204,0,0,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(204,0,0,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          animation: "fadeIn 1s ease",
        }}
      />

      {/* Red corner accents */}
      <div style={{ position: "absolute", top: 20, left: 20, width: 40, height: 40, borderTop: "2px solid #cc0000", borderLeft: "2px solid #cc0000", boxShadow: "0 0 10px rgba(204,0,0,0.5)" }} />
      <div style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderTop: "2px solid #cc0000", borderRight: "2px solid #cc0000", boxShadow: "0 0 10px rgba(204,0,0,0.5)" }} />
      <div style={{ position: "absolute", bottom: 20, left: 20, width: 40, height: 40, borderBottom: "2px solid #cc0000", borderLeft: "2px solid #cc0000", boxShadow: "0 0 10px rgba(204,0,0,0.5)" }} />
      <div style={{ position: "absolute", bottom: 20, right: 20, width: 40, height: 40, borderBottom: "2px solid #cc0000", borderRight: "2px solid #cc0000", boxShadow: "0 0 10px rgba(204,0,0,0.5)" }} />

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(72px, 15vw, 120px)",
            color: "#ffffff",
            letterSpacing: "0.25em",
            lineHeight: 1,
            animation: "logoReveal 1.2s cubic-bezier(0.22,1,0.36,1) forwards",
            textShadow: `
              0 0 30px rgba(204,0,0,0.4),
              0 0 60px rgba(204,0,0,0.2)
            `,
          }}
        >
          REDSEE
        </div>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "11px",
            letterSpacing: "8px",
            color: "#cc0000",
            textTransform: "uppercase",
            marginTop: 8,
            animation: "fadeIn 1s ease 0.8s both",
          }}
        >
          LUXURY STREETWEAR
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: "clamp(200px, 40vw, 320px)", marginBottom: 16 }}>
        <div
          style={{
            width: "100%",
            height: 1,
            background: "rgba(255,255,255,0.1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #8b0000, #cc0000, #ff4444)",
              transition: "width 0.1s ease",
              boxShadow: "0 0 10px rgba(204,0,0,0.8), 0 0 20px rgba(204,0,0,0.4)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "10px",
            letterSpacing: "2px",
            color: "#444",
          }}
        >
          <span>LOADING COLLECTION</span>
          <span style={{ color: "#cc0000" }}>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "10px",
          letterSpacing: "4px",
          color: "#333",
          textTransform: "uppercase",
          animation: "fadeIn 1s ease 1s both",
        }}
      >
        EST. 2024 · PREMIUM STREETWEAR
      </div>
    </div>
  );
}
