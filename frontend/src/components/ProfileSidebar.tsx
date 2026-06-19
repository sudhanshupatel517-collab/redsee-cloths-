'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/authSlice';
import { RootState } from '@/store/store';
import { motion } from 'framer-motion';
import { 
  User, 
  Package, 
  Heart, 
  Gift, 
  HeadphonesIcon, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';

const sidebarLinks = [
  { name: 'Dashboard', href: '/profile', icon: LayoutDashboard },
  { name: 'Personal Details', href: '/profile/details', icon: User },
  { name: 'Orders', href: '/profile/orders', icon: Package },
  { name: 'Wishlist', href: '/profile/wishlist', icon: Heart },
  { name: 'Rewards', href: '/profile/rewards', icon: Gift },
  { name: 'Customer Care', href: '/profile/support', icon: HeadphonesIcon },
  { name: 'Settings', href: '/profile/settings', icon: Settings },
];

export default function ProfileSidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* User Info Header */}
      <div className="flex items-center space-x-4 mb-8 p-4 bg-zinc-100 dark:bg-white/[0.02] rounded-xl border border-zinc-200 dark:border-white/5 shadow-inner">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#ff0033] to-[#7a0000] border-2 border-zinc-300 dark:border-white/10 flex items-center justify-center flex-shrink-0 relative group">
          {user?.avatar ? (
             <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
             <span className="font-bebas text-white text-xl tracking-widest">{user?.name?.charAt(0) || 'U'}</span>
          )}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
             <User size={16} className="text-white" />
          </div>
        </div>
        <div className="overflow-hidden">
          <h3 className="text-black dark:text-white font-montserrat font-bold truncate text-sm">{user?.name || 'User'}</h3>
          <p className="text-zinc-500 dark:text-gray-500 text-xs truncate font-poppins">{user?.email || ''}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={`relative flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-r from-[#ff0033]/20 to-transparent border border-[#ff0033]/30 shadow-[0_4px_12px_rgba(255,0,51,0.05)] dark:shadow-[0_0_15px_rgba(255,0,51,0.15)]' 
                  : 'hover:bg-zinc-100 dark:hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3 relative z-10">
                <Icon 
                  size={18} 
                  className={`transition-colors ${isActive ? 'text-[#ff0033]' : 'text-zinc-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white'}`} 
                />
                <span className={`font-montserrat text-sm tracking-wide transition-colors ${isActive ? 'text-[#ff0033] dark:text-white font-bold' : 'text-zinc-650 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white'}`}>
                  {link.name}
                </span>
              </div>
              
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff0033] rounded-l-lg shadow-[0_0_10px_#ff0033]"
                />
              )}
              
              <ChevronRight size={16} className={`transition-transform duration-300 ${isActive ? 'text-[#ff0033] translate-x-1' : 'text-gray-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-white/10">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-zinc-550 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.05] border border-transparent hover:border-zinc-200 dark:hover:border-white/10 transition-all group"
        >
          <LogOut size={18} className="group-hover:text-[#ff0033] transition-colors" />
          <span className="font-montserrat text-sm tracking-widest uppercase">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden flex items-center justify-between bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 p-4 rounded-xl mb-6 cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff0033] to-[#7a0000] flex items-center justify-center">
            <span className="font-bebas text-white tracking-widest">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <span className="text-black dark:text-white font-montserrat font-bold text-sm tracking-widest uppercase">
            {sidebarLinks.find(l => l.href === pathname)?.name || 'Dashboard'}
          </span>
        </div>
        <div className="text-zinc-500 dark:text-gray-400">
          {isMobileOpen ? <X size={20} /> : <ChevronRight size={20} className="transform transition-transform rotate-90" />}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full bg-white dark:bg-[#0c0c0c] border border-zinc-200 dark:border-white/10 rounded-2xl p-6 relative shadow-lg dark:shadow-2xl transition-colors duration-300">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <motion.div
        initial={false}
        animate={{ 
          height: isMobileOpen ? 'auto' : 0,
          opacity: isMobileOpen ? 1 : 0,
          marginTop: isMobileOpen ? '1rem' : 0
        }}
        className="md:hidden overflow-hidden bg-white dark:bg-[#0c0c0c] border border-zinc-200 dark:border-white/10 rounded-2xl px-4 transition-colors duration-300"
      >
        <div className="py-6">
          <SidebarContent />
        </div>
      </motion.div>
    </>
  );
}
