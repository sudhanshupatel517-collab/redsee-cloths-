import { useEffect, useRef, useState } from "react";
import { Heart, ShoppingBag, Star, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const PRODUCTS = [
  {
    id: 1,
    name: "RS-01 Oversized Tee",
    category: "T-Shirts",
    price: 89,
    originalPrice: 120,
    rating: 4.9,
    reviews: 247,
    badge: "NEW",
    img1: "https://images.unsplash.com/photo-1652823780977-b22c0ed84c97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    img2: "https://images.unsplash.com/photo-1632682582909-2b3a2581eef7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    colors: ["#000", "#1a1a1a", "#cc0000", "#fff"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 8,
    limited: true,
  },
  {
    id: 2,
    name: "Darkness Hoodie",
    category: "Hoodies",
    price: 165,
    originalPrice: null,
    rating: 4.8,
    reviews: 183,
    badge: "LIMITED",
    img1: "https://images.unsplash.com/photo-1601063476271-a159c71ab0b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    img2: "https://images.unsplash.com/photo-1585928480583-b23601dd0a42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    colors: ["#000", "#cc0000", "#333"],
    sizes: ["S", "M", "L", "XL"],
    stock: 3,
    limited: true,
  },
  {
    id: 3,
    name: "Cyber Cargo Pants",
    category: "Bottoms",
    price: 145,
    originalPrice: 190,
    rating: 4.7,
    reviews: 94,
    badge: "SALE",
    img1: "https://images.unsplash.com/photo-1628030328071-538b251a4455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    img2: "https://images.unsplash.com/photo-1595175131454-8eba9a7e1997?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    colors: ["#1a1a1a", "#4a4a4a", "#8b7355"],
    sizes: ["28", "30", "32", "34", "36"],
    stock: 15,
    limited: false,
  },
  {
    id: 4,
    name: "REDSEE Runner Pro",
    category: "Footwear",
    price: 220,
    originalPrice: null,
    rating: 5.0,
    reviews: 61,
    badge: "DROP",
    img1: "https://images.unsplash.com/photo-1672920800748-a5fb6dfd0c2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    img2: "https://images.unsplash.com/photo-1623788975845-7d3e0adbae7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    colors: ["#fff", "#000", "#cc0000"],
    sizes: ["UK7", "UK8", "UK9", "UK10", "UK11"],
    stock: 5,
    limited: true,
  },
  {
    id: 5,
    name: "Red Puffer Jacket",
    category: "Outerwear",
    price: 285,
    originalPrice: 340,
    rating: 4.9,
    reviews: 128,
    badge: "HOT",
    img1: "https://images.unsplash.com/photo-1777499255585-992dd01ac559?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    img2: "https://images.unsplash.com/photo-1776721891718-df517cc65e8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    colors: ["#cc0000", "#000", "#1a3a6b"],
    sizes: ["XS", "S", "M", "L"],
    stock: 6,
    limited: true,
  },
  {
    id: 6,
    name: "Street Denim Jacket",
    category: "Outerwear",
    price: 195,
    originalPrice: null,
    rating: 4.6,
    reviews: 77,
    badge: null,
    img1: "https://images.unsplash.com/photo-1776589273954-bb2ebf8404dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    img2: "https://images.unsplash.com/photo-1777499253313-3f44996d058c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    colors: ["#4a5568", "#000", "#1a1a1a"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 20,
    limited: false,
  },
];

export function TrendingProducts() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [wishlisted, setWishlisted] = useState<number[]>([]);
  const [addedCart, setAddedCart] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el) => el.classList.add("revealed"));
          }
        });
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  const toggleWish = (id: number) =>
    setWishlisted((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]));

  const addToCart = (id: number) => {
    setAddedCart((prev) => [...prev, id]);
    setTimeout(() => setAddedCart((prev) => prev.filter((c) => c !== id)), 2000);
  };

  return (
    <section
      id="trending"
      ref={sectionRef}
      style={{ background: "#0a0a0a", padding: "120px 0", position: "relative", overflow: "hidden" }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "30%", right: -200, width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,0,0,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="reveal section-label" style={{ marginBottom: 12 }}>— Trending Now</div>
            <h2 className="reveal stagger-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 7vw, 80px)", color: "#fff", letterSpacing: "0.05em", lineHeight: 0.95 }}>
              HOT <span style={{ color: "#cc0000" }}>DROPS</span>
            </h2>
          </div>
          <div className="reveal stagger-2" style={{ display: "flex", gap: 8 }}>
            <ScrollBtn onClick={() => scroll("left")} dir="left" />
            <ScrollBtn onClick={() => scroll("right")} dir="right" />
          </div>
        </div>

        {/* Products */}
        <div
          ref={scrollRef}
          className="product-scroll"
          style={{ paddingBottom: 8 }}
        >
          {PRODUCTS.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              wishlisted={wishlisted.includes(product.id)}
              cartAdded={addedCart.includes(product.id)}
              onWishlist={() => toggleWish(product.id)}
              onCart={() => addToCart(product.id)}
              delay={i * 0.05}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, wishlisted, cartAdded, onWishlist, onCart, delay }: {
  product: typeof PRODUCTS[0];
  wishlisted: boolean;
  cartAdded: boolean;
  onWishlist: () => void;
  onCart: () => void;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const sale = product.originalPrice != null;
  const discount = sale ? Math.round((1 - product.price / product.originalPrice!) * 100) : 0;

  return (
    <div
      className="product-card reveal"
      style={{
        width: "clamp(260px, 28vw, 320px)",
        background: "#111",
        border: `1px solid ${hovered ? "rgba(204,0,0,0.25)" : "rgba(255,255,255,0.05)"}`,
        position: "relative",
        cursor: "none",
        flexShrink: 0,
        transitionDelay: `${delay}s`,
        transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease, border-color 0.3s ease",
        transform: hovered ? "translateY(-8px)" : "none",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(204,0,0,0.08)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div style={{ position: "relative", overflow: "hidden", paddingBottom: "120%" }}>
        <img
          src={product.img1}
          alt={product.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            transition: "opacity 0.5s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1)",
            opacity: hovered ? 0 : 1,
            transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
        />
        <img
          src={product.img2}
          alt={product.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            transition: "opacity 0.5s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1)",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scale(1)" : "scale(1.05)",
          }}
        />

        {/* Badges */}
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 4 }}>
          {product.badge && (
            <span className="badge-red">{product.badge}</span>
          )}
          {sale && (
            <span style={{
              background: "#fff",
              color: "#000",
              padding: "2px 8px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "1px",
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              -{discount}%
            </span>
          )}
          {product.limited && product.stock <= 5 && (
            <span style={{
              background: "rgba(204,0,0,0.15)",
              border: "1px solid rgba(204,0,0,0.4)",
              color: "#ff6666",
              padding: "2px 8px",
              fontSize: 9,
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "1px",
            }}>
              ONLY {product.stock} LEFT
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={onWishlist}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${wishlisted ? "#cc0000" : "rgba(255,255,255,0.1)"}`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "none",
            transition: "all 0.3s ease",
            transform: hovered ? "scale(1)" : "scale(0.9)",
            opacity: hovered ? 1 : 0.7,
          }}
        >
          <Heart
            size={15}
            fill={wishlisted ? "#cc0000" : "none"}
            color={wishlisted ? "#cc0000" : "#fff"}
          />
        </button>

        {/* Quick view */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            padding: "12px",
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Eye size={14} color="#888" />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "2px", color: "#888", textTransform: "uppercase" }}>
            Quick View
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "16px" }}>
        {/* Color swatches */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {product.colors.map((color, i) => (
            <button
              key={i}
              onClick={() => setSelectedColor(i)}
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: color,
                border: `2px solid ${selectedColor === i ? "#cc0000" : "rgba(255,255,255,0.15)"}`,
                cursor: "none",
                transition: "border-color 0.2s ease",
                boxShadow: selectedColor === i ? "0 0 6px rgba(204,0,0,0.6)" : "none",
              }}
            />
          ))}
        </div>

        {/* Category */}
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, letterSpacing: "3px", color: "#555", textTransform: "uppercase", marginBottom: 4 }}>
          {product.category}
        </div>

        {/* Name */}
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 8 }}>
          {product.name}
        </div>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 2 }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                fill={i < Math.floor(product.rating) ? "#cc0000" : "none"}
                color={i < Math.floor(product.rating) ? "#cc0000" : "#333"}
              />
            ))}
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: "#555" }}>
            ({product.reviews})
          </span>
        </div>

        {/* Sizes */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14 }}>
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              style={{
                padding: "3px 7px",
                border: `1px solid ${selectedSize === size ? "#cc0000" : "rgba(255,255,255,0.1)"}`,
                background: selectedSize === size ? "rgba(204,0,0,0.15)" : "transparent",
                color: selectedSize === size ? "#fff" : "#555",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 9,
                letterSpacing: "1px",
                cursor: "none",
                transition: "all 0.2s ease",
              }}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Price + Cart */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "#fff", letterSpacing: "0.05em" }}>
              ${product.price}
            </span>
            {sale && (
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "#444", textDecoration: "line-through", marginLeft: 8 }}>
                ${product.originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={onCart}
            style={{
              width: 40,
              height: 40,
              background: cartAdded ? "#cc0000" : "rgba(255,255,255,0.05)",
              border: `1px solid ${cartAdded ? "#cc0000" : "rgba(255,255,255,0.1)"}`,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "none",
              transition: "all 0.3s ease",
              boxShadow: cartAdded ? "0 0 15px rgba(204,0,0,0.6)" : "none",
            }}
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ScrollBtn({ onClick, dir }: { onClick: () => void; dir: "left" | "right" }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 48,
        height: 48,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "transparent",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "none",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "#cc0000";
        el.style.background = "rgba(204,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(255,255,255,0.1)";
        el.style.background = "transparent";
      }}
    >
      {dir === "left" ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );
}
