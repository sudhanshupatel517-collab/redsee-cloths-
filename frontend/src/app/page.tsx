"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchHomeData, setHasLoadedOnce } from "@/store/homeSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, ChevronLeft, Clock, Zap, Star, ArrowRight, RefreshCw,
  ShoppingBag, Search, MapPin, Crown, ShieldCheck, Truck, RotateCcw, Sparkles, Flame, Heart, User, Sun, Moon
} from "lucide-react";
import { useTheme } from "next-themes";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/axios";
import LoadingScreen from "@/components/LoadingScreen";
import RecentlyViewedShelf from "@/components/RecentlyViewedShelf";
import { optimizeImageUrl } from "@/lib/image";

// Category circles curated for luxury streetwear (Men and Women circles removed per user request)
const STYLE_CATEGORIES = [
  { name: "Oversized", slug: "oversized", img: "/overts.png" },
  { name: "Hoodies", slug: "hoodies", img: "/hoodie.png" },
  { name: "Cargo", slug: "cargo", img: "/cargo.png" },
  { name: "Lower", slug: "lower", img: "/lower.png" },
  { name: "Shirts", slug: "shirts", img: "/shirt.png" },
  { name: "Jackets", slug: "jacket", img: "/jacket.png" },
];

const BRANDS = [
  "REDSEE", "·", "LUXURY STREETWEAR", "·", "FW26 COLLECTION", "·",
  "BORN IN DARKNESS", "·", "LIMITED DROPS", "·", "CYBERPUNK FASHION", "·",
  "PREMIUM QUALITY", "·", "WORLDWIDE SHIPPING", "·", "EST. 2024", "·",
];

