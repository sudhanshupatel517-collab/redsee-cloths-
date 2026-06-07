'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, Archive, Tags, BadgePercent, Headphones, CalendarDays, Sparkles, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user || !['admin', 'coadmin'].includes(user.role)) {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user || !['admin', 'coadmin'].includes(user.role)) return null;

  const isAdmin = user.role === 'admin';

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      {/* Mobile Admin Header Bar */}
      <header className="md:hidden sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-white/5 flex items-center justify-between px-4 py-3">
        <h2 className={`text-xl font-bebas tracking-widest ${isAdmin ? 'text-[#ff0033]' : 'text-blue-500'}`}>
          {isAdmin ? 'ADMIN PANEL' : 'STAFF PANEL'}
        </h2>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="text-foreground p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile Drawer (Menu overlay) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex md:hidden"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            
            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-[280px] bg-zinc-950 h-full border-r border-zinc-200 dark:border-white/10 flex flex-col p-6 overflow-y-auto text-white z-10"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-2xl font-bebas tracking-widest ${isAdmin ? 'text-[#ff0033]' : 'text-blue-500'}`}>
                  {isAdmin ? 'ADMIN' : 'STAFF'} MENU
                </h2>
                <button onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-4" onClick={() => setMobileMenuOpen(false)}>
                <Link href="/admin" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
                  <LayoutDashboard size={20} className="mr-3" /> Dashboard
                </Link>
                {(isAdmin || user.permissions?.includes('manage_products')) && (
                  <Link href="/admin/products" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
                    <Package size={20} className="mr-3" /> Products
                  </Link>
                )}
                {(isAdmin || user.permissions?.includes('manage_inventory')) && (
                  <Link href="/admin/inventory" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
                    <Archive size={20} className="mr-3" /> Inventory
                  </Link>
                )}
                {(isAdmin || user.permissions?.includes('manage_categories')) && (
                  <Link href="/admin/categories" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
                    <Tags size={20} className="mr-3" /> Categories
                  </Link>
                )}
                {(isAdmin || user.permissions?.includes('manage_events')) && (
                  <Link href="/admin/events" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
                    <CalendarDays size={20} className="mr-3" /> Events & Announcements
                  </Link>
                )}
                {(isAdmin || user.permissions?.includes('manage_banners') || user.permissions?.includes('manage_events')) && (
                  <Link href="/admin/banners" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
                    <Sparkles size={20} className="mr-3" /> Manage Banners
                  </Link>
                )}
                {(isAdmin || user.permissions?.includes('manage_orders')) && (
                  <Link href="/admin/orders" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
                    <ShoppingBag size={20} className="mr-3" /> Orders
                  </Link>
                )}
                {(isAdmin || user.permissions?.includes('manage_discounts')) && (
                  <Link href="/admin/discounts" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
                    <BadgePercent size={20} className="mr-3" /> Discounts
                  </Link>
                )}
                {(isAdmin || user.permissions?.includes('manage_support')) && (
                  <Link href="/admin/support" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
                    <Headphones size={20} className="mr-3" /> Support
                  </Link>
                )}
                {isAdmin && (
                  <>
                    <Link href="/admin/users" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
                      <Users size={20} className="mr-3" /> Staff Management
                    </Link>
                    <Link href="/admin/settings" className="flex items-center text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all">
                      <Settings size={20} className="mr-3" /> Settings
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
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
          {(isAdmin || user.permissions?.includes('manage_events')) && (
            <Link href="/admin/events" className="flex items-center text-foreground/70 hover:text-foreground hover:bg-foreground/5 p-3 rounded-lg transition-all">
              <CalendarDays size={20} className="mr-3" /> Events & Announcements
            </Link>
          )}
          {(isAdmin || user.permissions?.includes('manage_banners') || user.permissions?.includes('manage_events')) && (
            <Link href="/admin/banners" className="flex items-center text-foreground/70 hover:text-foreground hover:bg-foreground/5 p-3 rounded-lg transition-all">
              <Sparkles size={20} className="mr-3" /> Manage Banners
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
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
