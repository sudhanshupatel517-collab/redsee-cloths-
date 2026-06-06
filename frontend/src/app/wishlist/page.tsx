"use client";
import ProductGrid from "@/components/ProductGrid";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  return (
    <div className="pt-10 min-h-screen">
      <div className="container mx-auto px-6 mb-10">
        <h1 className="text-4xl md:text-5xl font-bebas text-white tracking-wider mb-2">
          MY WISHLIST
        </h1>
        <p className="text-gray-400 font-poppins mb-10">
          Your saved items to purchase later.
        </p>
        
        {wishlistItems && wishlistItems.length > 0 ? (
          <ProductGrid products={wishlistItems} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 bg-white/[0.01] rounded-3xl p-8 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Heart size={32} className="text-gray-600" />
            </div>
            <h3 className="text-white font-montserrat font-bold text-lg mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 font-poppins text-sm max-w-sm">Save your favorite items here to easily find them later.</p>
            <Link href="/shop" className="mt-6 border border-[#ff0033] text-[#ff0033] hover:bg-[#ff0033] hover:text-white px-8 py-3 rounded-lg font-montserrat font-bold text-sm tracking-widest uppercase transition-colors">
              Discover Fashion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
