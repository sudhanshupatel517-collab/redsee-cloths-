'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { 
  Search, Filter, ChevronDown, ChevronUp, 
  Package, MapPin, Truck, Save, Phone, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminOrders() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Expandable Order ID
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Tracking Edit fields
  const [editingCourier, setEditingCourier] = useState('');
  const [editingTrackingId, setEditingTrackingId] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'amount_desc', 'amount_asc'

  useEffect(() => {
    if (!user || !['admin', 'coadmin'].includes(user.role)) {
      router.push('/admin');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await api.get('/api/orders', config);
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandOrder = (order: any) => {
    if (expandedOrderId === order._id) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(order._id);
      setEditingCourier(order.courier || '');
      setEditingTrackingId(order.trackingId || '');
    }
  };

  const handleUpdateTracking = async (orderId: string) => {
    try {
      setUpdatingOrderId(orderId);
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await api.put(`/api/orders/${orderId}`, { 
        courier: editingCourier, 
        trackingId: editingTrackingId 
      }, config);
      
      setOrders(orders.map(o => o._id === orderId ? data : o));
      alert('Tracking information updated successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating tracking information.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await api.put(`/api/orders/${orderId}`, { status: newStatus }, config);
      
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: data.orderStatus, isDelivered: data.isDelivered, deliveredAt: data.deliveredAt } : o));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating order status.');
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newPaymentStatus: string) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await api.put(`/api/orders/${orderId}`, { paymentStatus: newPaymentStatus }, config);
      
      setOrders(orders.map(o => o._id === orderId ? { ...o, paymentStatus: data.paymentStatus } : o));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating payment status.');
    }
  };

  const filteredOrders = orders
    .filter(o => {
      const matchesSearch = 
        o._id.toLowerCase().includes(search.toLowerCase()) || 
        (o.userId?.name && o.userId.name.toLowerCase().includes(search.toLowerCase())) ||
        (o.userId?.email && o.userId.email.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
      const matchesPaymentStatus = paymentStatusFilter === 'All' || (o.paymentStatus || 'Pending') === paymentStatusFilter;
      const matchesPaymentMethod = paymentMethodFilter === 'All' || o.paymentMethod === paymentMethodFilter;

      return matchesSearch && matchesStatus && matchesPaymentStatus && matchesPaymentMethod;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'amount_desc') return b.totalAmount - a.totalAmount;
      if (sortBy === 'amount_asc') return a.totalAmount - b.totalAmount;
      return 0;
    });

  const statuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
  const paymentStatuses = ['Pending', 'Completed', 'Failed', 'Refunded'];

  return (
    <div className="w-full py-4 text-foreground">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bebas text-black dark:text-white tracking-widest uppercase flex items-center">
              <ShoppingBag className="mr-3 text-[#ff0033]" /> Manage Orders
            </h1>
            <p className="text-zinc-550 dark:text-gray-400 font-poppins text-sm mt-1">View, track, and update customer order statuses.</p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3 text-black dark:text-white outline-none transition-colors font-poppins text-sm"
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg border transition-all font-montserrat text-sm tracking-widest uppercase cursor-pointer ${
              showFilters || statusFilter !== 'All' || paymentStatusFilter !== 'All' || paymentMethodFilter !== 'All'
                ? 'bg-[#ff0033]/15 border-[#ff0033]/30 text-[#ff0033]'
                : 'bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl backdrop-blur-md font-poppins">
                {/* Order Status Filter */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500 dark:text-gray-500 font-bold">Order Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none focus:border-[#ff0033] cursor-pointer font-poppins"
                  >
                    <option value="All">All Statuses</option>
                    {statuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Payment Status Filter */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500 dark:text-gray-500 font-bold">Payment Status</label>
                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none focus:border-[#ff0033] cursor-pointer font-poppins"
                  >
                    <option value="All">All Payments</option>
                    {paymentStatuses.map(ps => (
                      <option key={ps} value={ps}>{ps}</option>
                    ))}
                  </select>
                </div>

                {/* Payment Method Filter */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500 dark:text-gray-500 font-bold">Payment Method</label>
                  <select
                    value={paymentMethodFilter}
                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none focus:border-[#ff0033] cursor-pointer font-poppins"
                  >
                    <option value="All">All Methods</option>
                    <option value="Razorpay">Razorpay</option>
                    <option value="UPI">UPI</option>
                    <option value="COD">COD</option>
                  </select>
                </div>

                {/* Sorting */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500 dark:text-gray-500 font-bold">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-black dark:text-white outline-none focus:border-[#ff0033] cursor-pointer font-poppins"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="amount_desc">Highest Amount</option>
                    <option value="amount_asc">Lowest Amount</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile View: Order Cards */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="py-12 text-center text-zinc-550 dark:text-gray-500 font-poppins">
              <div className="flex flex-col items-center justify-center space-y-4">
                 <div className="w-8 h-8 border-2 border-[#ff0033] border-t-transparent rounded-full animate-spin"></div>
                 <p className="font-montserrat tracking-widest uppercase text-xs">Loading Orders...</p>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <p className="text-center py-8 text-zinc-500 dark:text-gray-500 font-poppins text-sm">No orders found.</p>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-4 flex flex-col space-y-3 shadow-sm dark:shadow-none font-poppins">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-zinc-800 dark:text-white">#{order._id.substring(0, 10).toUpperCase()}</p>
                    <p className="text-xs text-zinc-500 dark:text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right relative">
                    <div className="inline-block text-left relative">
                      <select 
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`appearance-none outline-none pl-3 pr-8 py-1.5 rounded-lg text-[10px] font-montserrat tracking-wider uppercase font-bold cursor-pointer transition-colors border ${
                          order.orderStatus === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' : 
                          order.orderStatus === 'Shipped' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20' : 
                          order.orderStatus === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' : 
                          'bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20'
                        }`}
                      >
                        {statuses.map(status => (
                          <option key={status} value={status} className="bg-background text-foreground">{status}</option>
                        ))}
                      </select>
                      <ChevronDown size={12} className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                        order.orderStatus === 'Delivered' ? 'text-green-500' : 
                        order.orderStatus === 'Shipped' ? 'text-blue-500' : 
                        order.orderStatus === 'Cancelled' ? 'text-red-500' : 
                        'text-orange-500'
                      }`} />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-150 dark:border-white/5 flex flex-col space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-zinc-800 dark:text-white font-medium">{order.userId?.name || 'Guest'}</p>
                      <p className="text-zinc-500 dark:text-gray-500">{order.userId?.email || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-500 dark:text-gray-500 font-montserrat uppercase tracking-wider text-[10px]">Total Amount</p>
                      <p className="text-zinc-800 dark:text-white font-bold text-sm">₹{order.totalAmount}</p>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-zinc-150 dark:border-white/5 flex justify-between items-center gap-2">
                    <div className="flex flex-col space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-montserrat uppercase font-bold text-zinc-700 dark:text-gray-300">{order.paymentMethod}</span>
                        {order.paymentMethod === 'UPI' && order.razorpayPaymentId && (
                          <span className="text-[9px] font-mono text-[#ff0033] bg-[#ff0033]/5 border border-[#ff0033]/15 px-1 py-0.5 rounded">
                            UTR: {order.razorpayPaymentId}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="relative inline-block">
                      <select 
                        value={order.paymentStatus || 'Pending'}
                        onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                        className={`appearance-none outline-none pl-2.5 pr-6 py-1 rounded text-[10px] font-montserrat uppercase font-bold cursor-pointer transition-colors border ${
                          order.paymentStatus === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' : 
                          order.paymentStatus === 'Failed' ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' : 
                          'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20'
                        }`}
                      >
                        {paymentStatuses.map(status => (
                          <option key={status} value={status} className="bg-background text-foreground">{status}</option>
                        ))}
                      </select>
                      <ChevronDown size={10} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${
                        order.paymentStatus === 'Completed' ? 'text-green-500' : 
                        order.paymentStatus === 'Failed' ? 'text-red-500' : 
                        'text-yellow-555'
                      }`} />
                    </div>
                  </div>

                  {/* Expand button */}
                  <div className="pt-2 border-t border-zinc-150 dark:border-white/5">
                    <button 
                      onClick={() => toggleExpandOrder(order)}
                      className="text-[#ff0033] font-montserrat uppercase text-[10px] font-bold tracking-wider hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 outline-none w-full justify-center"
                    >
                      <span>{expandedOrderId === order._id ? 'Hide details' : 'Show details'}</span>
                      {expandedOrderId === order._id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    </button>
                  </div>
                </div>

                {/* Mobile Expanded View */}
                {expandedOrderId === order._id && (
                  <div className="pt-4 border-t border-zinc-150 dark:border-white/5 space-y-5">
                    {/* Items List */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-montserrat uppercase font-bold tracking-wider text-[#ff0033] flex items-center gap-1.5">
                        <Package size={12} />
                        <span>Items List</span>
                      </p>
                      <div className="space-y-2">
                        {order.products?.map((item: any, idx: number) => {
                          const prod = item.product;
                          const displayTitle = prod?.name || 'Deleted Product';
                          const displayImg = prod?.images?.[0] ? (typeof prod.images[0] === 'string' ? prod.images[0] : prod.images[0].url) : '';
                          return (
                            <div key={idx} className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/5 rounded-lg">
                              <div className="flex items-center space-x-2.5">
                                <div className="w-10 h-13 bg-zinc-100 dark:bg-black/50 rounded overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-white/5">
                                  {displayImg ? (
                                    <img src={displayImg} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-400 dark:text-gray-600 font-bold font-montserrat">N/A</div>
                                  )}
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-zinc-800 dark:text-white max-w-[150px] truncate">{displayTitle}</p>
                                  <p className="text-[9px] text-zinc-500 dark:text-gray-500 mt-0.5">
                                    Size: {item.size || 'N/A'} | Color: {item.color || 'N/A'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-bold text-zinc-800 dark:text-white">₹{item.price}</p>
                                <p className="text-[9px] text-zinc-500 dark:text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-montserrat uppercase font-bold tracking-wider text-[#ff0033] flex items-center gap-1.5">
                        <MapPin size={12} />
                        <span>Shipping Details</span>
                      </p>
                      <div className="p-3 bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/5 rounded-lg space-y-1.5 text-[11px]">
                        <p className="font-semibold text-zinc-800 dark:text-white">{order.shippingAddress?.name || order.userId?.name}</p>
                        <p className="text-zinc-650 dark:text-gray-300 leading-relaxed">
                          {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}, {order.shippingAddress?.country}
                        </p>
                        {order.shippingAddress?.phone && (
                          <p className="text-zinc-650 dark:text-gray-300 flex items-center gap-1.5 pt-1.5 border-t border-zinc-200 dark:border-white/5 text-[10px]">
                            <Phone size={10} className="text-zinc-400 dark:text-gray-500" />
                            <span>{order.shippingAddress.phone}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Tracking details Form */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-montserrat uppercase font-bold tracking-wider text-[#ff0033] flex items-center gap-1.5">
                        <Truck size={12} />
                        <span>Delivery Tracking</span>
                      </p>
                      <div className="p-3 bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/5 rounded-lg space-y-3">
                        <div className="space-y-1.5">
                          <label className="block text-[8px] font-montserrat uppercase tracking-wider text-zinc-500 dark:text-gray-500 font-bold">Courier Partner</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Delhivery, Bluedart" 
                            value={editingCourier}
                            onChange={(e) => setEditingCourier(e.target.value)}
                            className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-black dark:text-white outline-none focus:border-[#ff0033] font-poppins"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[8px] font-montserrat uppercase tracking-wider text-zinc-500 dark:text-gray-500 font-bold">Tracking ID</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 123456789" 
                            value={editingTrackingId}
                            onChange={(e) => setEditingTrackingId(e.target.value)}
                            className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-black dark:text-white outline-none focus:border-[#ff0033] font-poppins"
                          />
                        </div>
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => handleUpdateTracking(order._id)}
                            disabled={updatingOrderId === order._id}
                            className="w-full bg-[#ff0033] hover:bg-[#cc0029] disabled:bg-zinc-700 text-white px-4 py-2 rounded-lg text-xs font-montserrat font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#ff0033]/15 active:scale-95 cursor-pointer border-none"
                          >
                            <Save size={12} />
                            <span>{updatingOrderId === order._id ? 'Saving...' : 'Save Tracking'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
          <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#161616] sticky top-0 z-10">
                  <th className="px-4 py-4 w-12 text-center"></th> {/* Expand Chevron */}
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium">Order ID</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium">Customer</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium">Date</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium">Payment</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium">Total</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-zinc-500 dark:text-gray-500 uppercase font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 dark:text-gray-500 font-poppins">
                      <div className="flex flex-col items-center justify-center space-y-4">
                         <div className="w-8 h-8 border-2 border-[#ff0033] border-t-transparent rounded-full animate-spin"></div>
                         <p className="font-montserrat tracking-widest uppercase text-xs">Loading Orders...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-zinc-500 dark:text-gray-500 font-poppins">No orders found.</td></tr>
                ) : (
                  filteredOrders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr className="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors border-b border-zinc-100 dark:border-white/5 font-poppins">
                        <td className="px-4 py-4 text-center">
                          <button 
                            onClick={() => toggleExpandOrder(order)}
                            className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer bg-transparent border-none outline-none"
                          >
                            {expandedOrderId === order._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </td>
                        <td 
                          className="px-6 py-4 text-sm font-semibold text-zinc-800 dark:text-white cursor-pointer"
                          onClick={() => toggleExpandOrder(order)}
                        >
                          {order._id.substring(0, 10).toUpperCase()}
                        </td>
                        <td 
                          className="px-6 py-4 cursor-pointer"
                          onClick={() => toggleExpandOrder(order)}
                        >
                          <p className="text-sm text-zinc-800 dark:text-white font-bold">{order.userId?.name || 'Guest'}</p>
                          <p className="text-xs text-zinc-500 dark:text-gray-500">{order.userId?.email || 'N/A'}</p>
                        </td>
                        <td 
                          className="px-6 py-4 text-sm text-zinc-650 dark:text-gray-400 cursor-pointer"
                          onClick={() => toggleExpandOrder(order)}
                        >
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-zinc-850 dark:text-gray-300">
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs font-montserrat uppercase font-bold text-zinc-700 dark:text-gray-300">{order.paymentMethod}</span>
                            {order.paymentMethod === 'UPI' && order.razorpayPaymentId && (
                              <span className="text-[10px] font-mono text-[#ff0033] bg-[#ff0033]/5 border border-[#ff0033]/15 px-1.5 py-0.5 rounded w-fit" title="UTR Reference">
                                UTR: {order.razorpayPaymentId}
                              </span>
                            )}
                            <div className="relative inline-block w-fit mt-1">
                              <select 
                                value={order.paymentStatus || 'Pending'}
                                onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                                className={`appearance-none outline-none pl-2.5 pr-6 py-0.5 rounded text-[10px] font-montserrat uppercase font-bold cursor-pointer transition-colors border ${
                                  order.paymentStatus === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' : 
                                  order.paymentStatus === 'Failed' ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' : 
                                  'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20'
                                }`}
                              >
                                {paymentStatuses.map(status => (
                                  <option key={status} value={status} className="bg-background text-foreground">{status}</option>
                                ))}
                              </select>
                              <ChevronDown size={10} className={`absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                                order.paymentStatus === 'Completed' ? 'text-green-500' : 
                                order.paymentStatus === 'Failed' ? 'text-red-500' : 
                                'text-yellow-555'
                              }`} />
                            </div>
                          </div>
                        </td>
                        <td 
                          className="px-6 py-4 text-sm font-semibold text-zinc-800 dark:text-white cursor-pointer"
                          onClick={() => toggleExpandOrder(order)}
                        >
                          ₹{order.totalAmount}
                        </td>
                        <td className="px-6 py-4 text-right relative">
                          <div className="inline-block text-left relative">
                            <select 
                              value={order.orderStatus}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`appearance-none outline-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-montserrat tracking-wider uppercase font-bold cursor-pointer transition-colors border ${
                                order.orderStatus === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' : 
                                order.orderStatus === 'Shipped' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20' : 
                                order.orderStatus === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' : 
                                'bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20'
                              }`}
                            >
                              {statuses.map(status => (
                                <option key={status} value={status} className="bg-background text-foreground">{status}</option>
                              ))}
                            </select>
                            <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                              order.orderStatus === 'Delivered' ? 'text-green-500' : 
                              order.orderStatus === 'Shipped' ? 'text-blue-500' : 
                              order.orderStatus === 'Cancelled' ? 'text-red-500' : 
                              'text-orange-500'
                            }`} />
                          </div>
                        </td>
                      </tr>
                      {expandedOrderId === order._id && (
                        <tr className="bg-zinc-550/[0.02] dark:bg-black/30">
                          <td colSpan={7} className="px-8 py-6 border-b border-zinc-200 dark:border-white/10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-black dark:text-white">
                              {/* Products List (Left Column) */}
                              <div className="space-y-4">
                                <h4 className="text-sm font-montserrat uppercase font-bold tracking-wider text-[#ff0033] flex items-center gap-2">
                                  <Package size={16} />
                                  <span>Items List</span>
                                </h4>
                                <div className="space-y-3">
                                  {order.products?.map((item: any, idx: number) => {
                                    const prod = item.product;
                                    const displayTitle = prod?.name || 'Deleted Product';
                                    const displayImg = prod?.images?.[0] ? (typeof prod.images[0] === 'string' ? prod.images[0] : prod.images[0].url) : '';
                                    return (
                                      <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl shadow-sm dark:shadow-none">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-12 h-15 bg-zinc-100 dark:bg-black/50 rounded overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-white/5">
                                            {displayImg ? (
                                              <img src={displayImg} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-450 dark:text-gray-500 font-bold font-montserrat">N/A</div>
                                            )}
                                          </div>
                                          <div>
                                            <p className="text-xs font-semibold text-zinc-800 dark:text-white max-w-xs truncate">{displayTitle}</p>
                                            <p className="text-[10px] text-zinc-500 dark:text-gray-500 mt-0.5">
                                              Size: <span className="font-bold text-zinc-700 dark:text-gray-300">{item.size || 'N/A'}</span> | Color: <span className="font-bold text-zinc-700 dark:text-gray-300">{item.color || 'N/A'}</span>
                                            </p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-xs font-bold text-zinc-800 dark:text-white">₹{item.price}</p>
                                          <p className="text-[10px] text-zinc-500 dark:text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Shipping Details & Tracking (Right Column) */}
                              <div className="space-y-6">
                                {/* Shipping Address */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-montserrat uppercase font-bold tracking-wider text-[#ff0033] flex items-center gap-2">
                                    <MapPin size={16} />
                                    <span>Shipping Details</span>
                                  </h4>
                                  <div className="p-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl space-y-2 text-xs shadow-sm dark:shadow-none">
                                    <p className="font-bold text-zinc-800 dark:text-white">{order.shippingAddress?.name || order.userId?.name}</p>
                                    <p className="text-zinc-650 dark:text-gray-300 leading-relaxed">
                                      {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}, {order.shippingAddress?.country}
                                    </p>
                                    {order.shippingAddress?.phone && (
                                      <p className="text-zinc-650 dark:text-gray-300 flex items-center gap-1.5 pt-1.5 border-t border-zinc-200 dark:border-white/5">
                                        <Phone size={12} className="text-zinc-400 dark:text-gray-500" />
                                        <span>{order.shippingAddress.phone}</span>
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Fulfillment & Tracking details form */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-montserrat uppercase font-bold tracking-wider text-[#ff0033] flex items-center gap-2">
                                    <Truck size={16} />
                                    <span>Delivery Tracking</span>
                                  </h4>
                                  <div className="p-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl space-y-4 shadow-sm dark:shadow-none">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500 dark:text-gray-500 font-bold">Courier Partner</label>
                                        <input 
                                          type="text" 
                                          placeholder="e.g. Delhivery, Bluedart" 
                                          value={editingCourier}
                                          onChange={(e) => setEditingCourier(e.target.value)}
                                          className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-3 py-1.5 text-xs text-black dark:text-white outline-none"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500 dark:text-gray-500 font-bold">Tracking ID</label>
                                        <input 
                                          type="text" 
                                          placeholder="e.g. 1234567890" 
                                          value={editingTrackingId}
                                          onChange={(e) => setEditingTrackingId(e.target.value)}
                                          className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-3 py-1.5 text-xs text-black dark:text-white outline-none"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex justify-end pt-1">
                                      <button
                                        onClick={() => handleUpdateTracking(order._id)}
                                        disabled={updatingOrderId === order._id}
                                        className="bg-[#ff0033] hover:bg-[#cc0029] disabled:bg-zinc-700 text-white px-5 py-2.5 rounded-lg text-xs font-montserrat font-bold tracking-widest uppercase transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,0,51,0.2)] active:scale-95 cursor-pointer border-none"
                                      >
                                        <Save size={12} />
                                        <span>{updatingOrderId === order._id ? 'Saving...' : 'Save Tracking'}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
