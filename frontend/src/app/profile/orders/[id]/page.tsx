'use client';

import { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import api from '@/lib/axios';
import { optimizeImageUrl } from '@/lib/image';
import Link from 'next/link';
import { 
  ChevronRight, 
  Calendar, 
  CreditCard, 
  Truck, 
  ArrowLeft, 
  Home, 
  User, 
  Phone, 
  MapPin, 
  Edit, 
  MessageCircle, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle,
  Copy,
  Check,
  Package,
  Info
} from 'lucide-react';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images?: any[];
  } | null;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface Order {
  _id: string;
  createdAt: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  products: OrderItem[];
  shippingAddress: ShippingAddress;
  trackingId?: string;
  courier?: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Address edit state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editForm, setEditForm] = useState<ShippingAddress>({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });
  const [updatingAddress, setUpdatingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Copy ID feedback state
  const [copied, setCopied] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/api/orders/${orderId}`);
      setOrder(data);
      if (data.shippingAddress) {
        setEditForm({
          name: data.shippingAddress.name || '',
          street: data.shippingAddress.street || '',
          city: data.shippingAddress.city || '',
          state: data.shippingAddress.state || '',
          zipCode: data.shippingAddress.zipCode || '',
          country: data.shippingAddress.country || 'India',
          phone: data.shippingAddress.phone || ''
        });
      }
    } catch (err: any) {
      console.error('Error fetching order details:', err);
      setError(err.response?.data?.message || 'Failed to fetch order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId && user) {
      fetchOrder();
    }
  }, [orderId, user]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name || !editForm.street || !editForm.city || !editForm.state || !editForm.zipCode || !editForm.phone) {
      setAddressError('Please fill in all required fields');
      return;
    }

    setUpdatingAddress(true);
    setAddressError(null);
    try {
      const { data } = await api.put(`/api/orders/${orderId}/address`, editForm);
      setOrder(data);
      setIsEditingAddress(false);
    } catch (err: any) {
      console.error('Error updating shipping address:', err);
      setAddressError(err.response?.data?.message || 'Failed to update address');
    } finally {
      setUpdatingAddress(false);
    }
  };

  const getStatusStepWeight = (status: string) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Confirmed': return 2;
      case 'Packed': return 2.5;
      case 'Shipped': return 3;
      case 'Out for Delivery': return 3.5;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  const getProgressPercentage = (status: string) => {
    const w = getStatusStepWeight(status);
    if (status === 'Cancelled') return 0;
    // Map weights (1 to 4) to percentages (0% to 100%)
    return ((w - 1) / 3) * 100;
  };

  const isOrderActive = order ? !['Delivered', 'Cancelled'].includes(order.orderStatus) : false;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <Loader2 className="animate-spin text-[#ff0033]" size={36} />
        <p className="text-xs text-zinc-500 font-poppins">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto py-16 px-6 text-center border border-red-500/10 bg-red-500/5 rounded-3xl font-poppins space-y-4">
        <AlertTriangle className="text-red-500 mx-auto" size={32} />
        <h3 className="font-montserrat font-bold text-base text-red-500">Error Occurred</h3>
        <p className="text-zinc-500 dark:text-gray-400 text-xs">{error || 'Order not found.'}</p>
        <button onClick={() => router.push('/profile/orders')} className="mt-4 border border-zinc-300 dark:border-white/10 hover:border-black text-black dark:text-white px-6 py-2.5 rounded-lg text-xs font-montserrat font-bold uppercase transition-all">
          Back to Orders
        </button>
      </div>
    );
  }

  // Calculate pricing breakdown
  const itemsPriceSum = order.products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryCharge = itemsPriceSum >= 999 ? 0 : 49;
  const promoDiscount = 0; // Mock discount

  return (
    <div className="w-full pb-20 text-zinc-800 dark:text-zinc-150 font-poppins">
      
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-[10px] md:text-xs text-zinc-500 uppercase font-montserrat font-semibold tracking-wider mb-6">
        <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
        <ChevronRight size={10} className="text-zinc-400" />
        <Link href="/profile" className="hover:text-black dark:hover:text-white transition-colors">My Account</Link>
        <ChevronRight size={10} className="text-zinc-400" />
        <Link href="/profile/orders" className="hover:text-black dark:hover:text-white transition-colors">My Orders</Link>
        <ChevronRight size={10} className="text-zinc-400" />
        <span className="text-black dark:text-white font-bold font-mono">#{order._id}</span>
      </div>

      <div className="flex items-center space-x-3 mb-6">
        <button 
          onClick={() => router.push('/profile/orders')}
          className="p-2 border border-zinc-200 dark:border-white/10 hover:border-black dark:hover:border-white rounded-xl text-zinc-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all bg-white dark:bg-transparent"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bebas text-black dark:text-white tracking-widest uppercase">Order Details</h1>
          <p className="text-[10px] md:text-xs text-zinc-500 font-poppins">Manage and track your delivery details</p>
        </div>
      </div>

      {/* Main Grid: Left for Products & Tracking, Right for Delivery Details & Price breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================== LEFT CONTENT (8/12 cols) ================== */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Products Details List */}
          <div className="bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 md:p-6 space-y-5 shadow-sm dark:shadow-none">
            {order.products.map((item, idx) => {
              const firstImg = item.product?.images?.[0];
              const itemImage = typeof firstImg === 'string' ? firstImg : (firstImg?.url || '/logo(4).png');
              const itemTitle = item.product?.name || 'Unknown Product';
              const itemLink = item.product ? `/product/${item.product._id}` : '#';

              return (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 last:pb-0 border-b last:border-b-0 border-zinc-200 dark:border-white/5 gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-20 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={optimizeImageUrl(itemImage, 160)} alt={itemTitle} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-poppins font-bold text-black dark:text-white line-clamp-1 hover:text-[#ff0033] dark:hover:text-[#ff0033] transition-colors">
                        <Link href={itemLink}>{itemTitle}</Link>
                      </h4>
                      <p className="text-[10px] text-zinc-400 dark:text-gray-500 font-montserrat uppercase mt-0.5">Seller: <span className="font-bold">REDSEE FASHION</span></p>
                      <p className="text-xs text-zinc-500 dark:text-gray-400 font-poppins mt-1">
                        Size: <span className="text-black dark:text-white font-bold mr-3">{item.size || 'N/A'}</span>
                        Color: <span className="text-black dark:text-white font-bold mr-3">{item.color || 'N/A'}</span>
                        Qty: <span className="text-black dark:text-white font-bold">{item.quantity}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-left sm:text-right w-full sm:w-auto flex sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                    <span className="text-base font-poppins font-bold text-black dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-gray-500 font-poppins">₹{item.price.toFixed(2)} each</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stepper Timeline & Current Status message */}
          <div className="bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 md:p-6 shadow-sm dark:shadow-none">
            <h3 className="text-xs font-montserrat uppercase font-bold tracking-widest text-zinc-400 dark:text-gray-500 mb-6">Delivery Timeline</h3>
            
            {order.orderStatus === 'Cancelled' ? (
              <div className="space-y-4">
                {/* Cancelled Timeline */}
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 border-2 border-red-500 flex items-center justify-center font-bold text-xs shadow-[0_0_12px_rgba(239,68,68,0.2)]">
                    ×
                  </div>
                  <div>
                    <h4 className="text-xs font-montserrat uppercase font-bold tracking-wider text-red-500">Order Cancelled</h4>
                    <p className="text-[10px] font-poppins text-zinc-400 dark:text-zinc-500">Cancelled on {formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-xs text-zinc-650 dark:text-gray-400 font-poppins leading-relaxed">
                  Your order has been cancelled and any refund has been initiated back to the original source.
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Standard Stepper */}
                <div className="relative flex flex-col md:flex-row md:items-start justify-between space-y-6 md:space-y-0 py-2">
                  {/* Connecting Line for Desktop */}
                  <div className="hidden md:block absolute top-[15px] left-[10%] right-[10%] h-[2px] bg-zinc-200 dark:bg-white/10 -z-0">
                    <div 
                      className="h-full bg-[#ff0033] transition-all duration-500 shadow-[0_0_8px_rgba(255,0,51,0.5)]" 
                      style={{ width: `${getProgressPercentage(order.orderStatus)}%` }}
                    />
                  </div>
                  
                  {/* Connecting Line for Mobile */}
                  <div className="md:hidden absolute top-[15px] bottom-[15px] left-[15px] w-[2px] bg-zinc-200 dark:bg-white/10 -z-0">
                    <div 
                      className="w-full bg-[#ff0033] transition-all duration-500 shadow-[0_0_8px_rgba(255,0,51,0.5)]" 
                      style={{ height: `${getProgressPercentage(order.orderStatus)}%` }}
                    />
                  </div>

                  {/* Steps */}
                  {[
                    { label: 'Order Placed', desc: 'Order received', activeWeight: 1 },
                    { label: 'Confirmed', desc: 'Packed & ready', activeWeight: 2 },
                    { label: 'Shipped', desc: 'In transit', activeWeight: 3 },
                    { label: 'Delivered', desc: 'Delivered', activeWeight: 4 }
                  ].map((step, idx) => {
                    const currentWeight = getStatusStepWeight(order.orderStatus);
                    const isCompleted = currentWeight > step.activeWeight || order.orderStatus === 'Delivered';
                    const isCurrent = currentWeight === step.activeWeight && order.orderStatus !== 'Delivered';

                    return (
                      <div key={idx} className="flex md:flex-col items-center md:items-center text-left md:text-center relative z-10 flex-1 md:px-2">
                        {/* Circle */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-[#ff0033] border-[#ff0033] text-white shadow-[0_0_12px_rgba(255,0,51,0.4)]' 
                            : isCurrent 
                            ? 'bg-white dark:bg-zinc-900 border-[#ff0033] text-[#ff0033] shadow-[0_0_8px_rgba(255,0,51,0.2)]' 
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-gray-500'
                        }`}>
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        
                        {/* Step Details */}
                        <div className="ml-4 md:ml-0 md:mt-3">
                          <p className={`text-xs font-montserrat uppercase font-bold tracking-wider ${
                            isCompleted || isCurrent ? 'text-black dark:text-white' : 'text-zinc-400 dark:text-gray-500'
                          }`}>{step.label}</p>
                          <p className="text-[10px] font-poppins text-zinc-400 dark:text-zinc-500 mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tracking Code Details */}
                {order.trackingId && (
                  <div className="mt-4 p-4 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <Truck size={14} className="text-[#ff0033]" />
                      <span className="text-zinc-500">Shipped via <span className="font-bold text-black dark:text-white">{order.courier || 'Express Courier'}</span>:</span>
                      <span className="font-mono font-bold text-black dark:text-white">{order.trackingId}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stepper Footer Action and Copy Details */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl gap-4">
            
            {/* Copy ID */}
            <div className="flex items-center space-x-2 text-xs font-poppins">
              <span className="text-zinc-500">Order ID:</span>
              <span className="font-mono font-bold text-black dark:text-white">#{orderId}</span>
              <button 
                onClick={handleCopyId}
                className="p-1 hover:bg-zinc-200 dark:hover:bg-white/5 rounded transition-colors text-zinc-400 hover:text-black dark:hover:text-white"
                title="Copy Order ID"
              >
                {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
              </button>
            </div>

            {/* Redirection to support chat */}
            <Link 
              href={`/profile/support?orderId=${orderId}`}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-transparent hover:bg-zinc-150 dark:hover:bg-white/5 border border-zinc-200 dark:border-white/10 px-4 py-2.5 rounded-xl text-xs font-montserrat font-bold uppercase tracking-wider transition-colors cursor-pointer text-black dark:text-white"
            >
              <MessageCircle size={14} className="text-[#ff0033]" />
              <span>Chat with us</span>
            </Link>
          </div>

        </div>

        {/* ================== RIGHT CONTENT (4/12 cols) ================== */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Delivery Details Card */}
          <div className="bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 shadow-sm dark:shadow-none space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-white/5">
              <h3 className="text-xs font-montserrat uppercase font-bold tracking-widest text-zinc-500">Delivery Details</h3>
              {isOrderActive && (
                <button 
                  onClick={() => setIsEditingAddress(true)}
                  className="text-xs font-montserrat font-bold uppercase tracking-wide text-[#ff0033] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Edit size={12} />
                  <span>Change</span>
                </button>
              )}
            </div>

            <div className="space-y-3.5 text-xs text-zinc-650 dark:text-zinc-300">
              {/* Home / Address details */}
              <div className="flex items-start space-x-2">
                <Home size={15} className="text-[#ff0033] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-black dark:text-white flex items-center space-x-1.5">
                    <span>{order.shippingAddress?.name || 'Customer'}</span>
                    <span className="bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-gray-400 text-[8px] font-montserrat font-bold px-1.5 py-0.5 rounded uppercase">Home</span>
                  </p>
                  <p className="mt-1 leading-relaxed text-[11px]">
                    {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{order.shippingAddress?.country || 'India'}</p>
                </div>
              </div>

              {/* Mobile / Phone details */}
              {order.shippingAddress?.phone && (
                <div className="flex items-center space-x-2 pt-2 border-t border-zinc-200 dark:border-white/5 text-[11px]">
                  <Phone size={14} className="text-zinc-400 flex-shrink-0" />
                  <span className="font-bold text-black dark:text-white">{order.shippingAddress.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Details breakdown */}
          <div className="bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 shadow-sm dark:shadow-none space-y-4">
            <h3 className="text-xs font-montserrat uppercase font-bold tracking-widest text-zinc-500 pb-2 border-b border-zinc-200 dark:border-white/5">Price Details</h3>
            
            <div className="space-y-3.5 text-xs font-poppins">
              <div className="flex justify-between items-center text-zinc-550 dark:text-zinc-400">
                <span>Listing Price</span>
                <span className="font-semibold text-black dark:text-white">₹{itemsPriceSum.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-550 dark:text-zinc-400">
                <span>Special Price</span>
                <span className="font-semibold text-black dark:text-white">₹{itemsPriceSum.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-550 dark:text-zinc-400">
                <span>Delivery Fees</span>
                <span className={`font-semibold ${deliveryCharge === 0 ? 'text-green-500' : 'text-black dark:text-white'}`}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between items-center text-zinc-550 dark:text-zinc-400">
                  <span>Other Discount</span>
                  <span className="font-semibold text-green-500">-₹{promoDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3.5 border-t border-dashed border-zinc-200 dark:border-white/10 text-sm font-bold">
                <span className="text-black dark:text-white">Total Amount</span>
                <span className="text-black dark:text-white text-base">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method details */}
            <div className="bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 p-3.5 rounded-xl flex items-center justify-between text-xs font-poppins">
              <span className="text-zinc-500">Paid By</span>
              <div className="flex items-center space-x-1.5 font-bold text-black dark:text-white uppercase tracking-wider text-[10px]">
                <CreditCard size={12} className="text-[#ff0033]" />
                <span>{order.paymentMethod === 'COD' ? 'Cash On Delivery' : order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Offers Earned Collapsible Box */}
          <div className="bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none flex items-center justify-between text-xs text-zinc-650 dark:text-zinc-300">
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={15} className="text-green-500" />
              <span>Offers earned with this order</span>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase">1 Offer</span>
          </div>

        </div>

      </div>

      {/* ================== EDIT ADDRESS MODAL OVERLAY ================== */}
      {isEditingAddress && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-white/10 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar font-poppins">
            
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/5 pb-3">
              <h3 className="text-lg font-bebas text-black dark:text-white tracking-widest uppercase">Edit Shipping Details</h3>
              <button 
                onClick={() => { setIsEditingAddress(false); setAddressError(null); }}
                className="text-zinc-400 hover:text-black dark:hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>

            {addressError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center space-x-1.5">
                <AlertTriangle size={15} className="flex-shrink-0" />
                <span>{addressError}</span>
              </div>
            )}

            <form onSubmit={handleAddressSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Receiver Name</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-zinc-50 dark:bg-black/35 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-xl px-4 py-3 outline-none text-black dark:text-white text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Street Address</label>
                <input 
                  type="text" 
                  value={editForm.street}
                  onChange={(e) => setEditForm(prev => ({ ...prev, street: e.target.value }))}
                  className="w-full bg-zinc-50 dark:bg-black/35 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-xl px-4 py-3 outline-none text-black dark:text-white text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">City</label>
                  <input 
                    type="text" 
                    value={editForm.city}
                    onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-black/35 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-xl px-4 py-3 outline-none text-black dark:text-white text-sm"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">State</label>
                  <input 
                    type="text" 
                    value={editForm.state}
                    onChange={(e) => setEditForm(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-black/35 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-xl px-4 py-3 outline-none text-black dark:text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Zip Code / PIN Code</label>
                  <input 
                    type="text" 
                    value={editForm.zipCode}
                    onChange={(e) => setEditForm(prev => ({ ...prev, zipCode: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-black/35 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-xl px-4 py-3 outline-none text-black dark:text-white text-sm"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Country</label>
                  <input 
                    type="text" 
                    value={editForm.country}
                    onChange={(e) => setEditForm(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-black/35 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-xl px-4 py-3 outline-none text-black dark:text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Mobile Number</label>
                <input 
                  type="text" 
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-zinc-50 dark:bg-black/35 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-xl px-4 py-3 outline-none text-black dark:text-white text-sm"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-zinc-200 dark:border-white/5">
                <button 
                  type="button"
                  onClick={() => { setIsEditingAddress(false); setAddressError(null); }}
                  className="flex-1 bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 border border-zinc-200 dark:border-white/10 py-3 rounded-xl text-xs font-montserrat font-bold uppercase text-zinc-500 dark:text-gray-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={updatingAddress}
                  className="flex-1 bg-[#ff0033] hover:bg-[#cc0029] text-white py-3 rounded-xl text-xs font-montserrat font-bold uppercase tracking-wider flex justify-center items-center shadow-lg shadow-[#ff0033]/15 cursor-pointer"
                >
                  {updatingAddress && <Loader2 className="animate-spin mr-2" size={14} />}
                  <span>Save Shipping Details</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
