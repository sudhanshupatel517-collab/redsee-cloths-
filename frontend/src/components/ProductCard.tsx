"use client";
import Link from "next/link";
import { Heart, ShoppingBag, Check, Star } from "lucide-react";
import { useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { RootState } from "@/store/store";
import { addRecentlyViewedLocal, addRecentlyViewedBackend } from "@/store/recentlyViewedSlice";
import { toggleWishlistLocal, toggleWishlistBackend } from "@/store/wishlistSlice";
import { optimizeImageUrl } from "@/lib/image";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  image: any;
  hoverImage: any;
  category: string;
  rating?: number;
  discount?: number;
  section?: string;
}

const ProductCard = memo(({ id, name, price, image, hoverImage, category, rating = 5, discount, section }: ProductProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((item: any) => item._id === id);

  const getImageUrl = (img: any): string => {
    if (!img) return "";
    if (typeof img === "string") return img;
    return img.url || "";
  };

  const imgUrl = optimizeImageUrl(getImageUrl(image), 600);
  const hoverImgUrl = hoverImage ? optimizeImageUrl(getImageUrl(hoverImage), 600) : imgUrl;

  const getProductObj = () => {
    return {
      _id: id,
      name,
      images: [imgUrl, hoverImgUrl],
      pricing: {
        finalPrice: price,
        basePrice: price,
        discountPercentage: discount || 0
      },
      category,
      rating,
      section
    };
  };

  const handleCardClick = () => {
    const productObj = getProductObj();

    if (isAuthenticated) {
      dispatch(addRecentlyViewedBackend(id) as any);
    } else {
      dispatch(addRecentlyViewedLocal(productObj));
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(addToCart({
      product: id,
      title: name,
      image: imgUrl,
      price: price,
      quantity: 1,
      size: "M",
      color: "Black"
    }));

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div 
      className="product-card group relative flex flex-col bg-white dark:bg-background border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 transition-all duration-300 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col space-y-1.5 pointer-events-none">
        {discount && discount > 0 ? (
          <span className="bg-[#ff0033] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-[0_0_10px_rgba(255,0,51,0.5)]">
            -{discount}% OFF
          </span>
        ) : null}
      </div>

      {/* Quick Wishlist */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const productObj = getProductObj();
          dispatch(toggleWishlistLocal(productObj));
          if (isAuthenticated) {
            dispatch(toggleWishlistBackend(id) as any);
          }
        }}
        className="absolute top-3 right-3 z-20 bg-white/80 dark:bg-black/60 p-2 rounded-full border border-zinc-200 dark:border-white/10 text-foreground/75 hover:text-[#ff0033] hover:border-[#ff0033]/40 active:scale-90 transition-all shadow-md"
        aria-label="Add to wishlist"
      >
        <Heart size={15} className={isWishlisted ? "fill-[#ff0033] text-[#ff0033]" : "text-zinc-600 dark:text-white"} />
      </button>

      {/* Image Container */}
      <Link 
        href={`/product/${id}`} 
        onClick={handleCardClick}
        className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 block"
      >
        <img 
          src={isHovered ? hoverImgUrl : imgUrl} 
          alt={name}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        {/* Soft shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
      </Link>

      {/* Details */}
      <div className="p-3.5 flex flex-col flex-grow bg-white dark:bg-[#0A0A0A]">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] text-zinc-500 dark:text-gray-500 uppercase tracking-widest font-montserrat font-medium truncate max-w-[70%]">
            {category}
          </span>
          <div className="flex items-center gap-0.5">
            <Star size={10} className="fill-[#ff0033] text-[#ff0033]" />
            <span className="text-[10px] text-zinc-700 dark:text-gray-300 font-bold font-poppins">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Product Title */}
        <Link href={`/product/${id}`} onClick={handleCardClick}>
          <h3 className="text-sm md:text-base font-bebas tracking-wide text-black dark:text-white mb-2 hover:text-[#ff0033] dark:hover:text-[#ff0033] transition-colors line-clamp-1 leading-tight uppercase">
            {name}
          </h3>
        </Link>
        
        {/* Pricing & Add to Cart */}
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex flex-col">
            {discount && discount > 0 ? (
              <span className="text-[10px] text-zinc-400 dark:text-gray-500 line-through font-poppins mb-0.5">
                ₹{(price / (1 - discount / 100)).toFixed(2)}
              </span>
            ) : null}
            <span className="text-sm md:text-base font-bold font-poppins text-black dark:text-white leading-none">₹{price}</span>
          </div>

          <button 
            onClick={handleQuickAdd}
            className={`w-8 h-8 md:w-9 md:h-9 rounded-full border flex items-center justify-center transition-all active:scale-90 shadow-lg ${
              addedToCart 
                ? "bg-green-500 border-green-500 text-white" 
                : "bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-white hover:bg-[#ff0033] hover:border-[#ff0033] hover:text-white dark:hover:text-white hover:shadow-[0_0_12px_rgba(255,0,51,0.4)]"
            }`}
            title="Quick add to cart"
          >
            {addedToCart ? <Check size={14} /> : <ShoppingBag size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
