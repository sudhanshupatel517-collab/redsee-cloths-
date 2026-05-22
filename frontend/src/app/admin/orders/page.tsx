'use client';

import { useState } from 'react';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminOrders() {
  const [search, setSearch] = useState('');

  // Mock orders for UI placeholder until backend is connected
  const mockOrders = [
    { _id: 'ORD-7739', customer: 'Aryan Sharma', date: '2026-05-22', status: 'Processing', total: 4999 },
    { _id: 'ORD-7738', customer: 'Riya Gupta', date: '2026-05-21', status: 'Shipped', total: 2499 },
    { _id: 'ORD-7737', customer: 'Kabir Singh', date: '2026-05-20', status: 'Delivered', total: 8999 },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
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

        <div className="bg-foreground/5 border border-border rounded-xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-foreground/[0.02]">
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium">Order ID</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium">Customer</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium">Date</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium">Status</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockOrders.map((order) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={order._id} 
                    className="hover:bg-foreground/[0.02] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-poppins font-medium text-foreground">{order._id}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70 font-poppins">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70 font-poppins">{order.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-montserrat tracking-wider uppercase ${
                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                        order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                        'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-poppins font-medium text-foreground text-right">₹{order.total}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
