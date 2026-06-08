"use client";
import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, Share2, ShoppingBag, Truck, ShieldAlert, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { fetchProductDetails, clearProductDetails } from "@/store/productSlice";
import { AppDispatch, RootState } from "@/store/store";
import { addRecentlyViewedLocal, addRecentlyViewedBackend } from "@/store/recentlyViewedSlice";
import { toggleWishlistLocal, toggleWishlistBackend } from "@/store/wishlistSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { optimizeImageUrl } from "@/lib/image";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const { productDetails: product, loading, error } = useSelector((state: RootState) => state.products);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isWishlisted = product ? wishlistItems.some((item: any) => item._id === product._id) : false;

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  // Track product view on load
  useEffect(() => {
    if (product) {
      if (isAuthenticated) {
        dispatch(addRecentlyViewedBackend(product._id) as any);
      } else {
        dispatch(addRecentlyViewedLocal(product));
      }
    }
  }, [product, dispatch, isAuthenticated]);

  const handleWishlistToggle = () => {
    if (!product) return;
    dispatch(toggleWishlistLocal(product));
    if (isAuthenticated) {
      dispatch(toggleWishlistBackend(product._id) as any);
    }
  };

  useEffect(() => {
    if (product) {
      if (product.images && product.images.length > 0) {
        const firstImg = product.images[0];
        setActiveImage(typeof firstImg === 'string' ? firstImg : (firstImg?.url || ''));
      }
      if (product.variants && product.variants.length > 0) {
        setSelectedSize(product.variants[0].size);
        setSelectedColor(product.variants[0].color);
      }
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    const firstImg = product.images?.[0];
    const itemImage = typeof firstImg === 'string' ? firstImg : (firstImg?.url || '');
    const itemPrice = product.pricing?.finalPrice || product.pricing?.basePrice || product.price || 0;

    dispatch(addToCart({
      product: product._id,
      title: product.name,
      image: itemImage,
      price: itemPrice,
      quantity,
      size: selectedSize,
      color: selectedColor
    }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
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
      <div className="bg-background min-h-screen flex flex-col justify-center items-center text-zinc-900 dark:text-white">
        <h2 className="text-2xl font-bebas tracking-widest uppercase mb-4">Product Not Found</h2>
        <button onClick={() => router.back()} className="text-[#ff0033] hover:underline font-poppins text-sm">Go Back</button>
      </div>
    );
  }

  const images = product.images?.map((img: any) => typeof img === 'string' ? img : (img?.url || '')) || [];
  const displayPrice = product.pricing?.finalPrice || product.pricing?.basePrice || product.price || 0;
  const originalPrice = product.pricing?.originalPrice || 0;
  const displayDiscount = product.pricing?.discountPercentage || product.pricing?.discount || 0;

  return (
    <div className="bg-background min-h-screen pb-24 md:pb-12">
      {/* Mobile Sticky Header */}
      <div className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/5 flex items-center justify-between px-4 py-3">
        <button onClick={() => router.back()} className="text-foreground p-2 -ml-2 rounded-full active:bg-zinc-100 dark:active:bg-white/5 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-bebas tracking-widest text-lg truncate px-4">{product.name}</h2>
        <button 
          onClick={handleWishlistToggle} 
          className="text-foreground p-2 -mr-2 rounded-full active:bg-zinc-100 dark:active:bg-white/5 transition-colors"
        >
          <Heart size={22} className={isWishlisted ? "fill-[#ff0033] text-[#ff0033]" : ""} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 md:py-12">
        {/* Desktop Breadcrumbs */}
        <div className="hidden md:block text-xs font-montserrat text-gray-500 uppercase tracking-widest mb-8">
          <Link href="/">Home</Link> / <Link href={`/category/${product.category.toLowerCase()}`}>{product.category}</Link> / <span className="text-black dark:text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Image Gallery */}
          <div className="md:col-span-5 relative w-full">
            {/* Mobile: Horizontal Swipeable Gallery */}
            <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-[60vh] bg-zinc-100 dark:bg-zinc-900">
              {images.map((img: string, i: number) => (
                <div key={i} className="min-w-full h-full snap-center relative">
                  <img src={optimizeImageUrl(img, 800)} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Desktop: Grid/Main Gallery */}
            <div className="hidden md:block space-y-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 relative overflow-hidden group rounded-2xl"
              >
                <img src={optimizeImageUrl(activeImage, 1000)} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500" />
              </motion.div>
              <div className="grid grid-cols-4 gap-4">
                {images.map((img: string, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-xl border ${activeImage === img ? 'border-[#ff0033]' : 'border-zinc-200 dark:border-white/5 hover:border-[#ff0033]/50 dark:hover:border-white/30'} transition-colors overflow-hidden`}
                  >
                    <img src={optimizeImageUrl(img, 200)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="md:col-span-7 flex flex-col px-4 pt-6 md:px-0 md:pt-0">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl md:text-5xl font-bebas text-black dark:text-white tracking-wide leading-none">{product.name}</h1>
              <button className="hidden md:flex text-zinc-500 dark:text-gray-400 hover:text-[#ff0033] transition-colors p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/5">
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
              <span className="text-3xl md:text-4xl font-poppins font-bold text-black dark:text-white leading-none">₹{displayPrice}</span>
              {displayDiscount > 0 && originalPrice > 0 && (
                <span className="text-lg md:text-xl text-zinc-400 dark:text-gray-500 line-through mb-1">
                  ₹{originalPrice}
                </span>
              )}
              {displayDiscount > 0 && (
                <span className="bg-[#ff0033] text-white text-[10px] md:text-xs px-2 py-1 mb-1.5 font-bold uppercase tracking-wider rounded">
                  -{displayDiscount}% OFF
                </span>
              )}
            </div>

            <p className="text-gray-400 font-poppins text-sm leading-relaxed mb-8">
              Experience next-level comfort and style with this premium piece from Redsee's latest collection. Engineered for the modern urban environment, featuring durable stitching and a relaxed silhouette.
            </p>

            {/* Color Selection */}
            <div className="mb-6">
              <div className="flex justify-between mb-3">
                <span className="text-xs font-montserrat uppercase font-bold tracking-widest text-zinc-500 dark:text-gray-300">Color: <span className="text-black dark:text-white ml-1">{selectedColor}</span></span>
              </div>
              <div className="flex space-x-3">
                {Array.from(new Set(product.variants?.map((v: any) => v.color) || [])).map((color: any) => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${selectedColor === color ? 'border-zinc-800 dark:border-white scale-110' : 'border-transparent hover:border-zinc-300 dark:hover:border-white/50'} flex items-center justify-center shadow-lg`}
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
                <span className="text-xs font-montserrat uppercase font-bold tracking-widest text-zinc-500 dark:text-gray-300">Size: <span className="text-black dark:text-white ml-1">{selectedSize}</span></span>
                <button className="text-xs font-montserrat text-zinc-500 dark:text-gray-400 underline hover:text-black dark:hover:text-white transition-colors">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2 md:grid md:grid-cols-5">
                {Array.from(new Set(product.variants?.map((v: any) => v.size) || [])).map((size: any) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 min-w-[60px] py-3 rounded-lg border transition-all ${
                      selectedSize === size 
                        ? 'border-[#ff0033] bg-[#ff0033]/10 text-[#ff0033] font-bold' 
                        : 'border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-gray-300 hover:border-zinc-400 dark:hover:border-white/30 hover:bg-zinc-50 dark:hover:bg-white/5'
                    } font-poppins text-sm`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions (Visible on both Mobile and Desktop) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center justify-between border border-zinc-300 dark:border-white/20 rounded-lg overflow-hidden h-12 flex-shrink-0">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 h-full text-zinc-700 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5 active:bg-zinc-200 transition-colors">-</button>
                <input type="text" value={quantity} readOnly className="w-12 bg-transparent text-center font-poppins text-black dark:text-white outline-none text-sm font-bold" />
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 h-full text-zinc-700 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5 active:bg-zinc-200 transition-colors">+</button>
              </div>
              
              <div className="flex flex-1 gap-3">
                <button onClick={handleAddToCart} className="flex-1 h-12 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-white/10 active:scale-[0.98] rounded-lg transition-all flex items-center justify-center font-montserrat uppercase tracking-wider font-bold text-xs sm:text-sm space-x-2">
                  <ShoppingBag size={16} />
                  <span>Add To Cart</span>
                </button>
                
                <button onClick={handleBuyNow} className="flex-1 h-12 bg-[#ff0033] text-white hover:bg-[#cc0029] active:scale-[0.98] rounded-lg transition-all flex items-center justify-center font-montserrat uppercase tracking-wider font-bold text-xs sm:text-sm space-x-2 shadow-[0_0_15px_rgba(255,0,51,0.3)]">
                  <span>Buy Now</span>
                </button>
                
                <button 
                  onClick={handleWishlistToggle}
                  className="w-12 h-12 border border-zinc-300 dark:border-white/20 rounded-lg text-zinc-550 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center flex-shrink-0"
                >
                  <Heart size={20} className={isWishlisted ? "fill-[#ff0033] text-[#ff0033]" : ""} />
                </button>
              </div>
            </div>

            {/* Meta Info */}
            <div className="border-t border-zinc-200 dark:border-white/5 pt-6 space-y-4 mb-8">
              <div className="flex items-center space-x-3 text-sm text-zinc-650 dark:text-gray-400 font-poppins bg-zinc-50 dark:bg-white/5 p-4 rounded-xl border border-zinc-200 dark:border-white/5">
                <Truck size={20} className="text-[#ff0033]" />
                <span>Free express shipping on orders over ₹150</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-zinc-650 dark:text-gray-400 font-poppins bg-zinc-50 dark:bg-white/5 p-4 rounded-xl border border-zinc-200 dark:border-white/5">
                <ShieldAlert size={20} className="text-[#ff0033]" />
                <span>30-day premium return policy.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
