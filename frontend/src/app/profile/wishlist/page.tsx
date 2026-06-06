'use client';

import { Heart } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Link from 'next/link';

export default function WishlistPage() {
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const hasItems = wishlistItems && wishlistItems.length > 0;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bebas text-black dark:text-white tracking-widest uppercase mb-1">My Wishlist</h1>
      <p className="text-zinc-500 dark:text-gray-400 font-poppins text-sm mb-8">Items you've saved for later.</p>

      {hasItems ? (
        <ProductGrid products={wishlistItems} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Heart size={32} className="text-zinc-400 dark:text-gray-600" />
          </div>
          <h3 className="text-black dark:text-white font-montserrat font-bold text-lg mb-2">Your wishlist is empty</h3>
          <p className="text-zinc-500 dark:text-gray-500 font-poppins text-sm max-w-sm">Save your favorite items here to easily find them later.</p>
          <Link href="/shop" className="mt-6 border border-[#ff0033] text-[#ff0033] hover:bg-[#ff0033] hover:text-white px-8 py-3 rounded-lg font-montserrat font-bold text-sm tracking-widest uppercase transition-colors inline-block text-center">
            Discover Fashion
          </Link>
        </div>
      )}
    </div>
  );
}
