"use client";
import { useState } from "react";
import { mockProducts } from "@/lib/data";
import { motion } from "framer-motion";
import { Star, Heart, Share2, ShoppingBag, Truck, ShieldAlert } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const product = mockProducts.find(p => p.id === params.id) || mockProducts[0];
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);
  
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product.id,
      title: product.name,
      image: product.image,
      price: product.price,
      quantity,
      size: selectedSize,
      color: selectedColor
    }));
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Breadcrumbs */}
      <div className="text-xs font-montserrat text-gray-500 uppercase tracking-widest mb-8">
        Home / {product.category} / <span className="text-white">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-[4/5] bg-zinc-900 border border-white/5 relative overflow-hidden group"
          >
            <img src={activeImage} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {[product.image, product.hoverImage, product.image, product.hoverImage].map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(img)}
                className={`aspect-square bg-zinc-900 border ${activeImage === img ? 'border-[#ff0033]' : 'border-white/5 hover:border-white/30'} transition-colors overflow-hidden`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-4xl md:text-5xl font-bebas text-white tracking-wide">{product.name}</h1>
            <button className="text-gray-400 hover:text-[#ff0033] transition-colors">
              <Share2 size={24} />
            </button>
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex text-[#ff0033]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-600"} />
              ))}
            </div>
            <span className="text-sm font-poppins text-gray-400">124 Reviews</span>
          </div>

          <div className="text-3xl font-poppins font-bold text-white mb-8 flex items-end space-x-4">
            <span>${product.price}</span>
            {product.discount && (
              <span className="text-xl text-gray-500 line-through mb-1">
                ${(product.price / (1 - product.discount / 100)).toFixed(2)}
              </span>
            )}
            {product.discount && (
              <span className="text-sm bg-[#ff0033] text-white px-2 py-1 mb-2 font-bold uppercase tracking-wider">
                Sale
              </span>
            )}
          </div>

          <p className="text-gray-400 font-poppins text-sm leading-relaxed mb-8">
            Experience next-level comfort and style with this premium piece from Redsee's latest collection. Engineered for the modern urban environment, featuring durable stitching and a relaxed silhouette.
          </p>

          {/* Color Selection */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-montserrat uppercase text-gray-300">Color</span>
              <span className="text-sm font-poppins text-white">{selectedColor}</span>
            </div>
            <div className="flex space-x-3">
              {['Black', 'Red', 'Charcoal'].map(color => (
                <button 
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'border-white' : 'border-transparent'} flex items-center justify-center`}
                  style={{ backgroundColor: color === 'Black' ? '#0a0a0a' : color === 'Red' ? '#7A0000' : '#333333' }}
                >
                  <span className="sr-only">{color}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-montserrat uppercase text-gray-300">Size</span>
              <button className="text-sm font-montserrat text-gray-400 underline hover:text-white transition-colors">Size Guide</button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 border ${selectedSize === size ? 'border-[#ff0033] bg-[#ff0033] text-white' : 'border-white/20 text-gray-300 hover:border-white'} font-poppins text-sm transition-all`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="flex space-x-4 mb-8">
            <div className="flex border border-white/20">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-white hover:bg-white/5 transition-colors">-</button>
              <input type="text" value={quantity} readOnly className="w-12 bg-transparent text-center font-poppins text-white" />
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 text-white hover:bg-white/5 transition-colors">+</button>
            </div>
            <button onClick={handleAddToCart} className="flex-1 bg-[#ff0033] text-white hover:bg-[#cc0029] transition-colors flex items-center justify-center font-montserrat uppercase tracking-wider font-bold text-sm space-x-2">
              <ShoppingBag size={18} />
              <span>Add To Cart</span>
            </button>
            <button className="px-4 border border-white/20 text-white hover:bg-white/5 transition-colors flex items-center justify-center">
              <Heart size={20} />
            </button>
          </div>

          {/* Meta Info */}
          <div className="border-t border-white/10 pt-6 space-y-4">
            <div className="flex items-center space-x-3 text-sm text-gray-400 font-poppins">
              <Truck size={18} className="text-[#ff0033]" />
              <span>Free worldwide shipping on orders over $150</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-400 font-poppins">
              <ShieldAlert size={18} className="text-[#ff0033]" />
              <span>30-day return policy. Shop with confidence.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
