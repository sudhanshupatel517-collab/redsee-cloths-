"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { LayoutGrid, ArrowRight, Loader2, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";

interface Category {
  _id: string;
  name: string;
  slug: string;
  section?: "Men" | "Women";
  parentCategory?: string | { _id: string; name: string } | null;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  navbarCategory: string;
  section: "Men" | "Women";
  pricing: {
    basePrice: number;
    finalPrice: number;
    discountPercentage: number;
  };
  images: any[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"Men" | "Women">("Men");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          api.get("/api/categories"),
          api.get("/api/products")
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error("Failed to load category data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#ff0033] animate-spin" />
        <p className="font-montserrat text-xs tracking-widest uppercase text-zinc-500">Loading Collections...</p>
      </div>
    );
  }

  // Get navbar categories for the active section
  const navbarCategories = categories.filter(
    (c) => !c.parentCategory && c.section === activeSection
  );

  return (
    <div className="min-h-screen bg-background pb-24 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bebas text-zinc-900 dark:text-white tracking-widest uppercase flex items-center justify-center gap-3">
            <LayoutGrid className="text-[#ff0033]" size={32} /> EXPLORE CATEGORIES
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-poppins text-xs md:text-sm mt-2 max-w-md mx-auto">
            Discover our curated streetwear subcategories and find the perfect aesthetic.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex justify-center space-x-4 mb-10">
          {(["Men", "Women"] as const).map((sec) => (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              className={`px-8 py-3 rounded-full font-montserrat text-xs tracking-widest uppercase font-bold transition-all border cursor-pointer ${
                activeSection === sec
                  ? "bg-[#ff0033] border-[#ff0033] text-white shadow-[0_0_15px_rgba(255,0,51,0.3)]"
                  : "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-gray-400 hover:border-zinc-400"
              }`}
            >
              {sec}'s Wear
            </button>
          ))}
        </div>

        {/* Collections */}
        <div className="space-y-12">
          {navbarCategories.length === 0 ? (
            <p className="text-center text-zinc-500 dark:text-gray-500 font-poppins text-sm py-10">
              No categories seeded yet in this section.
            </p>
          ) : (
            navbarCategories.map((navCat) => {
              // Find subcategories belonging to this navbar category
              const subcats = categories.filter((c) => {
                const parentId = typeof c.parentCategory === "object" && c.parentCategory !== null
                  ? c.parentCategory._id
                  : c.parentCategory;
                return parentId === navCat._id;
              });

              // Products in this entire navbar category (including subcategories)
              const navCatProducts = products.filter(
                (p) => p.section === activeSection && p.navbarCategory === navCat.name
              );

              return (
                <div key={navCat._id} className="bg-white dark:bg-[#0c0c0c] border border-zinc-200 dark:border-white/5 rounded-2xl p-6 md:p-8 shadow-sm">
                  {/* Category Title */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 dark:border-white/5 pb-4 mb-6 gap-4">
                    <div>
                      <h2 className="text-2xl font-bebas text-zinc-900 dark:text-white tracking-widest uppercase flex items-center gap-2">
                        <Sparkles size={18} className="text-[#ff0033]" /> {navCat.name}
                      </h2>
                      {subcats.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {subcats.map((sub) => (
                            <Link
                              key={sub._id}
                              href={`/category/${sub.slug}`}
                              className="text-[10px] font-montserrat font-semibold tracking-wider uppercase bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-gray-400 px-2.5 py-1 rounded hover:bg-[#ff0033]/10 hover:text-[#ff0033] transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/category/${navCat.slug}`}
                      className="inline-flex items-center space-x-2 text-xs font-montserrat font-bold tracking-widest uppercase text-[#ff0033] hover:text-red-600 transition-colors"
                    >
                      <span>Go to Shop</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Horizontal Scroll of Products */}
                  {navCatProducts.length === 0 ? (
                    <div className="text-center py-6 text-zinc-500 dark:text-zinc-500 font-poppins text-xs">
                      No products added in this category yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {navCatProducts.slice(0, 4).map((product) => {
                        const image = typeof product.images?.[0] === "string" 
                          ? product.images[0] 
                          : (product.images?.[0]?.url || "");
                        const hoverImage = typeof product.images?.[1] === "string"
                          ? product.images[1]
                          : (product.images?.[1]?.url || image);
                          
                        return (
                          <ProductCard
                            key={product._id}
                            id={product._id}
                            name={product.name}
                            price={product.pricing?.finalPrice || product.pricing?.basePrice || 0}
                            image={image}
                            hoverImage={hoverImage}
                            category={product.category}
                            discount={product.pricing?.discountPercentage || 0}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
