"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, Share2, ShoppingBag, Truck, ShieldAlert, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { fetchProductDetails, clearProductDetails } from "@/store/productSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const { productDetails: product, loading, error } = useSelector((state: RootState) => state.products);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    dispatch(fetchProductDetails(params.id));
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, params.id]);

  useEffect(() => {
    if (product) {
      if (product.images && product.images.length > 0) setActiveImage(product.images[0].url);
      if (product.variants && product.variants.length > 0) {
        setSelectedSize(product.variants[0].size);
        setSelectedColor(product.variants[0].color);
      }
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({
      product: product._id,
      title: product.name,
      image: product.images?.[0]?.url || '',
      price: product.pricing?.basePrice || 0,
      quantity,
      size: selectedSize,
      color: selectedColor
    }));
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-[#ff0033] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-background min-h-screen flex flex-col justify-center items-center text-white">
        <h2 className="text-2xl font-bebas tracking-widest uppercase mb-4">Product Not Found</h2>
        <button onClick={() => router.back()} className="text-[#ff0033] hover:underline font-poppins text-sm">Go Back</button>
      </div>
    );
  }

  const images = product.images?.map((img: any) => img.url) || [];
  const displayPrice = product.pricing?.basePrice || 0;
  const displayDiscount = product.pricing?.discount || 0;

  return (
    <div className="bg-background min-h-screen pb-24 md:pb-12">
      {/* Mobile Sticky Header */}
      <div className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 py-3">
        <button onClick={() => router.back()} className="text-foreground p-2 -ml-2 rounded-full active:bg-white/5 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-bebas tracking-widest text-lg truncate px-4">{product.name}</h2>
        <button 
          onClick={() => setIsWishlisted(!isWishlisted)} 
          className="text-foreground p-2 -mr-2 rounded-full active:bg-white/5 transition-colors"
        >
          <Heart size={22} className={isWishlisted ? "fill-[#ff0033] text-[#ff0033]" : ""} />
        </button>
      </div>

      <div className="container mx-auto px-0 md:px-6 md:py-12">
        {/* Desktop Breadcrumbs */}
        <div className="hidden md:block text-xs font-montserrat text-gray-500 uppercase tracking-widest mb-8">
          <Link href="/">Home</Link> / <Link href={`/category/${product.category.toLowerCase()}`}>{product.category}</Link> / <span className="text-white">{product.name}</span>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-0 md:gap-12">
          
          {/* Image Gallery */}
          <div className="relative w-full">
            {/* Mobile: Horizontal Swipeable Gallery */}
            <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-[60vh] bg-zinc-900">
              {images.map((img, i) => (
                <div key={i} className="min-w-full h-full snap-center relative">
                  <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Desktop: Grid/Main Gallery */}
            <div className="hidden md:block space-y-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-[4/5] bg-zinc-900 border border-white/5 relative overflow-hidden group rounded-2xl"
              >
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500" />
              </motion.div>
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square bg-zinc-900 rounded-xl border ${activeImage === img ? 'border-[#ff0033]' : 'border-white/5 hover:border-white/30'} transition-colors overflow-hidden`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col px-4 pt-6 md:px-0 md:pt-0">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl md:text-5xl font-bebas text-white tracking-wide leading-none">{product.name}</h1>
              <button className="hidden md:flex text-gray-400 hover:text-[#ff0033] transition-colors p-2 rounded-full hover:bg-white/5">
                <Share2 size={24} />
              </button>
            </div>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex text-[#ff0033]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? "fill-[#ff0033]" : "text-gray-600"} />
                ))}
              </div>
              <span className="text-xs font-poppins text-gray-400">124 Reviews</span>
            </div>

            <div className="flex items-end space-x-3 mb-6">
              <span className="text-3xl md:text-4xl font-poppins font-bold text-white leading-none">${displayPrice}</span>
              {displayDiscount > 0 && (
                <span className="text-lg md:text-xl text-gray-500 line-through mb-1">
                  ${(displayPrice / (1 - displayDiscount / 100)).toFixed(2)}
                </span>
              )}
              {displayDiscount > 0 && (
                <span className="bg-[#ff0033] text-white text-[10px] md:text-xs px-2 py-1 mb-1.5 font-bold uppercase tracking-wider rounded">
                  -{displayDiscount}%
                </span>
              )}
            </div>

            <p className="text-gray-400 font-poppins text-sm leading-relaxed mb-8">
              Experience next-level comfort and style with this premium piece from Redsee's latest collection. Engineered for the modern urban environment, featuring durable stitching and a relaxed silhouette.
            </p>

            {/* Color Selection */}
            <div className="mb-6">
              <div className="flex justify-between mb-3">
                <span className="text-xs font-montserrat uppercase font-bold tracking-widest text-gray-300">Color: <span className="text-white ml-1">{selectedColor}</span></span>
              </div>
              <div className="flex space-x-3">
                {Array.from(new Set(product.variants?.map((v: any) => v.color) || [])).map((color: any) => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${selectedColor === color ? 'border-white scale-110' : 'border-transparent hover:border-white/50'} flex items-center justify-center shadow-lg`}
                    style={{ backgroundColor: color === 'Black' ? '#0a0a0a' : color === 'Red' ? '#7A0000' : '#333333' }}
                  >
                    <span className="sr-only">{color}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <span className="text-xs font-montserrat uppercase font-bold tracking-widest text-gray-300">Size: <span className="text-white ml-1">{selectedSize}</span></span>
                <button className="text-xs font-montserrat text-gray-400 underline hover:text-white transition-colors">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2 md:grid md:grid-cols-5">
                {Array.from(new Set(product.variants?.map((v: any) => v.size) || [])).map((size: any) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 min-w-[60px] py-3 rounded-lg border transition-all ${
                      selectedSize === size 
                        ? 'border-[#ff0033] bg-[#ff0033]/10 text-white font-bold' 
                        : 'border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/5'
                    } font-poppins text-sm`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Actions (Hidden on Mobile) */}
            <div className="hidden md:flex space-x-4 mb-8">
              <div className="flex border border-white/20 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-white hover:bg-white/5 transition-colors">-</button>
                <input type="text" value={quantity} readOnly className="w-12 bg-transparent text-center font-poppins text-white outline-none" />
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 text-white hover:bg-white/5 transition-colors">+</button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 bg-[#ff0033] text-white hover:bg-[#cc0029] rounded-lg transition-colors flex items-center justify-center font-montserrat uppercase tracking-wider font-bold text-sm space-x-2">
                <ShoppingBag size={18} />
                <span>Add To Cart</span>
              </button>
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="px-4 border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors flex items-center justify-center"
              >
                <Heart size={20} className={isWishlisted ? "fill-[#ff0033] text-[#ff0033]" : ""} />
              </button>
            </div>

            {/* Meta Info */}
            <div className="border-t border-white/5 pt-6 space-y-4 mb-8">
              <div className="flex items-center space-x-3 text-sm text-gray-400 font-poppins bg-white/5 p-4 rounded-xl border border-white/5">
                <Truck size={20} className="text-[#ff0033]" />
                <span>Free express shipping on orders over $150</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400 font-poppins bg-white/5 p-4 rounded-xl border border-white/5">
                <ShieldAlert size={20} className="text-[#ff0033]" />
                <span>30-day premium return policy.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Add-to-Cart Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-white/10 p-3 pb-safe">
        <div className="flex space-x-3">
          <div className="flex border border-white/10 rounded-lg overflow-hidden bg-white/5">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 text-white active:bg-white/10 transition-colors">-</button>
            <input type="text" value={quantity} readOnly className="w-8 bg-transparent text-center font-poppins text-white text-sm outline-none" />
            <button onClick={() => setQuantity(quantity + 1)} className="px-3 text-white active:bg-white/10 transition-colors">+</button>
          </div>
          <button 
            onClick={handleAddToCart} 
            className="flex-1 bg-[#ff0033] text-white active:scale-[0.98] rounded-lg transition-transform flex items-center justify-center font-montserrat uppercase tracking-wider font-bold text-xs space-x-2 shadow-[0_0_15px_rgba(255,0,51,0.3)]"
          >
            <ShoppingBag size={16} />
            <span>Add To Cart - ${(product.price * quantity).toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
