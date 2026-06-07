'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingCart, User, Heart, Sun, Moon, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems) || [];
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = resolvedTheme || 'dark';

  // Do not show bottom nav on admin routes, auth, or checkout pages
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/auth') || pathname?.startsWith('/checkout')) {
    return null;
  }

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Category', path: '/categories', icon: LayoutGrid },
    { name: 'Orders', path: '/profile/orders', icon: ClipboardList },
    { 
      name: 'Theme', 
      isAction: true,
      onClick: () => setTheme(currentTheme === 'dark' ? 'light' : 'dark'), 
      icon: currentTheme === 'dark' ? Sun : Moon 
    },
    { name: 'Cart', path: '/cart', icon: ShoppingCart, badge: cartItemCount },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/80 backdrop-blur-xl border-t border-zinc-200 dark:border-white/10 pb-safe text-foreground">
      <nav className="flex justify-around items-center px-2 py-3">
        {navItems.map((item) => {
          const isActive = !item.isAction && (pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path)));
          const Icon = item.icon;

          const content = (
            <>
              <div className="relative">
                <Icon 
                  size={22} 
                  className={`transition-colors duration-300 ${isActive ? 'text-[#ff0033]' : 'text-gray-500 hover:text-zinc-800 dark:hover:text-white'}`} 
                />
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute inset-0 bg-[#ff0033] blur-xl opacity-40 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-[#ff0033] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,0,51,0.5)]">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] mt-1 font-montserrat tracking-wider transition-colors duration-300 ${isActive ? 'text-black dark:text-white' : 'text-gray-500 hover:text-zinc-800 dark:hover:text-white'}`}>
                {item.name}
              </span>
            </>
          );

          if (item.isAction) {
            if (!mounted) return <div key={item.name} className="w-20 h-12"></div>;
            return (
              <button 
                key={item.name} 
                onClick={item.onClick} 
                className="relative flex flex-col items-center justify-center w-full h-12 text-gray-500 active:scale-95 transition-transform"
              >
                {content}
              </button>
            );
          }

          return (
            <Link key={item.name} href={item.path} className="relative flex flex-col items-center justify-center w-full h-12">
              {content}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
