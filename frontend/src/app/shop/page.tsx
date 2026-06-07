"use client";
import { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProducts } from "@/store/productSlice";
import ProductGrid from "@/components/ProductGrid";
import { useSearchParams } from "next/navigation";

function ShopContent() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products, loading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ keyword: query }));
  }, [dispatch, query]);

  return (
    <div className="pt-10 min-h-screen bg-background pb-20 transition-colors duration-300">
      <div className="container mx-auto px-6 mb-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bebas text-zinc-900 dark:text-white tracking-wider mb-4">
          {query ? `RESULTS FOR "${query.toUpperCase()}"` : "ALL COLLECTION"}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 font-poppins max-w-2xl mx-auto">
          {query ? "Explore our collection matching your search." : "Explore our complete collection of premium dropshipping streetwear and luxury aesthetics."}
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-2 border-[#ff0033] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ShopContent />
    </Suspense>
  );
}
