'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, ArrowLeft, TrendingUp, X, Mic, MicOff, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import ProductCard from '@/components/ProductCard';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [instantResults, setInstantResults] = useState<any[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if voice search is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setVoiceSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setQuery(transcript);
            triggerSearch(transcript);
          }
        };

        recognitionRef.current = recognition;
      }
    }

    // Load recent searches
    const saved = localStorage.getItem('redsee_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Fetch instant results when user types
  useEffect(() => {
    if (!query.trim()) {
      setInstantResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoadingResults(true);
        const { data } = await api.get(`/api/products?keyword=${encodeURIComponent(query)}`);
        setInstantResults(data);
      } catch (err) {
        console.error('Failed to fetch instant results:', err);
      } finally {
        setLoadingResults(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const triggerSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Save to recents
    const newRecents = [searchQuery, ...recentSearches.filter(q => q !== searchQuery)].slice(0, 5);
    setRecentSearches(newRecents);
    localStorage.setItem('redsee_recent_searches', JSON.stringify(newRecents));

    // Route to shop page with query
    router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(query);
  };

  const trendingSearches = [
    "Oversized Tees",
    "Puffer Jackets",
    "Cargo Pants",
    "Limited Edition Hoodies",
    "Sneakers"
  ];

  return (
    <div className="min-h-screen bg-background pt-safe pb-24 transition-colors duration-300">
      {/* Search Header */}
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-lg px-4 py-3 border-b border-zinc-200 dark:border-white/5 flex items-center space-x-3">
        <button onClick={() => router.back()} className="text-zinc-500 dark:text-gray-400 hover:text-foreground p-2 -ml-2 rounded-full active:bg-zinc-100 dark:active:bg-white/5 transition-colors">
          <ArrowLeft size={22} />
        </button>

        <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center">
          <SearchIcon size={16} className="absolute left-4.5 text-zinc-500" />
          <input
            type="text"
            autoFocus
            placeholder="Search Hoodies, Tees, Jackets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-full pl-11 pr-20 py-2.5 text-foreground text-sm font-poppins outline-none transition-all"
          />
          <div className="absolute right-3 flex items-center space-x-2.5">
            {query && (
              <button 
                type="button" 
                onClick={() => setQuery('')}
                className="text-zinc-550 dark:text-gray-500 hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
            {voiceSupported && (
              <button
                type="button"
                onClick={toggleVoiceSearch}
                className={`p-1.5 rounded-full transition-all ${
                  isListening ? 'bg-[#ff0033] text-white animate-pulse' : 'text-zinc-550 dark:text-gray-500 hover:text-foreground'
                }`}
                title="Voice search"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="px-4 mt-6 max-w-4xl mx-auto">
        {/* Voice Listening Overlay */}
        {isListening && (
          <div className="mb-6 bg-[#ff0033]/5 border border-[#ff0033]/25 rounded-xl p-4 flex flex-col items-center justify-center animate-pulse">
            <Mic size={32} className="text-[#ff0033] mb-2 animate-bounce" />
            <p className="text-foreground font-montserrat font-medium text-xs tracking-wider uppercase">Listening...</p>
            <p className="text-zinc-500 dark:text-gray-400 text-xs font-poppins mt-1">Speak now to search REDSEE collection</p>
          </div>
        )}

        {/* Live suggestions / Instant results shelf */}
        {query.trim() && (
          <div>
            <h3 className="text-xs font-montserrat uppercase tracking-widest text-zinc-500 dark:text-gray-400 font-bold mb-4">
              Instant Results
            </h3>

            {loadingResults ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-zinc-100 dark:bg-white/5 rounded-xl mb-2"></div>
                    <div className="h-3 bg-zinc-100 dark:bg-white/5 rounded w-3/4 mb-1.5"></div>
                    <div className="h-3 bg-zinc-100 dark:bg-white/5 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : instantResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {instantResults.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={product.pricing?.finalPrice || product.pricing?.basePrice || product.price || 0}
                    image={typeof product.images?.[0] === 'string' ? product.images[0] : (product.images?.[0]?.url || '')}
                    hoverImage={typeof product.images?.[1] === 'string' ? product.images[1] : (product.images?.[1]?.url || (typeof product.images?.[0] === 'string' ? product.images[0] : (product.images?.[0]?.url || '')))}
                    category={product.category}
                    rating={5}
                    discount={product.pricing?.discountPercentage || product.pricing?.discount || 0}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-zinc-500 dark:text-gray-500 font-poppins text-sm">No products matched "{query}"</p>
              </div>
            )}
          </div>
        )}

        {/* Default content: recent and trending searches */}
        {!query.trim() && (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-montserrat uppercase tracking-widest text-gray-500 font-bold">Recent Searches</h3>
                  <button 
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem('redsee_recent_searches');
                    }}
                    className="text-[10px] text-[#ff0033] font-montserrat uppercase tracking-widest font-bold"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        setQuery(term);
                        triggerSearch(term);
                      }}
                      className="px-4 py-2 rounded-full border border-white/5 bg-white/5 text-xs font-poppins text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div>
              <h3 className="text-xs font-montserrat uppercase tracking-widest text-gray-500 font-bold mb-4 flex items-center">
                <TrendingUp size={14} className="mr-2 text-[#ff0033]" />
                Trending Now
              </h3>
              <div className="space-y-1">
                {trendingSearches.map((term, i) => (
                  <div 
                    key={i}
                    onClick={() => {
                      setQuery(term);
                      triggerSearch(term);
                    }}
                    className="flex items-center space-x-3 py-3 px-2 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer group"
                  >
                    <SearchIcon size={15} className="text-gray-600 group-hover:text-[#ff0033] transition-colors" />
                    <span className="text-sm font-poppins text-gray-300 group-hover:text-white transition-colors">{term}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
