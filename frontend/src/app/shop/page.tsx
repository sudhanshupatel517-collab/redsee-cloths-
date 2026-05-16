"use client";
import ProductGrid from "@/components/ProductGrid";

export default function ShopPage() {
  return (
    <div className="pt-10 min-h-screen">
      <div className="container mx-auto px-6 mb-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bebas text-white tracking-wider mb-4">
          ALL COLLECTION
        </h1>
        <p className="text-gray-400 font-poppins max-w-2xl mx-auto">
          Explore our complete collection of premium dropshipping streetwear and luxury aesthetics.
        </p>
      </div>
      
      {/* Reusing ProductGrid for the shop page but showing all items */}
      <ProductGrid limit={20} />
    </div>
  );
}
