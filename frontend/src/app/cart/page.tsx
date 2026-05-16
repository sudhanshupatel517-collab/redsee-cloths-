"use client";
import { useState } from "react";
import { mockProducts } from "@/lib/data";
import Link from "next/link";
import { Trash2, ArrowRight } from "lucide-react";

export default function Cart() {
  // Using some mock data for the cart
  const [cartItems, setCartItems] = useState([
    { ...mockProducts[0], quantity: 1, size: 'L', color: 'Black' },
    { ...mockProducts[2], quantity: 2, size: 'M', color: 'Charcoal' }
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-6 py-12 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bebas text-white tracking-wide mb-10">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-poppins text-gray-400 mb-6">Your cart is currently empty.</h2>
          <Link href="/shop">
            <button className="bg-[#ff0033] text-white px-8 py-3 font-montserrat uppercase tracking-wider font-bold text-sm hover:bg-white hover:text-black transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-6 p-4 border border-white/5 bg-zinc-900/50">
                <div className="w-24 h-32 flex-shrink-0 bg-black">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bebas tracking-wide text-white">{item.name}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-[#ff0033] transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <p className="text-sm font-poppins text-gray-400 mt-1">
                      Size: {item.size} | Color: {item.color}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex border border-white/20">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-white hover:bg-white/5 transition-colors">-</button>
                      <input type="text" value={item.quantity} readOnly className="w-10 bg-transparent text-center font-poppins text-white text-sm" />
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-white hover:bg-white/5 transition-colors">+</button>
                    </div>
                    <span className="font-poppins font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#0A0A0A] border border-white/5 p-6 sticky top-24">
              <h3 className="text-2xl font-bebas tracking-wide text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm font-poppins text-gray-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-poppins text-gray-300">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between font-poppins font-bold text-white text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <button className="w-full bg-[#ff0033] text-white py-4 font-montserrat uppercase tracking-wider font-bold text-sm flex items-center justify-center space-x-2 hover:bg-white hover:text-black transition-colors group">
                  <span>Checkout</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 font-poppins">Secure checkout with Stripe / Razorpay</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
