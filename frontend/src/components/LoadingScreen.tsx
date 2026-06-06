"use client";

import { useEffect, useState, useRef } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    startTimeRef.current = performance.now();
    const DURATION = 1200; // total loading duration in ms

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setPhase("reveal"), 200);
        setTimeout(() => {
          setPhase("done");
          document.body.classList.remove("overflow-hidden");
          onCompleteRef.current();
        }, 900);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="loading-screen"
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
        transition: phase === "reveal" ? "opacity 0.6s ease, transform 0.6s ease" : "none",
        opacity: phase === "reveal" ? 0 : 1,
        transform: phase === "reveal" ? "scale(1.03)" : "scale(1)",
        willChange: "opacity, transform",
      }}
    >
      {/* Grid bg — static, no animation */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(204,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(204,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.6,
        }}
      />

      {/* Red corner accents */}
      <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-[#ff0033] pointer-events-none" />
      <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-[#ff0033] pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-[#ff0033] pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-[#ff0033] pointer-events-none" />

      {/* Logo */}
      <div className="text-center mb-12 relative z-10 select-none">
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(72px, 15vw, 110px)",
            color: "#ffffff",
            letterSpacing: "0.25em",
            lineHeight: 1,
            animation: "logoReveal 1s cubic-bezier(0.22,1,0.36,1) forwards",
            textShadow: "0 0 30px rgba(255,0,51,0.4)",
          }}
        >
          REDSEE
        </div>
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "10px",
            letterSpacing: "8px",
            color: "#ff0033",
            textTransform: "uppercase",
            marginTop: 8,
            animation: "fadeIn 1s ease 0.6s both",
          }}
        >
          LUXURY STREETWEAR
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-[240px] md:w-[320px] mb-4 relative z-10">
        <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #7A0000, #ff0033)",
              willChange: "width",
            }}
          />
        </div>
        <div className="flex justify-between mt-3 font-montserrat text-[9px] tracking-widest text-zinc-500 uppercase">
          <span>LOADING COLLECTION</span>
          <span className="text-[#ff0033] font-bold">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "8px",
          letterSpacing: "4px",
          color: "#444",
          textTransform: "uppercase",
          animation: "fadeIn 1s ease 0.8s both",
        }}
        className="text-center w-full"
      >
        EST. 2024 · PREMIUM STREETWEAR
      </div>
    </div>
  );
}
