import { useEffect, useRef, useState } from "react";
import { Instagram, Heart, MessageCircle, Play } from "lucide-react";

const POSTS = [
  {
    img: "https://images.unsplash.com/photo-1773614784481-338d3fabd022?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500",
    likes: "12.4K",
    comments: "284",
    type: "image",
  },
  {
    img: "https://images.unsplash.com/photo-1777499255585-992dd01ac559?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500",
    likes: "8.9K",
    comments: "156",
    type: "reel",
  },
  {
    img: "https://images.unsplash.com/photo-1652823780977-b22c0ed84c97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500",
    likes: "15.2K",
    comments: "431",
    type: "image",
  },
  {
    img: "https://images.unsplash.com/photo-1776721891718-df517cc65e8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500",
    likes: "6.7K",
    comments: "98",
    type: "image",
  },
  {
    img: "https://images.unsplash.com/photo-1628030328071-538b251a4455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500",
    likes: "9.3K",
    comments: "201",
    type: "reel",
  },
  {
    img: "https://images.unsplash.com/photo-1672920800748-a5fb6dfd0c2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500",
    likes: "11.1K",
    comments: "318",
    type: "image",
  },
];

export function InstagramFeed() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el) => el.classList.add("revealed"));
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
      ref={sectionRef}
      style={{ background: "#080808", padding: "100px 0", position: "relative", overflow: "hidden" }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="reveal section-label" style={{ marginBottom: 12 }}>— Follow The Movement</div>
          <h2 className="reveal stagger-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 7vw, 80px)", color: "#fff", letterSpacing: "0.05em", lineHeight: 0.95 }}>
            @<span style={{ color: "#cc0000" }}>REDSEE</span>
          </h2>
          <p className="reveal stagger-2" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "#555", marginTop: 12 }}>
            Tag us in your fits for a chance to be featured
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
          {POSTS.map((post, i) => (
            <PostCard key={i} post={post} delay={i * 0.08} index={i} />
          ))}
        </div>

        {/* Follow button */}
        <div className="reveal" style={{ textAlign: "center", marginTop: 48 }}>
          <a
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 40px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff",
              textDecoration: "none",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "12px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              cursor: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "#cc0000";
              el.style.background = "rgba(204,0,0,0.06)";
              el.style.boxShadow = "0 0 20px rgba(204,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.12)";
              el.style.background = "transparent";
              el.style.boxShadow = "none";
            }}
          >
            <Instagram size={16} />
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

function PostCard({ post, delay, index }: { post: typeof POSTS[0]; delay: number; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`reveal stagger-${(index % 6) + 1}`}
      style={{
        position: "relative",
        overflow: "hidden",
        paddingBottom: "100%",
        cursor: "none",
        transitionDelay: `${delay}s`,
        background: "#111",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={post.img}
        alt="Instagram post"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          transform: hovered ? "scale(1.08)" : "scale(1)",
        }}
      />

      {/* Reel indicator */}
      {post.type === "reel" && (
        <div style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          borderRadius: "50%",
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Play size={12} fill="#fff" color="#fff" />
        </div>
      )}

      {/* Hover overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        transition: "opacity 0.4s ease",
        opacity: hovered ? 1 : 0,
      }}>
        <div style={{ display: "flex", gap: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Heart size={18} fill="#fff" color="#fff" />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.05em", color: "#fff" }}>
              {post.likes}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MessageCircle size={18} color="#fff" fill="#fff" />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.05em", color: "#fff" }}>
              {post.comments}
            </span>
          </div>
        </div>
        <div style={{
          width: 32,
          height: 2,
          background: "#cc0000",
          boxShadow: "0 0 10px rgba(204,0,0,0.8)",
          animation: hovered ? "none" : "none",
        }} />
      </div>

      {/* Red glow on hover */}
      <div style={{
        position: "absolute",
        inset: 0,
        border: `2px solid ${hovered ? "rgba(204,0,0,0.5)" : "transparent"}`,
        boxShadow: hovered ? "inset 0 0 20px rgba(204,0,0,0.2)" : "none",
        transition: "all 0.4s ease",
        pointerEvents: "none",
      }} />
    </div>
  );
}
