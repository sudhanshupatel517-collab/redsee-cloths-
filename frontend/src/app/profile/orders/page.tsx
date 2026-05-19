'use client';

import { useState } from 'react';
import { Package, Truck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bebas text-white tracking-widest uppercase mb-1">My Orders</h1>
      <p className="text-gray-400 font-poppins text-sm mb-8">Track, return, or buy items again.</p>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-white/10 mb-6">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-sm font-montserrat font-bold tracking-widest uppercase transition-colors relative ${activeTab === 'active' ? 'text-[#ff0033]' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Active Orders
          {activeTab === 'active' && <motion.div layoutId="orderTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff0033]" />}
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`pb-3 text-sm font-montserrat font-bold tracking-widest uppercase transition-colors relative ${activeTab === 'past' ? 'text-[#ff0033]' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Past Orders
          {activeTab === 'past' && <motion.div layoutId="orderTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff0033]" />}
        </button>
        <button 
          onClick={() => setActiveTab('returns')}
          className={`pb-3 text-sm font-montserrat font-bold tracking-widest uppercase transition-colors relative ${activeTab === 'returns' ? 'text-[#ff0033]' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Returns
          {activeTab === 'returns' && <motion.div layoutId="orderTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff0033]" />}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <Package size={32} className="text-gray-600" />
        </div>
        <h3 className="text-white font-montserrat font-bold text-lg mb-2">No orders found</h3>
        <p className="text-gray-500 font-poppins text-sm max-w-sm">Looks like you haven't placed any orders yet. Start exploring our collections!</p>
        <button className="mt-6 border border-[#ff0033] text-[#ff0033] hover:bg-[#ff0033] hover:text-white px-8 py-3 rounded-lg font-montserrat font-bold text-sm tracking-widest uppercase transition-colors">
          Start Shopping
        </button>
      </div>
    </div>
  );
}
