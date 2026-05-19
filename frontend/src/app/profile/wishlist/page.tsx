'use client';

import { Heart } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';

export default function WishlistPage() {
  // In a real app, we would fetch wishlist items from the backend
  const hasItems = false; 

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bebas text-white tracking-widest uppercase mb-1">My Wishlist</h1>
      <p className="text-gray-400 font-poppins text-sm mb-8">Items you've saved for later.</p>

      {hasItems ? (
        <ProductGrid limit={4} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Heart size={32} className="text-gray-600" />
          </div>
          <h3 className="text-white font-montserrat font-bold text-lg mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 font-poppins text-sm max-w-sm">Save your favorite items here to easily find them later.</p>
          <button className="mt-6 border border-[#ff0033] text-[#ff0033] hover:bg-[#ff0033] hover:text-white px-8 py-3 rounded-lg font-montserrat font-bold text-sm tracking-widest uppercase transition-colors">
            Discover Fashion
          </button>
        </div>
      )}
    </div>
  );
}
