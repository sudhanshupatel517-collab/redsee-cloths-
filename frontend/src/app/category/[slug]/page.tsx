"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProducts } from "@/store/productSlice";
import ProductGrid from "@/components/ProductGrid";
import api from "@/lib/axios";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug;
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector((state: RootState) => state.products);

  const [categoryName, setCategoryName] = useState(
    slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
  );

  useEffect(() => {
    const resolveCategory = async () => {
      try {
        const { data } = await api.get('/api/categories');
        const matched = data.find((c: any) => c.slug === slug);
        if (matched) {
          setCategoryName(matched.name);
          dispatch(fetchProducts({ category: matched.name }));
        } else {
          const fallbackName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
          setCategoryName(fallbackName);
          dispatch(fetchProducts({ category: fallbackName }));
        }
      } catch (err) {
        console.error("Failed to resolve category name from DB:", err);
        const fallbackName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
        setCategoryName(fallbackName);
        dispatch(fetchProducts({ category: fallbackName }));
      }
    };
    resolveCategory();
  }, [dispatch, slug]);

  return (
    <div className="pt-10 min-h-screen bg-background pb-20 transition-colors duration-300">
      <div className="container mx-auto px-6 mb-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bebas text-zinc-900 dark:text-white tracking-wider mb-4 uppercase">
          {categoryName} COLLECTION
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 font-poppins max-w-2xl mx-auto">
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
