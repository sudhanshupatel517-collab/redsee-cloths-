"use client";
import ProductGrid from "@/components/ProductGrid";

export default function WishlistPage() {
  return (
    <div className="pt-10 min-h-screen">
      <div className="container mx-auto px-6 mb-10">
        <h1 className="text-4xl md:text-5xl font-bebas text-white tracking-wider mb-2">
          MY WISHLIST
        </h1>
        <p className="text-gray-400 font-poppins mb-10">
          Your saved items to purchase later.
        </p>
        
        {/* Reusing ProductGrid. In a real app we would only show favorited items */}
        <ProductGrid limit={4} />
      </div>
    </div>
  );
}
