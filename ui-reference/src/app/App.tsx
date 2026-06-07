import { useState } from "react";
import { LoadingScreen } from "./components/LoadingScreen";
import { CustomCursor } from "./components/CustomCursor";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { BrandBar, BrandBarReverse } from "./components/BrandBar";
import { FeaturedCollection } from "./components/FeaturedCollection";
import { TrendingProducts } from "./components/TrendingProducts";
import { FlashSale } from "./components/FlashSale";
import { Lookbook } from "./components/Lookbook";
import { Testimonials } from "./components/Testimonials";
import { InstagramFeed } from "./components/InstagramFeed";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ background: "#080808", minHeight: "100vh", position: "relative" }}>
      {/* Custom cursor */}
      <CustomCursor />

      {/* Loading screen */}
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      {/* Main content */}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease 0.2s",
        }}
      >
        {/* Announcement bar pushes navbar down — navbar is sticky with top padding */}
        <Navbar />

        <main>
          <HeroSection />
          <BrandBarReverse />
          <FeaturedCollection />
          <BrandBar />
          <TrendingProducts />
          <FlashSale />
          <Lookbook />
          <Testimonials />
          <InstagramFeed />
          <Newsletter />
        </main>

        <Footer />
      </div>

      {/* Global particles */}
      <Particles />
    </div>
  );
}

function Particles() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            borderRadius: "50%",
            background: i % 3 === 0 ? "#cc0000" : "rgba(255,255,255,0.3)",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            animation: `particleFloat ${8 + Math.random() * 12}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`,
            boxShadow: i % 3 === 0 ? "0 0 6px rgba(204,0,0,0.8)" : "none",
          }}
        />
      ))}
    </div>
  );
}
