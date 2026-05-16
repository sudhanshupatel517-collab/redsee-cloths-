"use client";
import { useState, useEffect } from "react";
import { Lock, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { clearCart } from "@/store/cartSlice";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const [step, setStep] = useState(1);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState({
    street: '', city: '', state: '', zipCode: '', country: 'US', phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const tax = subtotal * 0.08;
  const totalAmount = subtotal > 0 ? subtotal + shipping + tax : 0;

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const orderData = {
        products: cartItems.map(item => ({
          product: item.product,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price
        })),
        shippingAddress,
        paymentMethod,
        totalAmount
      };

      await axios.post('http://localhost:5000/api/orders', orderData, config);
      dispatch(clearCart());
      setStep(3);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order.');
    }
  };

  if (!user) return null;

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
                <div className="col-span-2">
                  <label className="block text-xs font-montserrat text-gray-400 uppercase tracking-wider mb-2">Address Line 1</label>
                  <input required type="text" value={shippingAddress.street} onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})} className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff0033] focus:outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-montserrat text-gray-400 uppercase tracking-wider mb-2">City</label>
                  <input required type="text" value={shippingAddress.city} onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff0033] focus:outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-montserrat text-gray-400 uppercase tracking-wider mb-2">State</label>
                  <input required type="text" value={shippingAddress.state} onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})} className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff0033] focus:outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-montserrat text-gray-400 uppercase tracking-wider mb-2">Postal Code</label>
                  <input required type="text" value={shippingAddress.zipCode} onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})} className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff0033] focus:outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-montserrat text-gray-400 uppercase tracking-wider mb-2">Phone</label>
                  <input required type="text" value={shippingAddress.phone} onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})} className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff0033] focus:outline-none transition-colors" />
                </div>
              </div>
              <button type="submit" className="w-full mt-8 bg-white text-black py-4 font-montserrat uppercase tracking-wider font-bold text-sm hover:bg-[#ff0033] hover:text-white transition-colors">
                Continue to Payment
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <h2 className="text-2xl font-bebas text-white tracking-wide border-b border-white/10 pb-4 mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-white/20 cursor-pointer hover:border-[#ff0033] transition-colors">
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" value="Razorpay" checked={paymentMethod === 'Razorpay'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-[#ff0033] focus:ring-[#ff0033]" />
                    <span className="font-poppins text-white">Razorpay (Cards, UPI, NetBanking)</span>
                  </div>
                  <CreditCard className="text-gray-400" />
                </label>

                <label className="flex items-center justify-between p-4 border border-white/20 cursor-pointer hover:border-[#ff0033] transition-colors">
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-[#ff0033] focus:ring-[#ff0033]" />
                    <span className="font-poppins text-gray-300">Cash on Delivery</span>
                  </div>
                </label>
              </div>

              <div className="flex space-x-4 mt-8">
                <button type="button" onClick={() => setStep(1)} className="w-1/3 border border-white/20 text-white py-4 font-montserrat uppercase tracking-wider font-bold text-sm hover:bg-white/5 transition-colors">
                  Back
                </button>
                <button type="submit" className="w-2/3 bg-white text-black py-4 font-montserrat uppercase tracking-wider font-bold text-sm hover:bg-[#ff0033] hover:text-white transition-colors">
                  Place Order
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-8 text-center py-10">
              <CheckCircle2 size={64} className="text-[#ff0033] mx-auto mb-6" />
              <h2 className="text-4xl font-bebas text-white tracking-wide">Order Placed Successfully!</h2>
              <p className="text-gray-400 font-poppins text-lg">Your order has been confirmed and is being processed.</p>
              <p className="text-gray-500 font-poppins text-sm mb-8">We've sent a confirmation email to you.</p>
              
              <button onClick={() => router.push('/')} className="bg-[#ff0033] text-white px-10 py-4 font-montserrat uppercase tracking-wider font-bold text-sm hover:bg-white hover:text-black transition-colors inline-block">
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
                {cartItems.map((item, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="w-16 h-20 bg-zinc-800">
                      <img src={item.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-poppins text-white line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-gray-500 font-poppins mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                      <p className="text-sm font-poppins font-bold text-white mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3 mb-4">
                <div className="flex justify-between text-sm font-poppins text-gray-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-poppins text-gray-300">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-poppins text-gray-300">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between font-poppins font-bold text-white text-lg">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
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
