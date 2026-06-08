"use client";
import { useState, useEffect } from "react";
import { Lock, CreditCard, ChevronRight, CheckCircle2, Plus, MapPin } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { clearCart } from "@/store/cartSlice";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { optimizeImageUrl } from "@/lib/image";

export default function Checkout() {
  const [step, setStep] = useState(1);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState({
    name: '', street: '', city: '', state: '', zipCode: '', country: 'India', phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [transactionRef, setTransactionRef] = useState('');
  const [verifying, setVerifying] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [useNewAddress, setUseNewAddress] = useState<boolean>(true);
  const [saveNewAddress, setSaveNewAddress] = useState<boolean>(true);
  const [setAsDefault, setSetAsDefault] = useState<boolean>(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = subtotal * 0.08;
  const totalAmount = subtotal > 0 ? subtotal + shipping + tax : 0;

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        const { data } = await api.get('/api/users/addresses', config);
        setSavedAddresses(data);
        
        // Find default address
        const defaultAddr = data.find((addr: any) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
          setShippingAddress({
            name: defaultAddr.name || '',
            street: defaultAddr.street || '',
            city: defaultAddr.city || '',
            state: defaultAddr.state || '',
            zipCode: defaultAddr.zipCode || '',
            country: defaultAddr.country || 'India',
            phone: defaultAddr.phone || ''
          });
          setUseNewAddress(false);
        } else if (data.length > 0) {
          setSelectedAddressId(data[0]._id);
          setShippingAddress({
            name: data[0].name || '',
            street: data[0].street || '',
            city: data[0].city || '',
            state: data[0].state || '',
            zipCode: data[0].zipCode || '',
            country: data[0].country || 'India',
            phone: data[0].phone || ''
          });
          setUseNewAddress(false);
        } else {
          setUseNewAddress(true);
        }
      } catch (err) {
        console.error('Error fetching addresses:', err);
        setUseNewAddress(true);
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (useNewAddress) {
      if (!shippingAddress.name) {
        alert('Please enter a recipient name');
        return;
      }
      if (saveNewAddress) {
        try {
          const config = { headers: { Authorization: `Bearer ${user?.token}` } };
          const { data } = await api.post('/api/users/addresses', {
            ...shippingAddress,
            isDefault: setAsDefault
          }, config);
          
          // Select the newly added address (usually the last item)
          const newAddr = data[data.length - 1];
          if (newAddr) {
            setSelectedAddressId(newAddr._id);
            setShippingAddress(newAddr);
          }
          setSavedAddresses(data);
          setUseNewAddress(false);
        } catch (err) {
          console.error('Failed to save address:', err);
        }
      }
    }
    setStep(step + 1);
  };

  const handlePlaceOrder = async (e?: React.FormEvent, customRef?: string) => {
    if (e) e.preventDefault();
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
        totalAmount,
        razorpayPaymentId: customRef || undefined
      };

      await api.post('/api/orders', orderData, config);
      dispatch(clearCart());
      setStep(4); // Success screen is now Step 4
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order.');
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'UPI') {
      setStep(3); // Go to UPI QR Verification step
    } else {
      handlePlaceOrder(); // COD: immediately place order
    }
  };

  const handleVerifyUPIPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (transactionRef.trim().length < 12) {
      alert("Please enter a valid 12-digit UTR/Transaction Reference number.");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      handlePlaceOrder(undefined, transactionRef);
      setVerifying(false);
    }, 2000);
  };

  if (!user) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bebas text-black dark:text-white tracking-wide mb-10 text-center">Checkout</h1>
      
      {/* Stepper */}
      {step < 4 && (
        <div className="flex items-center justify-center mb-12 max-w-3xl mx-auto">
          <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-black dark:text-white' : 'text-zinc-400 dark:text-gray-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-[#ff0033] text-white' : 'bg-zinc-200 dark:bg-gray-800 text-zinc-500'}`}>1</div>
            <span className="font-montserrat uppercase text-xs tracking-wider font-bold hidden md:block">Shipping</span>
          </div>
          <div className={`flex-1 h-[1px] mx-4 ${step >= 2 ? 'bg-[#ff0033]' : 'bg-zinc-200 dark:bg-gray-800'}`}></div>
          <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-black dark:text-white' : 'text-zinc-400 dark:text-gray-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-[#ff0033] text-white' : 'bg-zinc-200 dark:bg-gray-800 text-zinc-500'}`}>2</div>
            <span className="font-montserrat uppercase text-xs tracking-wider font-bold hidden md:block">Payment</span>
          </div>
          <div className={`flex-1 h-[1px] mx-4 ${step >= 3 ? 'bg-[#ff0033]' : 'bg-zinc-200 dark:bg-gray-800'}`}></div>
          <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-black dark:text-white' : 'text-zinc-400 dark:text-gray-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-[#ff0033] text-white' : 'bg-zinc-200 dark:bg-gray-800 text-zinc-500'}`}>3</div>
            <span className="font-montserrat uppercase text-xs tracking-wider font-bold hidden md:block">Verification</span>
          </div>
        </div>
      )}

      {step === 4 ? (
        <div className="flex justify-center w-full">
          <div className="max-w-xl w-full space-y-8 text-center py-12 px-6 bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-white/5 rounded-2xl shadow-sm dark:shadow-none transition-colors duration-300">
            <CheckCircle2 size={64} className="text-[#ff0033] mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl font-bebas text-black dark:text-white tracking-wide">Order Placed Successfully!</h2>
            <p className="text-zinc-650 dark:text-gray-300 font-poppins text-lg">Your order has been confirmed and is being processed.</p>
            {paymentMethod === 'UPI' && (
              <div className="max-w-md mx-auto bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 p-4 rounded-xl font-poppins text-sm">
                Manual UPI payment reference <span className="font-mono font-bold">{transactionRef}</span> registered. The admin will verify the transaction details shortly.
              </div>
            )}
            <p className="text-zinc-500 dark:text-gray-500 font-poppins text-sm">We've sent a confirmation email to you.</p>
            
            <button onClick={() => router.push('/')} className="bg-[#ff0033] text-white px-10 py-4 font-montserrat uppercase tracking-wider font-bold text-sm hover:bg-black hover:text-white dark:hover:text-black transition-colors inline-block cursor-pointer">
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-6">
                <h2 className="text-2xl font-bebas text-black dark:text-white tracking-wide border-b border-zinc-200 dark:border-white/10 pb-4 mb-6">Shipping Address</h2>
                
                {/* Saved Addresses list */}
                {savedAddresses.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xs font-montserrat text-zinc-500 dark:text-gray-400 uppercase tracking-wider mb-4">Select Shipping Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedAddressId === addr._id && !useNewAddress;
                        return (
                          <div
                            key={addr._id}
                            onClick={() => {
                              setSelectedAddressId(addr._id);
                              setShippingAddress({
                                name: addr.name || '',
                                street: addr.street || '',
                                city: addr.city || '',
                                state: addr.state || '',
                                zipCode: addr.zipCode || '',
                                country: addr.country || 'India',
                                phone: addr.phone || ''
                              });
                              setUseNewAddress(false);
                            }}
                            className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 relative text-left bg-zinc-50 dark:bg-white/[0.02] ${
                              isSelected 
                                ? 'border-[#ff0033] shadow-[0_0_15px_rgba(255,0,51,0.15)] ring-1 ring-[#ff0033]' 
                                : 'border-zinc-200 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/30'
                            }`}
                          >
                            {addr.isDefault && (
                              <span className="absolute top-3 right-3 bg-[#ff0033]/10 text-[#ff0033] text-[8px] font-montserrat font-bold px-2 py-0.5 rounded tracking-widest">
                                DEFAULT
                              </span>
                            )}
                            <p className="font-poppins font-bold text-sm text-black dark:text-white mb-2">{addr.name}</p>
                            <p className="font-poppins text-xs text-zinc-600 dark:text-gray-400 mb-1">{addr.street}</p>
                            <p className="font-poppins text-xs text-zinc-600 dark:text-gray-400 mb-2">{addr.city}, {addr.state} - {addr.zipCode}</p>
                            <p className="font-poppins text-[10px] text-zinc-500 dark:text-gray-500">Phone: {addr.phone}</p>
                          </div>
                        );
                      })}

                      {/* Use New Address Card */}
                      <div
                        onClick={() => {
                          setUseNewAddress(true);
                          setSelectedAddressId('');
                          setShippingAddress({
                            name: '',
                            street: '',
                            city: '',
                            state: '',
                            zipCode: '',
                            country: 'India',
                            phone: ''
                          });
                        }}
                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] text-center bg-zinc-50 dark:bg-white/[0.02] ${
                          useNewAddress 
                            ? 'border-[#ff0033] shadow-[0_0_15px_rgba(255,0,51,0.15)] ring-1 ring-[#ff0033]' 
                            : 'border-zinc-200 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/30'
                        }`}
                      >
                        <Plus size={24} className={useNewAddress ? 'text-[#ff0033] mb-2' : 'text-zinc-400 dark:text-gray-500 mb-2'} />
                        <span className="font-montserrat text-xs font-bold uppercase tracking-wider text-black dark:text-white">Use a New Address</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Form */}
                {(useNewAddress || savedAddresses.length === 0) && (
                  <div className="space-y-6 pt-4 border-t border-zinc-200 dark:border-white/10">
                    <h3 className="text-xs font-montserrat text-zinc-500 dark:text-gray-400 uppercase tracking-wider mb-2">New Address Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-montserrat text-zinc-500 dark:text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                        <input required type="text" value={shippingAddress.name} onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})} className="w-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/20 p-3 text-black dark:text-white focus:border-[#ff0033] focus:outline-none transition-colors" placeholder="e.g. Sudhanshu Patel" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-montserrat text-zinc-500 dark:text-gray-400 uppercase tracking-wider mb-2">Address Line 1</label>
                        <input required type="text" value={shippingAddress.street} onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})} className="w-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/20 p-3 text-black dark:text-white focus:border-[#ff0033] focus:outline-none transition-colors" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-montserrat text-zinc-500 dark:text-gray-400 uppercase tracking-wider mb-2">City</label>
                        <input required type="text" value={shippingAddress.city} onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} className="w-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/20 p-3 text-black dark:text-white focus:border-[#ff0033] focus:outline-none transition-colors" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-montserrat text-zinc-500 dark:text-gray-400 uppercase tracking-wider mb-2">State</label>
                        <input required type="text" value={shippingAddress.state} onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})} className="w-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/20 p-3 text-black dark:text-white focus:border-[#ff0033] focus:outline-none transition-colors" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-montserrat text-zinc-500 dark:text-gray-400 uppercase tracking-wider mb-2">Postal Code</label>
                        <input required type="text" value={shippingAddress.zipCode} onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})} className="w-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/20 p-3 text-black dark:text-white focus:border-[#ff0033] focus:outline-none transition-colors" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-montserrat text-zinc-500 dark:text-gray-400 uppercase tracking-wider mb-2">Phone</label>
                        <input required type="text" value={shippingAddress.phone} onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})} className="w-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/20 p-3 text-black dark:text-white focus:border-[#ff0033] focus:outline-none transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={saveNewAddress} 
                          onChange={(e) => setSaveNewAddress(e.target.checked)} 
                          className="accent-[#ff0033] h-4 w-4"
                        />
                        <span className="text-sm font-poppins text-zinc-700 dark:text-gray-300">Save this address for future use</span>
                      </label>

                      {saveNewAddress && (
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={setAsDefault} 
                            onChange={(e) => setSetAsDefault(e.target.checked)} 
                            className="accent-[#ff0033] h-4 w-4"
                          />
                          <span className="text-sm font-poppins text-zinc-700 dark:text-gray-300">Set it as a default address</span>
                        </label>
                      )}
                    </div>
                  </div>
                )}

                <button type="submit" className="w-full mt-8 bg-black dark:bg-white text-white dark:text-black py-4 font-montserrat uppercase tracking-wider font-bold text-sm hover:bg-[#ff0033] dark:hover:bg-[#ff0033] hover:text-white dark:hover:text-white transition-colors cursor-pointer">
                  Continue to Payment
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <h2 className="text-2xl font-bebas text-black dark:text-white tracking-wide border-b border-zinc-200 dark:border-white/10 pb-4 mb-6">Payment Method</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-zinc-200 dark:border-white/20 cursor-pointer hover:border-[#ff0033] dark:hover:border-[#ff0033] transition-colors rounded-lg bg-zinc-50 dark:bg-transparent">
                    <div className="flex items-center space-x-3">
                      <input type="radio" name="payment" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-[#ff0033] focus:ring-[#ff0033]" />
                      <span className="font-poppins text-zinc-800 dark:text-white">UPI / Qrcode Transfer (Manual Verification)</span>
                    </div>
                    <CreditCard className="text-zinc-400 dark:text-gray-400" />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-zinc-200 dark:border-white/20 cursor-pointer hover:border-[#ff0033] dark:hover:border-[#ff0033] transition-colors rounded-lg bg-zinc-50 dark:bg-transparent">
                    <div className="flex items-center space-x-3">
                      <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-[#ff0033] focus:ring-[#ff0033]" />
                      <span className="font-poppins text-zinc-800 dark:text-gray-300">Cash on Delivery</span>
                    </div>
                  </label>
                </div>

                <div className="flex space-x-4 mt-8">
                  <button type="button" onClick={() => setStep(1)} className="w-1/3 border border-zinc-300 dark:border-white/20 text-zinc-700 dark:text-white py-4 font-montserrat uppercase tracking-wider font-bold text-sm hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                    Back
                  </button>
                  <button type="submit" className="w-2/3 bg-black dark:bg-white text-white dark:text-black py-4 font-montserrat uppercase tracking-wider font-bold text-sm hover:bg-[#ff0033] dark:hover:bg-[#ff0033] hover:text-white dark:hover:text-white transition-colors">
                    {paymentMethod === 'UPI' ? 'Proceed to QR Code' : 'Place Order'}
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleVerifyUPIPayment} className="space-y-6">
                <h2 className="text-2xl font-bebas text-black dark:text-white tracking-wide border-b border-zinc-200 dark:border-white/10 pb-4 mb-6">UPI Payment Verification</h2>
                
                <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl p-6 text-center space-y-6">
                  <div className="space-y-1">
                    <p className="text-xs font-montserrat text-zinc-400 dark:text-gray-500 uppercase tracking-widest">Amount to Pay</p>
                    <p className="text-3xl font-poppins font-bold text-black dark:text-white">₹{totalAmount.toFixed(2)}</p>
                  </div>

                  {/* Styled Mock QR Code */}
                  <div className="relative w-56 h-56 mx-auto bg-white p-3 rounded-2xl shadow-lg border border-zinc-200">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <rect x="5" y="5" width="25" height="25" fill="#000" />
                      <rect x="8" y="8" width="19" height="19" fill="#fff" />
                      <rect x="11" y="11" width="13" height="13" fill="#000" />
                      
                      <rect x="70" y="5" width="25" height="25" fill="#000" />
                      <rect x="73" y="8" width="19" height="19" fill="#fff" />
                      <rect x="76" y="11" width="13" height="13" fill="#000" />
                      
                      <rect x="5" y="70" width="25" height="25" fill="#000" />
                      <rect x="8" y="73" width="19" height="19" fill="#fff" />
                      <rect x="11" y="76" width="13" height="13" fill="#000" />
                      
                      <rect x="42" y="42" width="16" height="16" rx="4" fill="#ff0033" />
                      <path d="M47 50 L53 50 M50 47 L50 53" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                      
                      <rect x="35" y="10" width="6" height="6" fill="#000" />
                      <rect x="45" y="15" width="6" height="6" fill="#000" />
                      <rect x="55" y="5" width="6" height="6" fill="#000" />
                      <rect x="35" y="25" width="6" height="6" fill="#000" />
                      <rect x="50" y="20" width="6" height="6" fill="#000" />
                      <rect x="60" y="25" width="6" height="6" fill="#000" />
                      
                      <rect x="10" y="35" width="6" height="6" fill="#000" />
                      <rect x="20" y="45" width="6" height="6" fill="#000" />
                      <rect x="15" y="55" width="6" height="6" fill="#000" />
                      <rect x="25" y="35" width="6" height="6" fill="#000" />
                      <rect x="30" y="50" width="6" height="6" fill="#000" />
                      
                      <rect x="75" y="35" width="6" height="6" fill="#000" />
                      <rect x="85" y="45" width="6" height="6" fill="#000" />
                      <rect x="80" y="55" width="6" height="6" fill="#000" />
                      <rect x="70" y="50" width="6" height="6" fill="#000" />
                      
                      <rect x="35" y="75" width="6" height="6" fill="#000" />
                      <rect x="45" y="70" width="6" height="6" fill="#000" />
                      <rect x="55" y="85" width="6" height="6" fill="#000" />
                      <rect x="35" y="85" width="6" height="6" fill="#000" />
                      <rect x="50" y="80" width="6" height="6" fill="#000" />
                      <rect x="60" y="75" width="6" height="6" fill="#000" />
                      
                      <rect x="75" y="75" width="6" height="6" fill="#000" />
                      <rect x="85" y="70" width="6" height="6" fill="#000" />
                      <rect x="80" y="85" width="6" height="6" fill="#000" />
                    </svg>
                  </div>

                  <div className="space-y-2 max-w-sm mx-auto font-poppins text-sm text-zinc-650 dark:text-gray-400">
                    <p>Payee: <span className="font-bold text-black dark:text-white">REDSEE CLOTHING</span></p>
                    <p>UPI ID: <span className="font-mono font-bold text-[#ff0033]">redsee@upi</span></p>
                    <p className="text-xs text-zinc-400 dark:text-gray-500 mt-2">Scan the QR code with any UPI app (PhonePe, Google Pay, Paytm, Bhim) and complete the transfer.</p>
                  </div>

                  <div className="border-t border-zinc-200 dark:border-white/5 pt-6 text-left max-w-sm mx-auto">
                    <label className="block text-xs font-montserrat text-zinc-500 dark:text-gray-400 uppercase tracking-wider mb-2">12-digit UTR / UPI Transaction Reference</label>
                    <input 
                      required 
                      type="text" 
                      maxLength={12}
                      placeholder="e.g. 518392019482" 
                      value={transactionRef} 
                      onChange={(e) => setTransactionRef(e.target.value.replace(/\D/g, ''))} 
                      className="w-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/20 p-3 text-black dark:text-white focus:border-[#ff0033] focus:outline-none transition-colors font-mono tracking-widest text-center" 
                    />
                    <p className="text-[10px] text-zinc-400 dark:text-gray-500 mt-1">Please enter the correct 12-digit numerical reference code to speed up verification.</p>
                  </div>
                </div>

                <div className="flex space-x-4 mt-8">
                  <button type="button" onClick={() => setStep(2)} className="w-1/3 border border-zinc-300 dark:border-white/20 text-zinc-700 dark:text-white py-4 font-montserrat uppercase tracking-wider font-bold text-sm hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors" disabled={verifying}>
                    Back
                  </button>
                  <button type="submit" className="w-2/3 bg-black dark:bg-white text-white dark:text-black py-4 font-montserrat uppercase tracking-wider font-bold text-sm hover:bg-[#ff0033] dark:hover:bg-[#ff0033] hover:text-white dark:hover:text-white transition-colors flex items-center justify-center space-x-2" disabled={verifying}>
                    {verifying ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></span>
                        <span>Verifying reference...</span>
                      </>
                    ) : (
                      <span>Confirm & Verify Payment</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-white/5 p-6 sticky top-24 shadow-sm dark:shadow-none transition-colors duration-300">
              <h3 className="text-xl font-bebas tracking-wide text-black dark:text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="w-16 h-20 bg-zinc-100 dark:bg-zinc-850 rounded border border-zinc-200 dark:border-white/5 overflow-hidden">
                      <img src={optimizeImageUrl(item.image, 160)} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-poppins text-black dark:text-white line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-zinc-500 dark:text-gray-500 font-poppins mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                      <p className="text-sm font-poppins font-bold text-black dark:text-white mt-1">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-200 dark:border-white/10 pt-4 space-y-3 mb-4">
                <div className="flex justify-between text-sm font-poppins text-zinc-650 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-poppins text-zinc-650 dark:text-gray-300">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-poppins text-zinc-650 dark:text-gray-300">
                  <span>Tax (8%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-zinc-200 dark:border-white/10 pt-3 flex justify-between font-poppins font-bold text-black dark:text-white text-lg">
                  <span>Total</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-gray-500 mt-6">
                <Lock size={14} />
                <span className="text-xs font-poppins">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
