"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { useState } from "react";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  image: string;
  hoverImage: string;
  category: string;
  rating: number;
  discount?: number;
}

const ProductCard = ({ id, name, price, image, hoverImage, category, rating, discount }: ProductProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col bg-background border border-white/5 hover:border-white/10 transition-all duration-300 rounded-xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col space-y-1.5">
        {discount && (
          <span className="bg-[#ff0033] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
            -{discount}%
          </span>
        )}
      </div>

      {/* Quick Wishlist (Always visible for mobile) */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          setIsWishlisted(!isWishlisted);
        }}
        className="absolute top-3 right-3 z-20 bg-background/50 backdrop-blur-md p-2 rounded-full border border-white/10 text-foreground/70 hover:text-[#ff0033] active:scale-90 transition-all shadow-sm"
      >
        <Heart size={16} className={isWishlisted ? "fill-[#ff0033] text-[#ff0033]" : ""} />
      </button>

      {/* Image Container */}
      <Link href={`/product/${id}`} className="relative h-56 md:h-80 w-full overflow-hidden bg-zinc-900 block">
        <img 
          src={isHovered ? hoverImage : image} 
          alt={name}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
      </Link>

      {/* Details */}
      <div className="p-3 md:p-4 flex flex-col flex-grow bg-[#0A0A0A]">
        <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-montserrat mb-1">
          {category}
        </div>
        <Link href={`/product/${id}`}>
          <h3 className="text-sm md:text-lg font-bebas tracking-wide text-white mb-1 md:mb-2 hover:text-[#ff0033] transition-colors line-clamp-1 leading-tight">
            {name}
          </h3>
        </Link>
        
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex flex-col">
            {discount && (
              <span className="text-[10px] text-gray-500 line-through font-poppins mb-0.5">
                ${(price / (1 - discount / 100)).toFixed(2)}
              </span>
            )}
            <span className="text-sm md:text-lg font-bold font-poppins text-white leading-none">${price}</span>
          </div>
          <Link href={`/product/${id}`} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#ff0033] hover:border-[#ff0033] transition-colors active:scale-95">
            <ShoppingBag size={14} className="md:w-[18px] md:h-[18px]" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
