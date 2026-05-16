'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function StaffDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <h1 className="text-3xl font-bebas tracking-widest text-white mb-8">STAFF OVERVIEW</h1>

      <div className="glassmorphism-dark p-6 rounded-xl border border-white/5 mb-8">
        <h2 className="text-xl font-bebas text-white mb-2">Welcome, {user?.name}</h2>
        <p className="text-gray-400">You have staff privileges. Here you can manage customer orders, update shipping statuses, and respond to support tickets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glassmorphism-dark p-6 rounded-xl border border-white/5">
          <h3 className="text-lg font-bebas text-white mb-4">Pending Orders</h3>
          <p className="text-3xl font-bold text-[#ff0033]">0</p>
          <button className="mt-4 text-sm text-gray-300 hover:text-white underline">View All</button>
        </div>
        
        <div className="glassmorphism-dark p-6 rounded-xl border border-white/5">
          <h3 className="text-lg font-bebas text-white mb-4">Active Support Tickets</h3>
          <p className="text-3xl font-bold text-blue-500">0</p>
          <button className="mt-4 text-sm text-gray-300 hover:text-white underline">Resolve Tickets</button>
        </div>
      </div>
    </div>
  );
}
