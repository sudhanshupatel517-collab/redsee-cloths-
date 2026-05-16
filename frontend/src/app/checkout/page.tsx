"use client";
import { useState } from "react";
import { Lock, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";

export default function Checkout() {
  const [step, setStep] = useState(1);
  
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  return (
    <div className="container mx-auto px-6 py-12 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bebas text-white tracking-wide mb-10 text-center">Checkout</h1>
      
      {/* Stepper */}
      <div className="flex items-center justify-center mb-12 max-w-3xl mx-auto">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-white' : 'text-gray-600'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-[#ff0033] text-white' : 'bg-gray-800'}`}>1</div>
          <span className="font-montserrat uppercase text-xs tracking-wider font-bold hidden md:block">Shipping</span>
        </div>
        <div className={`flex-1 h-[1px] mx-4 ${step >= 2 ? 'bg-[#ff0033]' : 'bg-gray-800'}`}></div>
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-white' : 'text-gray-600'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-[#ff0033] text-white' : 'bg-gray-800'}`}>2</div>
          <span className="font-montserrat uppercase text-xs tracking-wider font-bold hidden md:block">Payment</span>
        </div>
        <div className={`flex-1 h-[1px] mx-4 ${step >= 3 ? 'bg-[#ff0033]' : 'bg-gray-800'}`}></div>
        <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-white' : 'text-gray-600'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-[#ff0033] text-white' : 'bg-gray-800'}`}>3</div>
          <span className="font-montserrat uppercase text-xs tracking-wider font-bold hidden md:block">Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-6">
              <h2 className="text-2xl font-bebas text-white tracking-wide border-b border-white/10 pb-4 mb-6">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-montserrat text-gray-400 uppercase tracking-wider mb-2">First Name</label>
                  <input required type="text" className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff0033] focus:outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-montserrat text-gray-400 uppercase tracking-wider mb-2">Last Name</label>
                  <input required type="text" className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff0033] focus:outline-none transition-colors" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-montserrat text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input required type="email" className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff0033] focus:outline-none transition-colors" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-montserrat text-gray-400 uppercase tracking-wider mb-2">Address Line 1</label>
                  <input required type="text" className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff0033] focus:outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-montserrat text-gray-400 uppercase tracking-wider mb-2">City</label>
                  <input required type="text" className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff0033] focus:outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-montserrat text-gray-400 uppercase tracking-wider mb-2">Postal Code</label>
                  <input required type="text" className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff0033] focus:outline-none transition-colors" />
                </div>
              </div>
              <button type="submit" className="w-full mt-8 bg-white text-black py-4 font-montserrat uppercase tracking-wider font-bold text-sm hover:bg-[#ff0033] hover:text-white transition-colors">
                Continue to Payment
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-6">
              <h2 className="text-2xl font-bebas text-white tracking-wide border-b border-white/10 pb-4 mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-[#ff0033] bg-[#ff0033]/5 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" defaultChecked className="text-[#ff0033] focus:ring-[#ff0033]" />
                    <span className="font-poppins text-white">Credit / Debit Card (Stripe)</span>
                  </div>
                  <CreditCard className="text-gray-400" />
                </label>
                
                <label className="flex items-center justify-between p-4 border border-white/20 cursor-pointer hover:border-white/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" className="text-[#ff0033] focus:ring-[#ff0033]" />
                    <span className="font-poppins text-gray-300">UPI / Net Banking (Razorpay)</span>
                  </div>
                </label>

                <label className="flex items-center justify-between p-4 border border-white/20 cursor-pointer hover:border-white/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" className="text-[#ff0033] focus:ring-[#ff0033]" />
                    <span className="font-poppins text-gray-300">Cash on Delivery</span>
                  </div>
                </label>
              </div>

              <div className="bg-black border border-white/20 p-6 mt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-montserrat text-gray-400 uppercase tracking-wider mb-2">Card Number</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff0033] focus:outline-none transition-colors font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-montserrat text-gray-400 uppercase tracking-wider mb-2">Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff0033] focus:outline-none transition-colors font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs font-montserrat text-gray-400 uppercase tracking-wider mb-2">CVC</label>
                      <input type="text" placeholder="123" className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff0033] focus:outline-none transition-colors font-mono" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button type="button" onClick={() => setStep(1)} className="w-1/3 border border-white/20 text-white py-4 font-montserrat uppercase tracking-wider font-bold text-sm hover:bg-white/5 transition-colors">
                  Back
                </button>
                <button type="submit" className="w-2/3 bg-white text-black py-4 font-montserrat uppercase tracking-wider font-bold text-sm hover:bg-[#ff0033] hover:text-white transition-colors">
                  Review Order
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-8 text-center py-10">
              <CheckCircle2 size={64} className="text-[#ff0033] mx-auto mb-6" />
              <h2 className="text-4xl font-bebas text-white tracking-wide">Order Placed Successfully!</h2>
              <p className="text-gray-400 font-poppins text-lg">Your order #ORD-2026-8894 has been confirmed.</p>
              <p className="text-gray-500 font-poppins text-sm mb-8">We've sent a confirmation email to you.</p>
              
              <button onClick={() => window.location.href = '/'} className="bg-[#ff0033] text-white px-10 py-4 font-montserrat uppercase tracking-wider font-bold text-sm hover:bg-white hover:text-black transition-colors inline-block">
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        {step < 3 && (
          <div className="lg:col-span-1">
            <div className="bg-[#0A0A0A] border border-white/5 p-6 sticky top-24">
              <h3 className="text-xl font-bebas tracking-wide text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {/* Mock Items */}
                <div className="flex space-x-4">
                  <div className="w-16 h-20 bg-zinc-800">
                    <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-poppins text-white line-clamp-1">Crimson Eclipse Oversized Hoodie</h4>
                    <p className="text-xs text-gray-500 font-poppins mt-1">Size: L | Qty: 1</p>
                    <p className="text-sm font-poppins font-bold text-white mt-1">$129.99</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3 mb-4">
                <div className="flex justify-between text-sm font-poppins text-gray-300">
                  <span>Subtotal</span>
                  <span>$129.99</span>
                </div>
                <div className="flex justify-between text-sm font-poppins text-gray-300">
                  <span>Shipping</span>
                  <span>$15.00</span>
                </div>
                <div className="flex justify-between text-sm font-poppins text-gray-300">
                  <span>Tax</span>
                  <span>$10.40</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between font-poppins font-bold text-white text-lg">
                  <span>Total</span>
                  <span>$155.39</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-gray-500 mt-6">
                <Lock size={14} />
                <span className="text-xs font-poppins">Secure Checkout</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
