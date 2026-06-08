'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import api from '@/lib/axios';
import ProductGrid from '@/components/ProductGrid';
import { optimizeImageUrl } from '@/lib/image';

interface Banner {
  _id: string;
  imageUrl: string;
  title: string;
  description: string;
  isActive: boolean;
}

export default function OfferPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter();

  const [banner, setBanner] = useState<Banner | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOfferData = async () => {
      try {
        setLoading(true);
        setError(false);

        // Fetch banner/offer details
        const bannerRes = await api.get(`/api/banners/${id}`);
        setBanner(bannerRes.data);

        // Fetch products matching this bannerId
        const productsRes = await api.get(`/api/products?banner=${id}`);
        setProducts(productsRes.data);

      } catch (err) {
        console.error('Failed to fetch offer data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#080808] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff0033]" />
      </div>
    );
  }

  if (error || !banner) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#080808] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-bebas text-zinc-900 dark:text-white tracking-widest mb-4">OFFER NOT FOUND</h2>
        <p className="text-zinc-500 dark:text-zinc-400 font-poppins text-sm mb-6 max-w-sm">
          The requested exclusive drop or promotional offer could not be loaded or has expired.
        </p>
        <Link 
          href="/" 
          className="flex items-center space-x-2 bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-3 rounded-lg font-montserrat font-bold tracking-widest uppercase text-xs transition-all shadow-[0_0_15px_rgba(255,0,51,0.3)]"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#080808] pb-20 transition-colors duration-300">
      
      {/* Top Navbar */}
      <nav className="border-b border-zinc-200 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="flex items-center space-x-2 text-zinc-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span className="text-xs font-montserrat uppercase tracking-wider font-bold">Back</span>
          </button>
          
          <Link href="/">
            <h1 className="text-xl font-bebas tracking-[0.25em] text-[#ff0033] text-glow">REDSEE</h1>
          </Link>
          
          <div className="w-10" /> {/* Spacer */}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-zinc-200 dark:border-white/5 bg-zinc-950 text-white min-h-[30vh] flex items-center py-12 px-4 md:px-8">
        {/* Background image backdrop */}
        <div className="absolute inset-0 z-0">
          <img 
            src={optimizeImageUrl(banner.imageUrl, 1200)} 
            alt={banner.title} 
            className="w-full h-full object-cover opacity-30 blur-sm scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto w-full z-10 relative">
          <span className="inline-block bg-[#ff0033] text-white text-[8px] md:text-[9px] font-montserrat font-bold uppercase tracking-widest px-2.5 py-0.5 rounded shadow-[0_0_10px_rgba(255,0,51,0.5)] mb-4">
            Exclusive Drop
          </span>
          <h2 className="text-4xl md:text-6xl font-bebas text-white tracking-wider mb-3 uppercase leading-tight text-glow">
            {banner.title}
          </h2>
          {banner.description && (
            <p className="text-gray-300 font-poppins text-xs md:text-sm max-w-2xl leading-relaxed">
              {banner.description}
            </p>
          )}
        </div>
      </div>

      {/* Products list or Empty state */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        {products.length === 0 ? (
          <div className="text-center py-20 px-6 max-w-md mx-auto bg-white/5 border border-zinc-200/50 dark:border-white/5 rounded-2xl backdrop-blur-sm shadow-xl">
            <div className="w-16 h-16 mx-auto bg-[#ff0033]/10 border border-[#ff0033]/20 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="text-[#ff0033]" size={30} />
            </div>
            <h2 className="text-3xl font-bebas text-zinc-900 dark:text-white tracking-widest mb-2">STAY TUNED!</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-poppins text-xs leading-relaxed mb-4">
              We will be back shortly.
            </p>
            <p className="text-zinc-400 dark:text-zinc-500 font-poppins text-[10px] leading-relaxed">
              No products have been added to this offer yet.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-xs font-montserrat font-bold uppercase tracking-widest text-zinc-400">
                Offer Products ({products.length})
              </h3>
            </div>
            <ProductGrid products={products} />
          </div>
        )}
      </div>

    </div>
  );
}
