'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, Archive, Tags, BadgePercent, Headphones } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user || !['admin', 'coadmin'].includes(user.role)) {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user || !['admin', 'coadmin'].includes(user.role)) return null;

  const isAdmin = user.role === 'admin';

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 glassmorphism-dark border-r border-border hidden md:flex flex-col p-6">
        <h2 className={`text-2xl font-bebas tracking-widest mb-8 ${isAdmin ? 'text-[#ff0033]' : 'text-blue-500'}`}>
          {isAdmin ? 'ADMIN PANEL' : 'STAFF PANEL'}
        </h2>
        
        <nav className="flex-1 space-y-4">
          <Link href="/admin" className="flex items-center text-foreground/70 hover:text-foreground hover:bg-foreground/5 p-3 rounded-lg transition-all">
            <LayoutDashboard size={20} className="mr-3" /> Dashboard
          </Link>
          {(isAdmin || user.permissions?.includes('manage_products')) && (
            <Link href="/admin/products" className="flex items-center text-foreground/70 hover:text-foreground hover:bg-foreground/5 p-3 rounded-lg transition-all">
              <Package size={20} className="mr-3" /> Products
            </Link>
          )}
          {(isAdmin || user.permissions?.includes('manage_inventory')) && (
            <Link href="/admin/inventory" className="flex items-center text-foreground/70 hover:text-foreground hover:bg-foreground/5 p-3 rounded-lg transition-all">
              <Archive size={20} className="mr-3" /> Inventory
            </Link>
          )}
          {(isAdmin || user.permissions?.includes('manage_categories')) && (
            <Link href="/admin/categories" className="flex items-center text-foreground/70 hover:text-foreground hover:bg-foreground/5 p-3 rounded-lg transition-all">
              <Tags size={20} className="mr-3" /> Categories
            </Link>
          )}
          {(isAdmin || user.permissions?.includes('manage_orders')) && (
            <Link href="/admin/orders" className="flex items-center text-foreground/70 hover:text-foreground hover:bg-foreground/5 p-3 rounded-lg transition-all">
              <ShoppingBag size={20} className="mr-3" /> Orders
            </Link>
          )}
          {(isAdmin || user.permissions?.includes('manage_discounts')) && (
            <Link href="/admin/discounts" className="flex items-center text-foreground/70 hover:text-foreground hover:bg-foreground/5 p-3 rounded-lg transition-all">
              <BadgePercent size={20} className="mr-3" /> Discounts
            </Link>
          )}
          {(isAdmin || user.permissions?.includes('manage_support')) && (
            <Link href="/admin/support" className="flex items-center text-foreground/70 hover:text-foreground hover:bg-foreground/5 p-3 rounded-lg transition-all">
              <Headphones size={20} className="mr-3" /> Support
            </Link>
          )}
          {isAdmin && (
            <>
              <Link href="/admin/users" className="flex items-center text-foreground/70 hover:text-foreground hover:bg-foreground/5 p-3 rounded-lg transition-all">
                <Users size={20} className="mr-3" /> Staff Management
              </Link>
              <Link href="/admin/settings" className="flex items-center text-foreground/70 hover:text-foreground hover:bg-foreground/5 p-3 rounded-lg transition-all">
                <Settings size={20} className="mr-3" /> Settings
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
