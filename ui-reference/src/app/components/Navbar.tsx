import { useState, useEffect, useRef } from "react";
import { Search, Heart, ShoppingBag, User, X, Menu, ChevronRight } from "lucide-react";

const NAV_LINKS = [
  { label: "New In", href: "#" },
  { label: "Drops", href: "#" },
  { label: "Streetwear", href: "#featured" },
  { label: "Footwear", href: "#trending" },
  { label: "Lookbook", href: "#lookbook" },
  { label: "Sale", href: "#flash-sale", red: true },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount] = useState(2);
  const [wishCount] = useState(3);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || cartOpen ? "hidden" : "";
  }, [mobileOpen, cartOpen]);

  return (
    <>
      {/* Top announcement bar */}
      <div
        style={{
          background: "linear-gradient(90deg, #8b0000, #cc0000, #8b0000)",
          backgroundSize: "200% 100%",
          animation: "shimmer 4s linear infinite",
          padding: "8px 0",
          textAlign: "center",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "11px",
          letterSpacing: "3px",
          color: "#fff",
          textTransform: "uppercase",
          fontWeight: 600,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        FREE WORLDWIDE SHIPPING ON ORDERS OVER $200 · USE CODE <strong>REDSEE10</strong> FOR 10% OFF
      </div>

      {/* Main navbar */}
      <nav
        style={{
          position: "fixed",
          top: 36,
          left: 0,
          right: 0,
          zIndex: 999,
          marginTop: 0,
          transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          background: scrolled
            ? "rgba(8, 8, 8, 0.95)"
            : "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.5)" : "none",
          paddingTop: 0,
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <a
            href="#"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28,
              color: "#fff",
              textDecoration: "none",
              letterSpacing: "0.15em",
              textShadow: scrolled ? "0 0 20px rgba(204,0,0,0.5)" : "none",
              transition: "text-shadow 0.4s ease",
            }}
          >
            RED<span style={{ color: "#cc0000" }}>SEE</span>
          </a>

          {/* Desktop links */}
          <div
            style={{
              display: "flex",
              gap: 32,
              alignItems: "center",
            }}
            className="hidden-mobile"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`nav-link${link.red ? " nav-link-red" : ""}`}
                style={{
                  color: link.red ? "#cc0000" : "#ccc",
                  textDecoration: "none",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  position: "relative",
                  transition: "color 0.2s ease",
                  paddingBottom: 4,
                }}
              >
                {link.label}
                {link.red && (
                  <span
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -12,
                      background: "#cc0000",
                      color: "#fff",
                      fontSize: "8px",
                      padding: "1px 4px",
                      letterSpacing: "1px",
                      boxShadow: "0 0 8px rgba(204,0,0,0.6)",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    HOT
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Right icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <NavIconBtn onClick={() => setSearchOpen(true)} label="Search">
              <Search size={18} />
            </NavIconBtn>
            <NavIconBtn label="Wishlist">
              <Heart size={18} />
              {wishCount > 0 && <Badge count={wishCount} />}
            </NavIconBtn>
            <NavIconBtn onClick={() => setCartOpen(true)} label="Cart">
              <ShoppingBag size={18} />
              {cartCount > 0 && <Badge count={cartCount} red />}
            </NavIconBtn>
            <NavIconBtn label="Account">
              <User size={18} />
            </NavIconBtn>
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="show-mobile"
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "none",
                padding: 8,
                display: "none",
              }}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Search overlay */}
      {searchOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: "rgba(0,0,0,0.95)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.3s ease",
          }}
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <button
            onClick={() => setSearchOpen(false)}
            style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", color: "#fff", cursor: "none" }}
          >
            <X size={24} />
          </button>
          <div style={{ width: "clamp(280px, 60vw, 640px)", textAlign: "center" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: "6px", color: "#444", marginBottom: 24, textTransform: "uppercase" }}>
              SEARCH COLLECTION
            </p>
            <div style={{ position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#444" }} />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search products, drops, collections..."
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  padding: "18px 18px 18px 48px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#cc0000")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 24, justifyContent: "center", flexWrap: "wrap" }}>
              {["Oversized Tees", "Cargo Pants", "Hoodies", "Sneakers", "New Drops"].map((term) => (
                <span
                  key={term}
                  style={{
                    padding: "6px 14px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#888",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "11px",
                    letterSpacing: "1px",
                    cursor: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#cc0000"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "#888"; }}
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <>
          <div
            onClick={() => setCartOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.7)", animation: "fadeIn 0.3s ease" }}
          />
          <div
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              bottom: 0,
              width: "clamp(300px, 40vw, 420px)",
              background: "#0f0f0f",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              animation: "slideInRight 0.4s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.1em" }}>YOUR CART</span>
                <span style={{ marginLeft: 8, fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "#cc0000", letterSpacing: "2px" }}>({cartCount})</span>
              </div>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "none" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              {[
                { name: "REDSEE Oversized Tee", size: "L", price: "$89", color: "Black", img: "https://images.unsplash.com/photo-1652823780977-b22c0ed84c97?w=80&h=80&fit=crop" },
                { name: "REDSEE Cargo Pants", size: "32", price: "$145", color: "Charcoal", img: "https://images.unsplash.com/photo-1628030328071-538b251a4455?w=80&h=80&fit=crop" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <img src={item.img} alt={item.name} style={{ width: 72, height: 72, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff" }}>{item.name}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "#555", marginTop: 4 }}>Size: {item.size} · {item.color}</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: "#cc0000", marginTop: 8, letterSpacing: "0.1em" }}>{item.price}</div>
                  </div>
                  <button style={{ background: "none", border: "none", color: "#444", cursor: "none", alignSelf: "flex-start" }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ padding: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontFamily: "'Space Grotesk', sans-serif" }}>
                <span style={{ color: "#888", fontSize: 13 }}>SUBTOTAL</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.1em" }}>$234.00</span>
              </div>
              <button
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "linear-gradient(135deg, #8b0000, #cc0000)",
                  border: "none",
                  color: "#fff",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 18,
                  letterSpacing: "3px",
                  cursor: "none",
                  boxShadow: "0 0 20px rgba(204,0,0,0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(204,0,0,0.6)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(204,0,0,0.3)"; }}
              >
                CHECKOUT
              </button>
            </div>
          </div>
        </>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.7)" }} />
          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              width: "80vw",
              maxWidth: 320,
              background: "#0a0a0a",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              zIndex: 9999,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              animation: "slideInLeft 0.4s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: "0.15em" }}>
                RED<span style={{ color: "#cc0000" }}>SEE</span>
              </span>
              <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "none" }}>
                <X size={20} />
              </button>
            </div>
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: link.red ? "#cc0000" : "#fff",
                  textDecoration: "none",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 28,
                  letterSpacing: "0.1em",
                  paddingBottom: 20,
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  marginBottom: 20,
                }}
              >
                {link.label}
                <ChevronRight size={16} color="#333" />
              </a>
            ))}
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: #fff;
          transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-link-red::after {
          background: #cc0000;
          box-shadow: 0 0 6px rgba(204,0,0,0.8);
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-link:hover {
          color: #fff !important;
        }
        .nav-link-red:hover {
          color: #ff4444 !important;
        }
      `}</style>
    </>
  );
}

function NavIconBtn({ children, onClick, label }: { children: React.ReactNode; onClick?: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        background: "none",
        border: "none",
        color: "#ccc",
        cursor: "none",
        padding: 10,
        position: "relative",
        transition: "color 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#ccc")}
    >
      {children}
    </button>
  );
}

function Badge({ count, red }: { count: number; red?: boolean }) {
  return (
    <span
      style={{
        position: "absolute",
        top: 4,
        right: 4,
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: red ? "#cc0000" : "#444",
        color: "#fff",
        fontSize: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        boxShadow: red ? "0 0 8px rgba(204,0,0,0.6)" : "none",
      }}
    >
      {count}
    </span>
  );
}