function BrandBar() {
  return (
    <div className="bg-zinc-50 dark:bg-[#0a0a0a] border-y border-zinc-200 dark:border-white/5 py-3 overflow-hidden relative transition-colors duration-300">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-zinc-50 dark:from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-zinc-50 dark:from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="flex whitespace-nowrap animate-marquee w-max font-bebas text-xs md:text-sm tracking-[0.3em] uppercase">
        {[...Array(2)].map((_, ri) => (
          <div key={ri} className="flex">
            {BRANDS.map((word, i) => (
              <span
                key={`${ri}-${i}`}
                className={`px-4 ${
                  word === "·" ? "text-[#ff0033] text-glow" : "text-zinc-700"
                }`}
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

function BrandBarReverse() {
  const words = ["NEW DROP", "·", "EXCLUSIVE", "·", "REDSEE", "·", "LUXURY", "·", "DARK AESTHETICS", "·", "CYBERPUNK", "·", "STREETWEAR", "·"];
  return (
    <div className="bg-[#ff0033]/5 border-y border-[#ff0033]/10 py-2.5 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white/20 dark:from-black/20 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white/20 dark:from-black/20 to-transparent z-10 pointer-events-none" />
      <div className="flex whitespace-nowrap animate-marquee-reverse w-max font-montserrat text-[10px] font-semibold tracking-widest uppercase">
        {[...Array(2)].map((_, ri) => (
          <div key={ri} className="flex items-center">
            {words.map((word, i) => (
              <span
                key={`${ri}-${i}`}
                className={`px-4 ${
                  word === "·" ? "text-[#ff0033]" : "text-zinc-500"
                }`}
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

function LookbookSection() {
  const { lookbook } = useSelector((state: RootState) => state.home);

  const fallbackItems = [
    {
      imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
      chapter: "CHAPTER 01",
      title: "THE VOID",
      span: "col-span-2 row-span-2 md:h-[450px]"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
      chapter: "CHAPTER 02",
      title: "EARTH BOUND",
      span: "col-span-1 row-span-1 md:h-[217px]"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
      chapter: "CHAPTER 03",
      title: "SHIMMER",
      span: "col-span-1 row-span-1 md:h-[217px]"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
      chapter: "CHAPTER 04",
      title: "ELECTRIC BLUE",
      span: "col-span-1 row-span-1 md:h-[217px]"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80",
      chapter: "CHAPTER 05",
      title: "WATCHMAN",
      span: "col-span-1 row-span-1 md:h-[217px]"
    }
  ];

  const itemsToRender = lookbook && lookbook.length > 0 ? lookbook : fallbackItems;

  return (
    <section className="bg-zinc-50 dark:bg-[#080808] py-16 px-4 md:px-8 border-t border-zinc-200 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
      <div className="absolute -top-40 left-1/3 w-[500px] h-[500px] bg-[#ff0033]/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.2em] text-[#ff0033] block mb-1">
              — Editorial Lookbook
            </span>
            <h2 className="text-4xl md:text-5xl font-bebas text-black dark:text-white tracking-widest uppercase">
              REDSEE <span className="text-[#ff0033] text-glow">STUDIOS</span>
            </h2>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-poppins max-w-xs leading-relaxed">
            A cinematic exploration of contemporary dark aesthetics, streetwear culture, and premium design details.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {itemsToRender.map((item, idx) => (
            <div
              key={item._id || idx}
              className={`relative overflow-hidden rounded-xl bg-zinc-950 border border-white/5 group aspect-square md:aspect-auto ${item.span}`}
            >
              <img
                src={optimizeImageUrl(item.imageUrl, 600)}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              
              <div className="absolute bottom-4 left-4 right-4 translate-y-1 group-hover:translate-y-0 transition-transform">
                <span className="text-[8px] font-montserrat font-bold tracking-widest text-[#ff0033] block mb-1 uppercase">
                  {item.chapter}
                </span>
                <span className="text-sm font-bebas text-white tracking-wider block">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  // Destructure all required shelves from Redux store
  const { 
    banners, 
    justDropped, 
    trendingNow, 
    bestSellers, 
    mensCollection, 
    womensCollection, 
    limitedDrops, 
    offersForYou, 
    newArrivals, 
    categories,
    hasLoadedOnce,
    loading 
  } = useSelector((state: RootState) => state.home);
  
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items) || [];
  const wishlistCount = wishlistItems.length;

  // States
  const { resolvedTheme, setTheme } = useTheme();
  const [themeMounted, setThemeMounted] = useState(false);
  
  useEffect(() => {
    setThemeMounted(true);
  }, []);

  useEffect(() => {
    if (hasLoadedOnce) {
      setLoaded(true);
    }
  }, [hasLoadedOnce]);

  const currentTheme = resolvedTheme || 'dark';

  const [currentBanner, setCurrentBanner] = useState(0);
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [shrunk, setShrunk] = useState(false);
  
  // Refs for drag-to-scroll and swipe behaviors
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftState = useRef(0);
  const dragDistance = useRef(0);

  // Dynamic filter states
  const [activeGenderTab, setActiveGenderTab] = useState<"men" | "women">("men");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loadingFiltered, setLoadingFiltered] = useState(false);

  // Helper function to filter products client-side by gender
  const getFilteredProducts = useCallback((productList: any[]) => {
    if (!productList) return [];
    return productList.filter((product: any) => {
      const cat = (product.category || "").toLowerCase();
      const name = (product.name || "").toLowerCase();
      const tags = (product.tags || []).map((t: string) => t.toLowerCase());

      const isWomen = cat.includes("women") || name.includes("women") || tags.includes("women") || tags.includes("woman");
      const isMen = cat.includes("men") || name.includes("men") || tags.includes("men") || tags.includes("man") || cat.includes("oversized") || cat.includes("hoodie") || cat.includes("sneaker") || cat.includes("jacket") || cat.includes("cap"); // default men categories if not women
      
      if (activeGenderTab === "men") {
        return isMen && !isWomen;
      } else {
        return isWomen;
      }
    });
  }, [activeGenderTab]);

  // Reset slide index when gender changes to prevent errors
  useEffect(() => {
    setCurrentBanner(0);
  }, [activeGenderTab]);

  // Geolocation & Delivery States
  const [deliveryLocation, setDeliveryLocation] = useState("Mumbai 400001");
  const [pincodeInput, setPincodeInput] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const loadData = useCallback(() => {
    setFetchError(false);
    setLoadingTimedOut(false);
    dispatch(fetchHomeData())
      .unwrap()
      .catch(() => setFetchError(true));
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData, retryCount]);

  // Handle Header Shrinking on scroll with hysteresis to prevent fumbling/looping
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShrunk((prev) => {
        if (prev) {
          // If already shrunk, only expand if scrolling back up near the top (e.g., < 40px)
          return currentScrollY > 40;
        } else {
          // If not shrunk, only shrink if scrolled past a safe buffer (e.g., > 140px)
          return currentScrollY > 140;
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle active filters and query database dynamically
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredProducts([]);
      return;
    }

    const fetchFilteredProducts = async () => {
      try {
        setLoadingFiltered(true);
        let queryCategory = activeCategory;
        if (categories && categories.length > 0) {
          const matchedDbCat = categories.find((c: any) => c.slug === activeCategory);
          if (matchedDbCat) {
            queryCategory = matchedDbCat.name;
          }
        } else {
          const matchedFallbackCat = STYLE_CATEGORIES.find((c: any) => c.slug === activeCategory);
          if (matchedFallbackCat) {
            queryCategory = matchedFallbackCat.name;
          }
        }

        let url = `/api/products?`;
        const params: string[] = [];
        params.push(`category=${encodeURIComponent(queryCategory)}`);
        params.push(`section=${encodeURIComponent(activeGenderTab)}`);
        
        const { data } = await api.get(url + params.join("&"));
        setFilteredProducts(data);
      } catch (err) {
        console.error("Failed to fetch filtered products:", err);
      } finally {
        setLoadingFiltered(false);
      }
    };

    const debounceFetch = setTimeout(fetchFilteredProducts, 150);
    return () => clearTimeout(debounceFetch);
  }, [activeCategory, activeGenderTab, categories]);

  // Detect location
  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setDeliveryLocation("Detected Location (400001)");
          setShowLocationModal(false);
        } catch (e) {
          setDeliveryLocation("Bengaluru 560001");
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setDeliveryLocation("New Delhi 110001");
        setDetectingLocation(false);
        setShowLocationModal(false);
      }
    );
  };

  const handleManualPincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeInput.trim().length >= 4) {
      setDeliveryLocation(`Pincode: ${pincodeInput}`);
      setShowLocationModal(false);
      setPincodeInput("");
    }
  };

  // If loading takes longer than 8 seconds, stop showing skeletons and show fallback
  useEffect(() => {
    if (!loading) {
      setLoadingTimedOut(false);
      return;
    }
    const timeout = setTimeout(() => {
      setLoadingTimedOut(true);
    }, 8000);
    return () => clearTimeout(timeout);
  }, [loading]);

  const showLoading = loading && !loadingTimedOut && !fetchError;

  // Filter banners based on active gender
  const filteredBanners = banners.filter((b: any) => {
    const title = (b.title || "").toLowerCase();
    const desc = (b.description || "").toLowerCase();
    if (activeGenderTab === "men") {
      return !title.includes("women") && !desc.includes("women");
    } else {
      return !title.includes("men") && !desc.includes("men") || title.includes("women") || desc.includes("women");
    }
  });

  // Curate circular categories dynamically from database, filter by gender tab and exclude subcategories
  const displayCategories = categories && categories.length > 0 
    ? categories
        .filter((c: any) => !c.parentCategory && c.section?.toLowerCase() === activeGenderTab.toLowerCase())
        .map((c: any) => ({
          name: c.name,
          slug: c.slug,
          img: c.imageUrl || '/overts.png'
        }))
    : STYLE_CATEGORIES;

  // Curate active promotional slides
  const slides = filteredBanners.length > 0 ? filteredBanners : [
    {
      title: activeGenderTab === "men" ? "MEN'S URBAN EXCLUSIVES" : "WOMEN'S CROWN DROPS",
      description: "Upgrade your streetwear rotation with premium luxury designs.",
      imageUrl: activeGenderTab === "men" 
        ? "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=1000" 
        : "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000",
      linkUrl: activeGenderTab === "men" ? "/category/men" : "/category/women"
    },
    {
      title: "BUY 1 HOODIE GET 1 TEE FREE",
      description: "Exclusive Luxury Streetwear Promo • Limited Time Only",
      imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000",
      linkUrl: "/shop"
    },
    {
      title: "MID-SEASON ANNOUNCEMENT - 20% OFF",
      description: "Use code REDSEE20 on checkout. Valid on all collections.",
      imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000",
      linkUrl: "/shop"
    }
  ];

  // Helper to center target slide card smoothly
  const scrollToBanner = (idx: number) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const children = container.children;
    if (children[idx]) {
      const child = children[idx] as HTMLElement;
      const targetScrollLeft = child.offsetLeft - (container.clientWidth - child.clientWidth) / 2;
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
      setCurrentBanner(idx);
    }
  };

  const goToBanner = (dir: 'prev' | 'next') => {
    if (!sliderRef.current || slides.length < 2) return;
    const container = sliderRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || container.clientWidth;
    const gap = 16;
    const step = cardWidth + gap;

    let targetScrollLeft = container.scrollLeft;
    if (dir === 'next') {
      targetScrollLeft += step;
      // Loop if at the very end
      if (targetScrollLeft >= container.scrollWidth - container.clientWidth - 20) {
        targetScrollLeft = 0;
      }
    } else {
      targetScrollLeft -= step;
      // Loop if at the very start
      if (targetScrollLeft <= 10) {
        targetScrollLeft = container.scrollWidth - container.clientWidth;
      }
    }

    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });
  };

  // Carousel auto-rotate
  useEffect(() => {
    if (slides.length > 1 && !carouselPaused) {
      const interval = setInterval(() => goToBanner('next'), 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length, carouselPaused]);

  // Drag to scroll handlers (for laptop/mouse drag)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftState.current = sliderRef.current.scrollLeft;
    dragDistance.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeftState.current - walk;
    dragDistance.current = Math.abs(x - startX.current);
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  // Detect which slide is currently centered and update indicator state
  const handleSliderScroll = () => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const children = container.children;
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    if (closestIndex !== currentBanner) {
      setCurrentBanner(closestIndex);
    }
  };

  const handleCardClick = (link: string) => {
    if (dragDistance.current < 6) {
      router.push(link);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-black dark:text-white min-h-screen pb-24 overflow-x-hidden transition-colors duration-300">
      {!hasLoadedOnce && (
        <LoadingScreen 
          onComplete={() => {
            setLoaded(true);
            dispatch(setHasLoadedOnce());
          }} 
        />
      )}
      
      <div 
        style={{ 
          opacity: loaded ? 1 : 0, 
          transition: "opacity 0.6s ease 0.2s",
          pointerEvents: loaded ? "auto" : "none"
        }}
      >
        
        {/* ============ STICKY AUTO-SHRINKING HOMEPAGE HEADER ============ */}
        <header className={`sticky top-0 z-40 bg-white/95 dark:bg-black/95 border-b border-zinc-200 dark:border-white/5 transition-all duration-300 backdrop-blur-md ${shrunk ? "py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.8)]" : "py-4"}`}>
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img src={currentTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png'} alt="REDSEE" className={`transition-all duration-300 object-contain ${shrunk ? "h-6 md:h-7" : "h-8 md:h-9"}`} />
            </Link>

            {/* Centered Search Bar */}
            <div 
              onClick={() => router.push('/search')}
              className="flex-grow max-w-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-2 flex items-center cursor-pointer hover:border-[#ff0033]/30 transition-colors"
            >
              <Search size={15} className="text-zinc-500 dark:text-gray-500 mr-3 flex-shrink-0" />
              <span className="font-poppins text-xs md:text-sm text-zinc-500 dark:text-gray-500 truncate select-none">Search products...</span>
            </div>

            {/* Quick Actions (Theme, Cart, Profile) */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              {themeMounted && (
                <button 
                  onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
                  className="hidden md:flex p-2 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors relative"
                  aria-label="Toggle Theme"
                >
                  {currentTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              )}
              <Link href="/cart" className="hidden md:flex p-2 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors relative" aria-label="Cart">
                <ShoppingBag size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ff0033] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_8px_rgba(255,0,51,0.6)] animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/profile" className="p-2 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" aria-label="Profile">
                <User size={16} />
              </Link>
            </div>
          </div>

          {/* Inline filters for Men / Women - Segmented sliding toggle control */}
          <div className={`transition-all duration-300 overflow-hidden ${shrunk ? "max-h-0 opacity-0 pointer-events-none" : "max-h-16 opacity-100 mt-3 border-t border-zinc-200 dark:border-white/5"}`}>
            <div className="flex justify-center px-4 py-2.5">
              <div className="relative flex w-full max-w-xs bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-full p-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]">
                {/* Sliding indicator */}
                <div 
                  className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-[#ff0033] to-[#cc0029] shadow-[0_2px_12px_rgba(255,0,51,0.5)] transition-all duration-300 ease-out"
                  style={{
                    width: 'calc(50% - 6px)',
                    left: activeGenderTab === 'men' ? '4px' : 'calc(50% + 2px)'
                  }}
                />
                
                <button
                  onClick={() => {
                    setActiveGenderTab('men');
                    setActiveCategory('all');
                  }}
                  className={`relative z-10 flex-1 py-1.5 text-xs font-montserrat font-bold tracking-widest uppercase text-center transition-colors duration-300 ${
                    activeGenderTab === 'men' ? 'text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                  }`}
                >
                  Men
                </button>
                
                <button
                  onClick={() => {
                    setActiveGenderTab('women');
                    setActiveCategory('all');
                  }}
                  className={`relative z-10 flex-1 py-1.5 text-xs font-montserrat font-bold tracking-widest uppercase text-center transition-colors duration-300 ${
                    activeGenderTab === 'women' ? 'text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                  }`}
                >
                  Women
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Filter Results Page (Shows when category filter active) */}
        {activeCategory !== "all" ? (
          <div className="px-4 py-8 max-w-7xl mx-auto animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
              <div>
                <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.2em] text-[#ff0033] block mb-1">Filtered Collection</span>
                <h2 className="text-3xl font-bebas text-white tracking-widest uppercase">
                  {(() => {
                    if (categories && categories.length > 0) {
                      const found = categories.find((c: any) => c.slug === activeCategory);
                      if (found) return found.name;
                    }
                    const fallback = STYLE_CATEGORIES.find((c: any) => c.slug === activeCategory);
                    if (fallback) return fallback.name;
                    return activeCategory;
                  })()} • {activeGenderTab === "men" ? "Men's Collection" : "Women's Collection"}
                </h2>
              </div>
              <button 
                onClick={() => {
                  setActiveCategory("all");
                }}
                className="text-xs font-montserrat uppercase tracking-wider text-gray-500 hover:text-white underline"
              >
                Clear Filters
              </button>
            </div>

            {loadingFiltered ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-full">
                    <div className="aspect-[3/4] bg-zinc-200 dark:bg-white/5 rounded-xl mb-3 skeleton" />
                    <div className="h-4 bg-zinc-200 dark:bg-white/5 rounded w-3/4 mb-2 skeleton" />
                    <div className="h-4 bg-zinc-200 dark:bg-white/5 rounded w-1/2 skeleton" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={product.pricing?.finalPrice || 0}
                    image={typeof product.images?.[0] === 'string' ? product.images[0] : (product.images?.[0]?.url || '')}
                    hoverImage={typeof product.images?.[1] === 'string' ? product.images[1] : (product.images?.[1]?.url || (typeof product.images?.[0] === 'string' ? product.images[0] : (product.images?.[0]?.url || '')))}
                    category={product.category}
                    rating={5}
                    discount={product.pricing?.discountPercentage || 0}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-zinc-50 dark:bg-white/[0.01] rounded-xl border border-zinc-200 dark:border-white/5">
                <p className="text-zinc-550 dark:text-gray-500 font-poppins text-sm mb-4">No drops matching this combination.</p>
                <button 
                  onClick={() => {
                    setActiveCategory("all");
                  }}
                  className="bg-[#ff0033] text-white text-xs px-5 py-2.5 font-montserrat font-bold tracking-wider rounded uppercase hover:bg-red-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Normal Flipkart-Inspired Homepage Flow */
          <div className="animate-fadeIn">
            
            {/* ============ SECTION 1: CIRCULAR CATEGORIES ============ */}
            <div className="bg-zinc-50 dark:bg-[#0b0b0b] border-b border-zinc-200 dark:border-white/5 py-6 transition-colors duration-300">
              <div className="flex overflow-x-auto no-scrollbar px-4 gap-4 md:gap-8 md:justify-center">
                {displayCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      if (cat.slug === "men" || cat.slug === "women") {
                        setActiveGenderTab(cat.slug as any);
                      } else {
                        setActiveCategory(cat.slug);
                      }
                    }}
                    className="flex flex-col items-center gap-2 min-w-[70px] cat-circle group cursor-pointer"
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border border-zinc-200 dark:border-white/10 group-hover:border-[#ff0033]/60 transition-all duration-300 bg-zinc-200 dark:bg-[#141414]">
                      <img src={optimizeImageUrl(cat.img, 150)} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] md:text-[11px] font-montserrat font-semibold text-zinc-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors whitespace-nowrap uppercase">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ============ SECTION 2: DELIVERY LOCATION BAR ============ */}
            <div className="bg-zinc-100 dark:bg-[#0e0e0e] border-b border-zinc-200 dark:border-white/5 py-2.5 px-4 flex items-center justify-between text-[11px] font-poppins text-zinc-600 dark:text-gray-400 transition-colors duration-300">
              <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin size={13} className="text-[#ff0033] flex-shrink-0" />
                  <span className="truncate">Deliver to <strong className="text-black dark:text-white">{deliveryLocation}</strong></span>
                </div>
                <button 
                  onClick={() => setShowLocationModal(true)} 
                  className="text-[#ff0033] font-montserrat font-bold uppercase tracking-wider text-[10px] hover:text-black dark:hover:text-white transition-all ml-2"
                >
                  Change Location
                </button>
              </div>
            </div>

            {/* ============ SECTION 3: COMPACT HERO SLIDER ============ */}
            <div className="relative w-full mt-4">
              {showLoading ? (
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                  <div className="w-full h-[22vh] md:h-[32vh] rounded-2xl skeleton" />
                </div>
              ) : (
                <div className="relative group w-full">
                  {/* Scroll Container */}
                  <div
                    ref={sliderRef}
                    onScroll={handleSliderScroll}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseLeave={handleMouseUpOrLeave}
                    className="flex gap-4 overflow-x-auto px-4 md:px-8 py-2 snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing select-none scroll-smooth"
                  >
                    {slides.map((item: any, idx: number) => {
                      const imgSrc = item.imageUrl || item.img || '';
                      const title = item.title || '';
                      const desc = item.description || item.sub || '';
                      const link = item._id ? `/offers/${item._id}` : (item.linkUrl || item.link || item.href || '/shop');

                      return (
                        <div
                          key={idx}
                          onClick={() => handleCardClick(link)}
                          className="w-[85vw] md:w-[65vw] lg:w-[55vw] h-[22vh] md:h-[32vh] flex-shrink-0 snap-center rounded-2xl overflow-hidden relative border border-white/5 shadow-2xl transition-transform duration-300"
                        >
                          <img
                            src={optimizeImageUrl(imgSrc, 1200)}
                            alt={title || `Slide ${idx + 1}`}
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                            draggable={false}
                          />

                          {/* Gradients */}
                          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/20 to-black/85 pointer-events-none" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent pointer-events-none" />

                          {/* Text Overlay */}
                          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8 z-10 w-full select-none">
                            <span className="bg-[#ff0033] text-white text-[7px] md:text-[8px] font-montserrat font-bold uppercase tracking-widest px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(255,0,51,0.5)] w-max mb-1 md:mb-2">
                              EXCLUSIVE DROP
                            </span>
                            <h2 className="text-lg md:text-3xl lg:text-4xl font-bebas text-white tracking-wider leading-none mb-0.5 md:mb-1 uppercase text-glow">
                              {title}
                            </h2>
                            <p className="text-gray-300 text-[9px] md:text-xs font-poppins max-w-[95%] md:max-w-[80%] line-clamp-1 md:line-clamp-2 mb-2 md:mb-4">
                              {desc}
                            </p>
                            <div className="flex">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleCardClick(link); }}
                                className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-3 py-1 md:px-5 md:py-2 text-[9px] md:text-xs font-montserrat font-bold uppercase tracking-widest transition-all rounded shadow-md active:scale-95 cursor-pointer"
                              >
                                Shop Now
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Left / Right Controls */}
                  {slides.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); goToBanner('prev'); }}
                        className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/90 transition-all z-20 cursor-pointer shadow-lg"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft size={20} className="text-white" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); goToBanner('next'); }}
                        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/90 transition-all z-20 cursor-pointer shadow-lg"
                        aria-label="Next slide"
                      >
                        <ChevronRight size={20} className="text-white" />
                      </button>
                    </>
                  )}

                  {/* Indicators */}
                  {slides.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-3">
                      {slides.map((_: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); scrollToBanner(idx); }}
                          className={`rounded-full transition-all duration-300 ${
                            idx === currentBanner
                              ? 'w-6 h-2 bg-[#ff0033] shadow-[0_0_8px_rgba(255,0,51,0.6)]'
                              : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <BrandBarReverse />

            {/* ============ CONTINUE SHOPPING / RECENTLY VIEWED ============ */}
            <RecentlyViewedShelf />

            {/* ============ SECTION 4: JUST DROPPED ============ */}
            <ProductShelf
              title="Just Dropped"
              subtitle="Latest releases & fresh designs"
              products={getFilteredProducts(justDropped)}
              loading={showLoading}
              link={activeGenderTab === "men" ? "/category/men" : "/category/women"}
            />

            {/* ============ SECTION 5: TRENDING NOW ============ */}
            <ProductShelf
              title="Trending Now"
              subtitle="Hot picks & viral looks"
              products={getFilteredProducts(trendingNow)}
              loading={showLoading}
              link={activeGenderTab === "men" ? "/category/men" : "/category/women"}
            />

            {/* ============ SECTION 6: BEST SELLERS ============ */}
            <ProductShelf
              title="Best Sellers"
              subtitle="Redsee classics & most wanted"
              products={getFilteredProducts(bestSellers)}
              loading={showLoading}
              link={activeGenderTab === "men" ? "/category/men" : "/category/women"}
            />

            {/* ============ SECTION 7: MEN'S COLLECTION ============ */}
            {activeGenderTab === "men" && (
              <ProductShelf
                title="Men Collection"
                subtitle="Luxury drops for men"
                products={getFilteredProducts(mensCollection)}
                loading={showLoading}
                link="/category/men"
              />
            )}

            {/* ============ SECTION 8: WOMEN'S COLLECTION ============ */}
            {activeGenderTab === "women" && (
              <ProductShelf
                title="Women Collection"
                subtitle="Futuristic collection for women"
                products={getFilteredProducts(womensCollection)}
                loading={showLoading}
                link="/category/women"
              />
            )}

            {/* ============ SECTION 9: LIMITED DROPS ============ */}
            <LimitedDropShelf
              title="Limited Drops"
              subtitle="Scarcity releases - low stock alert"
              products={getFilteredProducts(limitedDrops)}
              loading={showLoading}
            />

            {/* ============ SECTION 10: OFFERS FOR YOU ============ */}
            <ProductShelf
              title="Offers For You"
              subtitle="Unmissable bargains & promo discounts"
              products={getFilteredProducts(offersForYou)}
              loading={showLoading}
              link={activeGenderTab === "men" ? "/category/men" : "/category/women"}
            />

            {/* ============ SECTION 11: NEW ARRIVALS ============ */}
            <ProductShelf
              title="New Arrivals"
              subtitle="Latest designs added to store"
              products={getFilteredProducts(newArrivals)}
              loading={showLoading}
              link={activeGenderTab === "men" ? "/category/men" : "/category/women"}
            />

            <BrandBar />

            {/* ============ SECTION 12: EDITORIAL LOOKBOOK ============ */}
            <LookbookSection />
          </div>
        )}

        {/* ============ SECTION 13: TRUST BADGES ============ */}
        <div className="bg-zinc-50 dark:bg-[#0a0a0a] border-t border-zinc-200 dark:border-white/5 py-12 px-4 md:px-8 transition-colors duration-300">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Premium Quality", desc: "Crafted from choice materials", icon: Crown },
              { title: "Secure Payments", desc: "100% encrypted checkout", icon: ShieldCheck },
              { title: "Fast Delivery", desc: "Express delivery straight to door", icon: Truck },
              { title: "Easy Returns", desc: "Hassle-free 14-day replacement", icon: RotateCcw },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none">
                  <div className="w-10 h-10 rounded-full bg-[#ff0033]/10 border border-[#ff0033]/20 flex items-center justify-center text-[#ff0033] mb-3">
                    <Icon size={18} />
                  </div>
                  <h4 className="text-black dark:text-white text-xs font-montserrat font-bold uppercase tracking-wider mb-1">{item.title}</h4>
                  <p className="text-zinc-500 dark:text-gray-500 text-[10px] font-poppins leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============ PINCODE SELECTOR MODAL ============ */}
        {showLocationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowLocationModal(false)}
            />

            {/* Modal Body */}
            <div 
              className="relative bg-white dark:bg-[#111] border border-zinc-200 dark:border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl z-10 animate-fadeIn"
            >
              <h3 className="text-xl font-bebas text-black dark:text-white tracking-wider mb-2">Delivery Location</h3>
              <p className="text-zinc-500 dark:text-gray-400 text-xs font-poppins mb-5">Select where you want your streetwear drops delivered.</p>

              {/* Autodetect Button */}
              <button
                onClick={handleAutoDetectLocation}
                disabled={detectingLocation}
                className="w-full bg-[#ff0033] text-white py-3 rounded-lg font-montserrat font-bold tracking-widest text-[11px] uppercase flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 mb-4"
              >
                <MapPin size={14} className={detectingLocation ? "animate-bounce" : ""} />
                <span>{detectingLocation ? "Locating..." : "Use Current Location"}</span>
              </button>

              <div className="flex items-center my-4">
                <hr className="flex-grow border-zinc-200 dark:border-white/5" />
                <span className="px-3 text-[10px] font-montserrat text-zinc-400 dark:text-gray-500 uppercase tracking-widest">Or Enter Pincode</span>
                <hr className="flex-grow border-zinc-200 dark:border-white/5" />
              </div>

              {/* Manual Input */}
              <form onSubmit={handleManualPincodeSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 400001"
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value)}
                  className="flex-1 bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-black dark:text-white text-xs font-poppins outline-none focus:border-[#ff0033] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-[#ff0033] dark:hover:bg-[#ff0033] hover:text-white dark:hover:text-white px-4 rounded-lg font-montserrat font-bold text-xs uppercase transition-colors"
                >
                  Apply
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Error / Retry Banner */}
        {(fetchError || loadingTimedOut) && (
          <div className="mx-4 mt-4 bg-[#1a0000] border border-[#ff0033]/20 rounded-lg px-4 py-3 flex items-center justify-between">
            <p className="text-gray-400 text-xs font-poppins">
              {fetchError ? 'Could not load latest products.' : 'Loading is taking longer than usual.'}
            </p>
            <button
              onClick={() => setRetryCount(c => c + 1)}
              className="flex items-center gap-1.5 text-[#ff0033] text-xs font-montserrat font-bold uppercase tracking-wider hover:text-white transition-colors"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// Reusable horizontal product shelf component
interface ShelfProps {
  title: string;
  subtitle: string;
  products: any[];
  loading: boolean;
  link: string;
}

function ProductShelf({ title, subtitle, products, loading, link }: ShelfProps) {
  if (!loading && products.length === 0) return null;

  return (
    <section className="px-4 py-10 md:px-8 border-b border-zinc-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300">
      {/* Subtle decorative glow */}
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#ff0033]/2 rounded-full blur-[90px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.2em] text-[#ff0033] block mb-1">
              — {subtitle}
            </span>
            <h2 className="text-2xl md:text-3xl font-bebas text-black dark:text-white tracking-widest uppercase">
              {title}
            </h2>
          </div>
          <Link 
            href={link} 
            className="text-[10px] font-montserrat font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-widest flex items-center hover:text-black dark:hover:text-white transition-colors"
          >
            View All <ChevronRight size={12} className="ml-0.5" />
          </Link>
        </div>

        <div className="flex overflow-x-auto no-scrollbar pb-3 gap-4 snap-x snap-mandatory">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-[170px] md:w-[220px] flex-shrink-0">
                <div className="aspect-[3/4] bg-zinc-200 dark:bg-white/5 rounded-xl mb-3 skeleton" />
                <div className="h-4 bg-zinc-200 dark:bg-white/5 rounded w-3/4 mb-2 skeleton" />
                <div className="h-4 bg-zinc-200 dark:bg-white/5 rounded w-1/2 skeleton" />
              </div>
            ))
          ) : (
            products.map((product: any) => (
              <div key={product._id} className="w-[170px] md:w-[220px] flex-shrink-0 snap-start">
                <ProductCard
                  id={product._id}
                  name={product.name}
                  price={product.pricing?.finalPrice || 0}
                  image={typeof product.images?.[0] === 'string' ? product.images[0] : (product.images?.[0]?.url || '')}
                  hoverImage={typeof product.images?.[1] === 'string' ? product.images[1] : (product.images?.[1]?.url || (typeof product.images?.[0] === 'string' ? product.images[0] : (product.images?.[0]?.url || '')))}
                  category={product.category}
                  rating={5}
                  discount={product.pricing?.discountPercentage || 0}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

// Limited drop scarcity alert shelf
function LimitedDropShelf({ title, subtitle, products, loading }: { title: string; subtitle: string; products: any[]; loading: boolean }) {
  if (!loading && products.length === 0) return null;

  return (
    <section className="px-4 py-10 md:px-8 border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#0b0b0b] relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#ff0033]/2 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Flame size={18} className="text-[#ff0033] animate-pulse" />
          <div>
            <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.2em] text-[#ff0033] block mb-0.5">
              — {subtitle}
            </span>
            <h2 className="text-2xl md:text-3xl font-bebas text-black dark:text-white tracking-widest uppercase">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex overflow-x-auto no-scrollbar pb-3 gap-4 snap-x snap-mandatory">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-[170px] md:w-[220px] flex-shrink-0">
                <div className="aspect-[3/4] bg-zinc-200 dark:bg-white/5 rounded-xl mb-3 skeleton" />
                <div className="h-4 bg-zinc-200 dark:bg-white/5 rounded w-3/4 mb-2 skeleton" />
                <div className="h-4 bg-zinc-200 dark:bg-white/5 rounded w-1/2 skeleton" />
              </div>
            ))
          ) : (
            products.map((product: any, idx: number) => {
              const stocks = [3, 5, 8, 12, 15];
              const left = stocks[idx % stocks.length];
              return (
                <div key={product._id} className="w-[170px] md:w-[220px] flex-shrink-0 snap-start relative">
                  <ProductCard
                    id={product._id}
                    name={product.name}
                    price={product.pricing?.finalPrice || 0}
                    image={typeof product.images?.[0] === 'string' ? product.images[0] : (product.images?.[0]?.url || '')}
                    hoverImage={typeof product.images?.[1] === 'string' ? product.images[1] : (product.images?.[1]?.url || (typeof product.images?.[0] === 'string' ? product.images[0] : (product.images?.[0]?.url || '')))}
                    category={product.category}
                    rating={4.9}
                    discount={product.pricing?.discountPercentage || 0}
                  />
                  <div className="absolute bottom-[108px] left-2 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded border border-[#ff0033]/30 text-[8px] font-bold text-white tracking-wider flex items-center gap-1 z-10 shadow-[0_0_8px_rgba(255,0,51,0.2)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff0033] animate-ping" />
                    ONLY {left} LEFT
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
