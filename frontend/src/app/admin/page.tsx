'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { TrendingUp, Package, Users, ShoppingBag } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/admin/stats', config);
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (user?.token) fetchStats();
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bebas tracking-widest text-white mb-8">DASHBOARD OVERVIEW</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glassmorphism-dark p-6 rounded-xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-montserrat text-sm uppercase">Total Revenue</h3>
            <TrendingUp className="text-[#ff0033]" size={24} />
          </div>
          <p className="text-3xl font-bebas text-white">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
        </div>
        
        <div className="glassmorphism-dark p-6 rounded-xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-montserrat text-sm uppercase">Orders</h3>
            <ShoppingBag className="text-blue-500" size={24} />
          </div>
          <p className="text-3xl font-bebas text-white">{stats?.totalOrders || 0}</p>
        </div>

        <div className="glassmorphism-dark p-6 rounded-xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-montserrat text-sm uppercase">Products</h3>
            <Package className="text-green-500" size={24} />
          </div>
          <p className="text-3xl font-bebas text-white">{stats?.totalProducts || 0}</p>
        </div>

        <div className="glassmorphism-dark p-6 rounded-xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-montserrat text-sm uppercase">Users</h3>
            <Users className="text-purple-500" size={24} />
          </div>
          <p className="text-3xl font-bebas text-white">{stats?.totalUsers || 0}</p>
        </div>
      </div>

      <div className="glassmorphism-dark p-6 rounded-xl border border-white/5">
         <h2 className="text-xl font-bebas text-white mb-4">RECENT ACTIVITY</h2>
         <p className="text-gray-400">System is running normally. No recent critical alerts.</p>
      </div>
    </div>
  );
}
