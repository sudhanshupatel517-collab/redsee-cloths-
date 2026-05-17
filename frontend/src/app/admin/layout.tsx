'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-64 glassmorphism-dark border-r border-white/10 hidden md:flex flex-col p-6">
        <h2 className="text-2xl font-bebas text-[#ff0033] tracking-widest mb-8">ADMIN PANEL</h2>
        
        <nav className="flex-1 space-y-4">
          <Link href="/admin" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
            <LayoutDashboard size={20} className="mr-3" /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
            <Package size={20} className="mr-3" /> Products
          </Link>
          <Link href="/admin/orders" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
            <ShoppingBag size={20} className="mr-3" /> Orders
          </Link>
          <Link href="/admin/users" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
            <Users size={20} className="mr-3" /> Users
          </Link>
          <Link href="/admin/settings" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
            <Settings size={20} className="mr-3" /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
