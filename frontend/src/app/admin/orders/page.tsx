'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { ShoppingBag, Search, Filter, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminOrders() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await api.put(`/api/orders/${orderId}`, { status: newStatus }, config);
      
      setOrders(orders.map(o => o._id === orderId ? data : o));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating order status. Do you have permissions?');
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(search.toLowerCase()) || 
    (o.userId?.name && o.userId.name.toLowerCase().includes(search.toLowerCase()))
  );

  const statuses = ['Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="w-full py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bebas text-foreground tracking-widest uppercase">Manage Orders</h1>
            <p className="text-foreground/60 font-poppins text-sm mt-1">View, track, and update customer order statuses.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-foreground/5 border border-border focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3 text-foreground outline-none transition-colors font-poppins text-sm"
            />
          </div>
          <button className="flex items-center justify-center space-x-2 bg-foreground/5 hover:bg-foreground/10 text-foreground px-6 py-3 rounded-lg border border-border transition-colors font-montserrat text-sm tracking-widest uppercase">
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>

        {/* Mobile View: Order Cards */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="py-12 text-center text-foreground/50 font-poppins">Loading Orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-foreground/50 font-poppins">No orders found.</div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="bg-foreground/5 border border-border rounded-xl p-4 flex flex-col space-y-3 shadow-sm dark:shadow-none">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-poppins font-bold text-foreground">#{order._id.substring(0, 10).toUpperCase()}</p>
                    <p className="text-xs text-foreground/50 font-poppins mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right relative">
                    <div className="inline-block text-left relative">
                      <select 
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`appearance-none outline-none pl-3 pr-8 py-1 rounded-lg text-[10px] font-montserrat tracking-wider uppercase font-bold cursor-pointer transition-colors border ${
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

                <div className="pt-2 border-t border-border/50 flex justify-between items-center text-xs">
                  <div>
                    <p className="text-foreground/90 font-poppins font-medium">{order.userId?.name || 'Guest'}</p>
                    <p className="text-foreground/50 font-poppins">{order.userId?.email || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground/50 font-montserrat uppercase tracking-wider text-[10px]">Total Amount</p>
                    <p className="text-foreground font-poppins font-bold text-sm">₹{order.totalAmount}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block bg-foreground/5 border border-border rounded-xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-foreground/[0.02]">
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium">Order ID</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium">Customer</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium">Date</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium">Total</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-12 text-foreground/50 font-poppins">Loading Orders...</td></tr>
                ) : filteredOrders.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-foreground/50 font-poppins">No orders found.</td></tr>
                ) : (
                  filteredOrders.map((order) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={order._id} 
                      className="hover:bg-foreground/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-poppins font-medium text-foreground">{order._id.substring(0, 10).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-foreground/90 font-poppins">{order.userId?.name || 'Guest'}</p>
                        <p className="text-xs text-foreground/50 font-poppins">{order.userId?.email || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70 font-poppins">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-poppins font-medium text-foreground">₹{order.totalAmount}</td>
                      <td className="px-6 py-4 text-right relative">
                        <div className="inline-block text-left group">
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
                    </motion.tr>
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
