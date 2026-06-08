"use client";
import Link from "next/link";
import { Trash2, ArrowRight, ArrowLeft, ShieldCheck, Truck, ShoppingBag } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { addToCart, removeFromCart } from "@/store/cartSlice";
import { useRouter } from "next/navigation";
import { optimizeImageUrl } from "@/lib/image";

export default function Cart() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const updateQuantity = (item: any, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(addToCart({ ...item, quantity: newQuantity }));
  };

  const removeItem = (product: string, size: string, color: string) => {
    dispatch(removeFromCart({ product, size, color }));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal > 0 ? subtotal + shipping : 0;

  return (
    <div className="bg-background min-h-screen pb-32 md:pb-12">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 py-4">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="text-foreground mr-3">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bebas tracking-widest uppercase">My Cart</h1>
        </div>
        <span className="text-xs font-montserrat text-foreground/50">{cartItems.length} items</span>
      </div>

      <div className="container mx-auto px-4 md:px-6 md:py-12 pt-6">
        <h1 className="hidden md:block text-4xl md:text-5xl font-bebas text-black dark:text-white tracking-wide mb-10">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-foreground/20" />
            </div>
            <h2 className="text-2xl font-bebas tracking-wider text-zinc-900 dark:text-white mb-2">Cart is empty</h2>
            <p className="text-sm font-poppins text-zinc-500 dark:text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/shop">
              <button className="bg-[#ff0033] text-white px-8 py-3.5 rounded-full font-montserrat uppercase tracking-wider font-bold text-xs hover:bg-[#cc0029] transition-colors shadow-[0_0_20px_rgba(255,0,51,0.3)]">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 md:gap-12">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free Shipping Progress */}
              {shipping > 0 && (
                <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-4 mb-2 flex items-start space-x-3 transition-colors duration-300">
                  <div className="bg-[#ff0033]/10 dark:bg-[#ff0033]/20 p-2 rounded-full">
                    <Truck size={16} className="text-[#ff0033]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-poppins text-zinc-700 dark:text-foreground/80 mb-2">
                      Add <span className="font-bold text-[#ff0033]">₹{(999 - subtotal).toFixed(2)}</span> more to get <span className="font-bold text-black dark:text-white">Free Shipping!</span>
                    </p>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ff0033] rounded-full" style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              )}

              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 border border-zinc-200 dark:border-white/5 rounded-2xl bg-white dark:bg-zinc-900/40 shadow-sm dark:shadow-none relative transition-colors duration-300">
                  <div className="w-20 h-28 md:w-28 md:h-36 flex-shrink-0 bg-zinc-100 dark:bg-black rounded-lg overflow-hidden border border-zinc-200 dark:border-white/10">
                    <img src={optimizeImageUrl(item.image, 160)} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div className="pr-8">
                      <h3 className="text-lg md:text-xl font-bebas tracking-wide text-black dark:text-white leading-tight mb-1">{item.title}</h3>
                      <p className="text-[10px] md:text-xs font-montserrat uppercase font-bold tracking-widest text-zinc-400 dark:text-gray-500 mb-1">
                        {item.color} | {item.size}
                      </p>
                      <span className="text-sm md:text-base font-poppins font-bold text-black dark:text-white">₹{item.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-end mt-4">
                      <div className="flex border border-zinc-300 dark:border-white/10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-white/5">
                        <button onClick={() => updateQuantity(item, item.quantity - 1)} className="px-3 py-1.5 text-zinc-700 dark:text-white active:bg-zinc-200 dark:active:bg-white/10 transition-colors">-</button>
                        <input type="text" value={item.quantity} readOnly className="w-8 bg-transparent text-center font-poppins text-black dark:text-white text-xs outline-none" />
                        <button onClick={() => updateQuantity(item, item.quantity + 1)} className="px-3 py-1.5 text-zinc-700 dark:text-white active:bg-zinc-200 dark:active:bg-white/10 transition-colors">+</button>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeItem(item.product, item.size, item.color)} 
                      className="absolute top-4 right-4 text-foreground/30 hover:text-[#ff0033] p-1 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

             {/* Order Summary (Desktop Sticky, Mobile Bottom) */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 md:p-6 md:sticky md:top-24 shadow-sm dark:shadow-none transition-colors duration-300">
                <h3 className="hidden md:block text-2xl font-bebas tracking-wide text-black dark:text-white mb-6">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm font-poppins text-zinc-500 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-black dark:text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-poppins text-zinc-500 dark:text-gray-400">
                    <span>Estimated Shipping</span>
                    <span className={shipping === 0 ? "text-[#ff0033] font-bold" : "text-black dark:text-white"}>
                      {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-zinc-200 dark:border-white/10 pt-3 mt-3 flex justify-between font-poppins font-bold text-black dark:text-white text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link href="/checkout">
                    <button className="w-full bg-[#ff0033] text-white py-4 rounded-xl font-montserrat uppercase tracking-wider font-bold text-sm flex items-center justify-center space-x-2 hover:bg-[#cc0029] active:scale-[0.98] transition-all group shadow-[0_0_20px_rgba(255,0,51,0.15)] cursor-pointer">
                      <span>Checkout Now</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <div className="mt-4 flex items-center justify-center space-x-2 text-zinc-500 dark:text-gray-500">
                    <ShieldCheck size={16} />
                    <p className="text-xs font-poppins">Secure 256-bit SSL Checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
