'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, ArrowLeft, TrendingUp, X } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('redsee_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Save to recent searches
    const newRecents = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5);
    setRecentSearches(newRecents);
    localStorage.setItem('redsee_recent_searches', JSON.stringify(newRecents));

    // Navigate to shop with search param
    router.push(`/shop?q=${encodeURIComponent(query)}`);
  };

  const trendingSearches = [
    "Oversized Tees",
    "Puffer Jackets",
    "Cargo Pants",
    "Limited Edition Hoodies",
    "Sneakers"
  ];

  return (
    <div className="min-h-screen bg-background pt-safe pb-24">
      {/* Search Header */}
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-lg px-4 py-3 border-b border-white/10 flex items-center space-x-3">
        <button onClick={() => router.back()} className="text-foreground/70 hover:text-white p-2 -ml-2 rounded-full active:bg-white/5 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <form onSubmit={handleSearch} className="flex-1 relative">
          <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
          <input
            type="text"
            autoFocus
            placeholder="Search for luxury streetwear..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-[#ff0033] rounded-full pl-10 pr-10 py-2.5 text-foreground text-sm font-poppins outline-none transition-all"
          />
          {query && (
            <button 
              type="button" 
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </form>
      </div>

      <div className="px-4 mt-6">
        {/* Recent Searches */}
        {recentSearches.length > 0 && !query && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-montserrat uppercase tracking-widest text-foreground/50 font-bold">Recent Searches</h3>
              <button 
                onClick={() => {
                  setRecentSearches([]);
                  localStorage.removeItem('redsee_recent_searches');
                }}
                className="text-[10px] text-[#ff0033] font-montserrat uppercase tracking-widest font-bold"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setQuery(term);
                    router.push(`/shop?q=${encodeURIComponent(term)}`);
                  }}
                  className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-poppins text-foreground/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending Searches */}
        {!query && (
          <div>
            <h3 className="text-xs font-montserrat uppercase tracking-widest text-foreground/50 font-bold mb-4 flex items-center">
              <TrendingUp size={14} className="mr-2 text-[#ff0033]" />
              Trending Now
            </h3>
            <div className="space-y-1">
              {trendingSearches.map((term, i) => (
                <div 
                  key={i}
                  onClick={() => {
                    setQuery(term);
                    router.push(`/shop?q=${encodeURIComponent(term)}`);
                  }}
                  className="flex items-center space-x-3 py-3 px-2 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer group"
                >
                  <SearchIcon size={16} className="text-foreground/30 group-hover:text-[#ff0033] transition-colors" />
                  <span className="text-sm font-poppins text-foreground/80 group-hover:text-white transition-colors">{term}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
