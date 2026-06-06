"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProducts } from "@/store/productSlice";
import ProductGrid from "@/components/ProductGrid";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ category: categoryName }));
  }, [dispatch, categoryName]);

  return (
    <div className="pt-10 min-h-screen bg-black pb-20">
      <div className="container mx-auto px-6 mb-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bebas text-white tracking-wider mb-4 uppercase">
          {categoryName} COLLECTION
        </h1>
        <p className="text-gray-400 font-poppins max-w-2xl mx-auto">
          Discover the latest trends and styles in our {categoryName} collection. Elevate your aesthetic.
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
