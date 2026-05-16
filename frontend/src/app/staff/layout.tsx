'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag } from 'lucide-react';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user || (user.role !== 'coadmin' && user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || (user.role !== 'coadmin' && user.role !== 'admin')) return null;

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-64 glassmorphism-dark border-r border-white/10 hidden md:flex flex-col p-6">
        <h2 className="text-2xl font-bebas text-blue-500 tracking-widest mb-8">STAFF PORTAL</h2>
        
        <nav className="flex-1 space-y-4">
          <Link href="/staff" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
            <LayoutDashboard size={20} className="mr-3" /> Dashboard
          </Link>
          <Link href="/staff/orders" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
            <ShoppingBag size={20} className="mr-3" /> Manage Orders
          </Link>
          <Link href="/staff/support" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
            <Package size={20} className="mr-3" /> Customer Support
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
