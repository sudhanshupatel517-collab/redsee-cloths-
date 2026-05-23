"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchHomeData } from "@/store/homeSlice";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, MapPin, ChevronRight, Mic } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { banners, newArrivals, womensCollection, mensCollection, loading } = useSelector((state: RootState) => state.home);
  
  const [activeTab, setActiveTab] = useState<'MEN' | 'WOMEN'>('MEN');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchHomeData());
    // Fetch active events for the hero banner
    api.get('/api/events').then(res => {
      setEvents(res.data);
      setCurrentBanner(0); // Reset banner index to prevent out-of-bounds crash
    }).catch(console.error);
  }, [dispatch]);

  // Auto-scroll banners (now using events if available, else fallback banners)
  useEffect(() => {
    const bannerItems = events.length > 0 ? events : banners;
    if (bannerItems.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % bannerItems.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [events.length, banners.length]);

  return (
    <div className="bg-black min-h-screen pb-20 overflow-x-hidden">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="relative z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 py-3 px-4">
        <div className="flex bg-white/5 p-1 rounded-2xl relative border border-white/10 shadow-inner">
          {/* Animated Background Glow */}
          <motion.div 
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-r from-[#ff0033]/90 to-[#99001f] shadow-[0_0_15px_rgba(255,0,51,0.4)]"
            initial={false}
            animate={{ 
              x: activeTab === 'MEN' ? 0 : '100%',
              left: activeTab === 'MEN' ? '4px' : '4px'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
          
          <button 
            onClick={() => setActiveTab('MEN')}
            className={`flex-1 py-2.5 text-xs font-montserrat font-bold tracking-[0.2em] relative z-10 transition-colors duration-300 ${activeTab === 'MEN' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            MEN
          </button>
          <button 
            onClick={() => setActiveTab('WOMEN')}
            className={`flex-1 py-2.5 text-xs font-montserrat font-bold tracking-[0.2em] relative z-10 transition-colors duration-300 ${activeTab === 'WOMEN' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            WOMEN
          </button>
        </div>
      </div>

      {/* 2. DELIVERY LOCATION BAR */}
      <div className="px-4 py-3 bg-[#050505] border-b border-white/5 flex items-center justify-between cursor-pointer active:bg-white/5 transition-colors">
        <div className="flex items-center space-x-2">
          <MapPin size={16} className="text-[#ff0033]" />
          <div>
            <span className="text-[10px] text-gray-500 font-poppins block uppercase tracking-wider">Deliver to</span>
            <span className="text-xs text-white font-montserrat font-bold">Lucknow, Uttar Pradesh 226001</span>
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-600" />
      </div>

      {/* 3. SEARCH BAR SECTION */}
      <div className="px-4 py-4 bg-black">
        <div 
          onClick={() => router.push('/search')}
          className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-[inset_0_0_20px_rgba(255,0,51,0.02)] active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center">
            <SearchIcon size={18} className="text-gray-500 mr-3" />
            <span className="font-poppins text-sm text-gray-500">Search for products, brands...</span>
          </div>
          <div className="border-l border-white/10 pl-3">
            <Mic size={18} className="text-[#ff0033]" />
          </div>
        </div>
      </div>

      {/* 4. EVENT BANNER SECTION */}
      <div className="relative w-full aspect-[4/5] md:aspect-[21/9] bg-[#050505] overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 animate-pulse bg-white/5 flex items-center justify-center">
             <div className="w-8 h-8 border-2 border-[#ff0033] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : events.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`event-${currentBanner}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full"
            >
              {events[currentBanner % events.length]?.imageUrl ? (
                <>
                  <img
                    src={events[currentBanner % events.length]?.imageUrl}
                    alt={events[currentBanner % events.length]?.title || 'Event Poster'}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Subtle gradient overlay to ensure text/buttons are visible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a0000] to-black flex flex-col items-center justify-center p-8 text-center border-y border-[#ff0033]/20 shadow-[inset_0_0_100px_rgba(255,0,51,0.1)]">
                  <h2 className="text-5xl font-bebas text-white mb-2 tracking-widest drop-shadow-[0_0_10px_rgba(255,0,51,0.5)]">{events[currentBanner % events.length]?.title || 'NEW EVENT'}</h2>
                  <p className="text-gray-400 font-poppins text-xs mb-6 max-w-lg">{events[currentBanner % events.length]?.description}</p>
                </div>
              )}
              {events[currentBanner % events.length]?.link ? (
                <button onClick={() => router.push(events[currentBanner % events.length].link)} className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-3 rounded-full font-montserrat uppercase tracking-widest text-xs font-bold hover:bg-[#ff0033] hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,0,51,0.5)] z-20">
                  Explore Event
                </button>
              ) : events[currentBanner % events.length]?.imageUrl && (
                <div className="absolute bottom-10 left-0 right-0 text-center z-20 px-4">
                  <h3 className="text-3xl font-bebas text-white tracking-widest drop-shadow-md">{events[currentBanner % events.length]?.title}</h3>
                  <p className="text-gray-300 font-poppins text-sm max-w-lg mx-auto line-clamp-2 mt-1">{events[currentBanner % events.length]?.description}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : banners.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={`banner-${currentBanner}`}
              src={banners[currentBanner]?.imageUrl}
              alt={banners[currentBanner]?.title || 'Promotional Banner'}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0000] to-black flex flex-col items-center justify-center p-8 text-center border-y border-[#ff0033]/20 shadow-[inset_0_0_100px_rgba(255,0,51,0.1)]">
             <span className="text-[#ff0033] font-montserrat font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Redsee Exclusive</span>
             <h2 className="text-5xl font-bebas text-white mb-2 tracking-widest drop-shadow-[0_0_10px_rgba(255,0,51,0.5)]">STREETWEAR<br/>REDEFINED</h2>
             <p className="text-gray-400 font-poppins text-xs mb-6">Discover the new standard of luxury.</p>
             <button onClick={() => router.push('/shop')} className="bg-white text-black px-8 py-3 rounded-full font-montserrat uppercase tracking-widest text-xs font-bold hover:bg-[#ff0033] hover:text-white transition-colors">
               Explore
             </button>
          </div>
        )}
        
        {/* Banner Pagination */}
        {(events.length > 1 || banners.length > 1) && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-30">
            {(events.length > 0 ? events : banners).map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${currentBanner === idx ? 'w-6 bg-[#ff0033] shadow-[0_0_8px_#ff0033]' : 'w-1.5 bg-white/40'}`} 
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. NEWLY ADDED ITEMS SECTION (Horizontal Scroll) */}
      <div className="mt-8">
        <div className="px-4 flex justify-between items-end mb-4">
          <h2 className="text-2xl font-bebas text-white tracking-widest uppercase flex items-center">
            <span className="w-2 h-2 rounded-full bg-[#ff0033] shadow-[0_0_8px_#ff0033] mr-2 animate-pulse"></span>
            Newly Added
          </h2>
          <Link href="/shop" className="text-[10px] font-montserrat font-bold text-gray-500 uppercase tracking-widest flex items-center">
            View All <ChevronRight size={12} className="ml-0.5" />
          </Link>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar pl-4 pr-4 pb-6 space-x-4">
          {loading ? (
            // Skeleton loaders
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="w-[160px] md:w-[220px] flex-shrink-0 animate-pulse">
                <div className="aspect-[4/5] bg-white/5 rounded-2xl mb-3"></div>
                <div className="h-3 bg-white/5 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-white/5 rounded w-1/2"></div>
              </div>
            ))
          ) : newArrivals.length > 0 ? (
            newArrivals.map((product) => (
              <div key={product._id} className="w-[160px] md:w-[220px] flex-shrink-0 snap-start">
                <ProductCard 
                  id={product._id}
                  name={product.name}
                  price={product.pricing?.basePrice || 0}
                  image={product.images?.[0]?.url || ''}
                  hoverImage={product.images?.[1]?.url || product.images?.[0]?.url || ''}
                  category={product.category}
                  rating={5}
                  discount={product.pricing?.discount || 0}
                />
              </div>
            ))
          ) : (
             <div className="px-4 text-sm text-gray-500 font-poppins">No products found.</div>
          )}
        </div>
      </div>

      {/* 6. WOMEN'S STORE SECTION */}
      {activeTab === 'WOMEN' && (
        <section className="px-4 py-8 bg-[#0a0a0a] border-y border-white/5 mt-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#ff0033]/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="flex justify-between items-end mb-6 relative z-10">
            <div>
              <span className="text-[#ff0033] text-[10px] uppercase font-montserrat font-bold tracking-[0.2em] block mb-1">Curated</span>
              <h2 className="text-3xl font-bebas text-white tracking-widest uppercase">Women's Store</h2>
            </div>
            <Link href="/category/Women" className="text-[#ff0033] text-[10px] font-montserrat font-bold uppercase tracking-widest flex items-center">
              Explore <ChevronRight size={12} className="ml-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 relative z-10">
            {womensCollection.slice(0, 4).map((product) => (
              <ProductCard 
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.pricing?.basePrice || 0}
                  image={product.images?.[0]?.url || ''}
                  hoverImage={product.images?.[1]?.url || product.images?.[0]?.url || ''}
                  category={product.category}
                  rating={5}
                  discount={product.pricing?.discount || 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. ALTERNATING OFFER SECTIONS */}
      <section className="px-4 py-8 mt-4">
        <h2 className="text-2xl font-bebas text-white tracking-widest uppercase mb-6 text-center">Featured Drops</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Large Card */}
          <div className="relative aspect-square md:aspect-[21/9] group overflow-hidden rounded-3xl bg-zinc-900 border border-white/10 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <img 
              src="https://images.unsplash.com/photo-1550614000-4b95d466f911?q=80&w=1000&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
              <span className="bg-[#ff0033] text-white text-[9px] font-montserrat font-bold uppercase tracking-widest px-2 py-1 rounded w-max mb-3 shadow-[0_0_10px_#ff0033]">New Collection</span>
              <h3 className="text-4xl font-bebas text-white mb-1 tracking-widest">CYBERPUNK ERA</h3>
              <p className="text-gray-300 text-xs font-poppins mb-4 max-w-[80%]">Metallic finishes and oversized silhouettes for the modern distopia.</p>
            </div>
          </div>

          {/* Medium Split Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[4/5] group overflow-hidden rounded-3xl bg-zinc-900 border border-white/10 cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 p-4 z-10">
                <h3 className="text-2xl font-bebas text-white tracking-widest">ACCESSORIES</h3>
                <p className="text-[#ff0033] text-[10px] font-montserrat font-bold uppercase tracking-widest mt-1">Up to 40% Off</p>
              </div>
            </div>
            
            <div className="relative aspect-[4/5] group overflow-hidden rounded-3xl bg-zinc-900 border border-white/10 cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1608228079968-c7681eaef812?q=80&w=800&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 p-4 z-10">
                <h3 className="text-2xl font-bebas text-white tracking-widest">SNEAKERS</h3>
                <p className="text-[#ff0033] text-[10px] font-montserrat font-bold uppercase tracking-widest mt-1">Limited Stock</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MEN'S STORE SECTION */}
      {activeTab === 'MEN' && (
        <section className="px-4 py-8 bg-[#0a0a0a] border-y border-white/5 mt-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="flex justify-between items-end mb-6 relative z-10">
            <div>
              <span className="text-white/50 text-[10px] uppercase font-montserrat font-bold tracking-[0.2em] block mb-1">Essential</span>
              <h2 className="text-3xl font-bebas text-white tracking-widest uppercase">Men's Store</h2>
            </div>
            <Link href="/category/Men" className="text-white/50 hover:text-white transition-colors text-[10px] font-montserrat font-bold uppercase tracking-widest flex items-center">
              Explore <ChevronRight size={12} className="ml-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 relative z-10">
            {mensCollection.slice(0, 4).map((product) => (
              <ProductCard 
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.pricing?.basePrice || 0}
                  image={product.images?.[0]?.url || ''}
                  hoverImage={product.images?.[1]?.url || product.images?.[0]?.url || ''}
                  category={product.category}
                  rating={5}
                  discount={product.pricing?.discount || 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* Footer Buffer for BottomNav */}
      <div className="h-10"></div>
    </div>
  );
}
