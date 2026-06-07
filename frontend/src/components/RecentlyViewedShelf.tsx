'use client';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function RecentlyViewedShelf() {
  const { items, loading } = useSelector((state: RootState) => state.recentlyViewed);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  // If there are no items and we aren't loading, don't show the shelf at all
  if (!loading && items.length === 0) return null;

  const handleScroll = () => {
    if (containerRef.current) {
      setShowLeftArrow(containerRef.current.scrollLeft > 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth } = containerRef.current;
      const scrollAmount = clientWidth * 0.75;
      containerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="px-4 py-10 md:px-8 border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#090909] relative overflow-hidden group transition-colors duration-300">
      {/* Subtle background ambiance glow */}
      <div className="absolute top-0 left-1/4 w-[250px] h-[250px] bg-[#ff0033]/2 rounded-full blur-[110px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        
        {/* Shelf Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.2em] text-[#ff0033] block mb-1 flex items-center gap-1.5">
              <Sparkles size={11} className="animate-pulse text-[#ff0033]" /> — Pick up where you left off
            </span>
            <h2 className="text-2xl md:text-3xl font-bebas text-black dark:text-white tracking-widest uppercase">
              Continue Shopping
            </h2>
          </div>
        </div>

        {/* Navigation Arrows */}
        {items.length > 2 && (
          <>
            {showLeftArrow && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-9 h-9 rounded-full bg-white dark:bg-black/80 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-800 dark:text-white hover:bg-[#ff0033] hover:border-[#ff0033] hover:text-white transition-all z-20 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-9 h-9 rounded-full bg-white dark:bg-black/80 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-800 dark:text-white hover:bg-[#ff0033] hover:border-[#ff0033] hover:text-white transition-all z-20 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Swipeable Snap Row */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto no-scrollbar pb-3 gap-4 snap-x snap-mandatory scroll-smooth"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[170px] md:w-[220px] flex-shrink-0">
                <div className="aspect-[3/4] bg-white/5 rounded-xl mb-3 skeleton" />
                <div className="h-4 bg-white/5 rounded w-3/4 mb-2 skeleton" />
                <div className="h-4 bg-white/5 rounded w-1/2 skeleton" />
              </div>
            ))
          ) : (
            items.map((product: any) => {
              const image = typeof product.images?.[0] === 'string' ? product.images[0] : (product.images?.[0]?.url || '');
              const hoverImage = typeof product.images?.[1] === 'string' ? product.images[1] : (product.images?.[1]?.url || image);
              const finalPrice = product.pricing?.finalPrice || product.pricing?.basePrice || 0;
              const discount = product.pricing?.discountPercentage || product.pricing?.discount || 0;

              return (
                <div key={product._id} className="w-[170px] md:w-[220px] flex-shrink-0 snap-start">
                  <ProductCard
                    id={product._id}
                    name={product.name}
                    price={finalPrice}
                    image={image}
                    hoverImage={hoverImage}
                    category={product.category}
                    rating={product.rating || 5}
                    discount={discount}
                  />
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}
