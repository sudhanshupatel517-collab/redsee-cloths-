'use client';

import { useState, useEffect } from 'react';
import { Package, Truck, Calendar, CreditCard, ChevronRight, RefreshCw, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Link from 'next/link';

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

interface Order {
  _id: string;
  createdAt: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  products: OrderItem[];
  trackingId?: string;
  courier?: string;
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/api/orders/myorders');
      setOrders(data);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Filter orders by tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'active') {
      return !['Delivered', 'Cancelled'].includes(order.orderStatus);
    } else if (activeTab === 'past') {
      return order.orderStatus === 'Delivered';
    } else { // returns refunds/returns
      return order.orderStatus === 'Cancelled' || order.paymentStatus === 'Refunded';
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Confirmed':
      case 'Packed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl md:text-3xl font-bebas text-black dark:text-white tracking-widest uppercase">My Orders</h1>
        <button 
          onClick={fetchOrders} 
          disabled={loading}
          className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-500 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-lg transition-colors border border-zinc-200 dark:border-white/5 active:scale-95 disabled:opacity-50"
          title="Refresh orders"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <p className="text-zinc-500 dark:text-gray-400 font-poppins text-sm mb-8">Track, return, or buy items again.</p>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-zinc-200 dark:border-white/10 mb-6">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-sm font-montserrat font-bold tracking-widest uppercase transition-colors relative ${activeTab === 'active' ? 'text-[#ff0033]' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-gray-300'}`}
        >
          Active Orders
          {activeTab === 'active' && <motion.div layoutId="orderTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff0033]" />}
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`pb-3 text-sm font-montserrat font-bold tracking-widest uppercase transition-colors relative ${activeTab === 'past' ? 'text-[#ff0033]' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-gray-300'}`}
        >
          Past Orders
          {activeTab === 'past' && <motion.div layoutId="orderTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff0033]" />}
        </button>
        <button 
          onClick={() => setActiveTab('returns')}
          className={`pb-3 text-sm font-montserrat font-bold tracking-widest uppercase transition-colors relative ${activeTab === 'returns' ? 'text-[#ff0033]' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-gray-300'}`}
        >
          Returns & Cancelled
          {activeTab === 'returns' && <motion.div layoutId="orderTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff0033]" />}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-2 border-[#ff0033] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 border border-red-500/10 bg-red-500/5 rounded-2xl max-w-md mx-auto px-6">
          <p className="text-red-400 font-poppins text-sm mb-4">{error}</p>
          <button onClick={fetchOrders} className="bg-red-500 hover:bg-red-600 text-white font-montserrat font-bold tracking-wider uppercase text-xs px-6 py-2.5 rounded-lg transition-colors">
            Try Again
          </button>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div 
              key={order._id} 
              className="bg-white dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 md:p-6 hover:bg-zinc-50 dark:hover:bg-white/[0.02] shadow-sm dark:shadow-none transition-colors duration-300"
            >
              {/* Header: Date, Amount, Status */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-zinc-200 dark:border-white/5 gap-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center text-xs text-zinc-500 dark:text-gray-400 font-poppins">
                    <Calendar size={14} className="mr-2 text-zinc-400 dark:text-gray-500" />
                    <span className="font-bold text-black dark:text-white mr-1">Ordered:</span> {formatDate(order.createdAt)}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-gray-400 font-poppins">
                    <span className="font-bold text-black dark:text-white mr-1">Order ID:</span>
                    <span className="font-mono text-zinc-500">{order._id.substring(0, 10)}...</span>
                  </div>
                  <div className="flex items-center text-xs text-zinc-500 dark:text-gray-400 font-poppins">
                    <CreditCard size={14} className="mr-2 text-zinc-400 dark:text-gray-500" />
                    <span className="font-bold text-black dark:text-white mr-1">Paid via:</span> {order.paymentMethod}
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-start md:self-auto">
                  <span className={`text-[10px] font-montserrat uppercase font-bold px-2.5 py-1 rounded-full border ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span className={`text-[10px] font-montserrat uppercase font-bold px-2.5 py-1 rounded-full border ${order.paymentStatus === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="py-4 space-y-4">
                {order.products.map((item, idx) => {
                  const firstImg = item.product?.images?.[0];
                  const itemImage = typeof firstImg === 'string' ? firstImg : (firstImg?.url || '/logo(4).png');
                  const itemTitle = item.product?.name || 'Unknown Product';
                  const itemLink = item.product ? `/product/${item.product._id}` : '#';
 
                  return (
                    <div key={idx} className="flex items-start md:items-center space-x-4">
                      <div className="w-16 h-20 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={itemImage} alt={itemTitle} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-poppins font-bold text-black dark:text-white line-clamp-1 hover:text-[#ff0033] dark:hover:text-[#ff0033] transition-colors">
                          <Link href={itemLink}>{itemTitle}</Link>
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-gray-400 font-poppins mt-1">
                          Size: <span className="text-black dark:text-white font-bold mr-3">{item.size}</span>
                          Color: <span className="text-black dark:text-white font-bold mr-3">{item.color}</span>
                          Qty: <span className="text-black dark:text-white font-bold">{item.quantity}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-poppins font-bold text-black dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                        <p className="text-[10px] text-zinc-400 dark:text-gray-500 font-poppins">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer: Tracking info & Total */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-zinc-200 dark:border-white/5 gap-4">
                <div>
                  {order.trackingId && (
                    <div className="flex items-center text-xs text-zinc-650 dark:text-gray-400 font-poppins bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 px-3 py-1.5 rounded-lg w-fit">
                      <Truck size={14} className="mr-2 text-[#ff0033]" />
                      <span>Track via <span className="text-black dark:text-white font-bold">{order.courier || 'Express'}</span>: </span>
                      <span className="text-black dark:text-white font-bold ml-1 font-mono">{order.trackingId}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-baseline space-x-2 self-end sm:self-auto">
                  <span className="text-xs text-zinc-500 font-poppins uppercase tracking-wider">Grand Total:</span>
                  <span className="text-xl font-poppins font-bold text-black dark:text-white">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-zinc-200 dark:border-white/5 bg-white dark:bg-white/[0.01] rounded-3xl p-8 max-w-2xl mx-auto shadow-sm dark:shadow-none transition-colors duration-300">
          <div className="w-20 h-20 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Package size={32} className="text-zinc-500 dark:text-gray-600" />
          </div>
          <h3 className="text-black dark:text-white font-montserrat font-bold text-lg mb-2">No orders found</h3>
          <p className="text-zinc-500 dark:text-gray-500 font-poppins text-sm max-w-sm">
            {activeTab === 'active' 
              ? "Looks like you don't have any active orders right now."
              : activeTab === 'past'
              ? "You don't have any past orders yet."
              : "No returned or cancelled orders found."}
          </p>
          <Link href="/shop" className="mt-6 border border-[#ff0033] text-[#ff0033] hover:bg-[#ff0033] hover:text-white px-8 py-3 rounded-lg font-montserrat font-bold text-sm tracking-widest uppercase transition-colors">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
