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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col bg-[#0A0A0A] border border-white/5 hover:border-white/20 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
        {discount && (
          <span className="bg-[#ff0033] text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
            -{discount}%
          </span>
        )}
        <span className="bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 uppercase tracking-wider">
          New
        </span>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <button className="bg-white text-black p-2 rounded-full hover:bg-[#ff0033] hover:text-white transition-colors shadow-lg">
          <Heart size={18} />
        </button>
        <button className="bg-white text-black p-2 rounded-full hover:bg-[#ff0033] hover:text-white transition-colors shadow-lg">
          <Eye size={18} />
        </button>
      </div>

      {/* Image Container */}
      <Link href={`/product/${id}`} className="relative h-96 w-full overflow-hidden bg-zinc-900 block">
        <img 
          src={isHovered ? hoverImage : image} 
          alt={name}
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500"
        />
      </Link>

      {/* Details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 uppercase tracking-widest font-montserrat mb-2">
          {category}
        </div>
        <Link href={`/product/${id}`}>
          <h3 className="text-lg font-bebas tracking-wide text-white mb-2 hover:text-[#ff0033] transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>
        <div className="flex items-center space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={i < Math.floor(rating) ? "text-[#ff0033] fill-[#ff0033]" : "text-gray-600"} />
          ))}
          <span className="text-xs text-gray-500 ml-2">({rating})</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold font-poppins">${price}</span>
            {discount && (
              <span className="text-sm text-gray-500 line-through font-poppins">
                ${(price / (1 - discount / 100)).toFixed(2)}
              </span>
            )}
          </div>
          <button className="text-white hover:text-[#ff0033] transition-colors p-2">
            <ShoppingBag size={22} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
