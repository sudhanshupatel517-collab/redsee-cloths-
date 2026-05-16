"use client";
import ProductGrid from "@/components/ProductGrid";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  return (
    <div className="pt-10 min-h-screen">
      <div className="container mx-auto px-6 mb-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bebas text-white tracking-wider mb-4 uppercase">
          {categoryName} COLLECTION
        </h1>
        <p className="text-gray-400 font-poppins max-w-2xl mx-auto">
          Discover the latest trends and styles in our {categoryName} collection. Elevate your aesthetic.
        </p>
      </div>
      
      {/* Reusing ProductGrid. In a real app we would filter by category */}
      <ProductGrid limit={8} />
    </div>
  );
}
