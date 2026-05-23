'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Package, 
  Heart, 
  Gift, 
  HeadphonesIcon, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';

export default function ProfileDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth');
  };

  const menuGroups = [
    {
      title: 'My Account',
      items: [
        { name: 'Personal Details', href: '/profile/details', icon: User, desc: 'Update your name, email, and phone' },
        { name: 'Saved Addresses', href: '/profile/details', icon: MapPin, desc: 'Manage shipping addresses' },
      ]
    },
    {
      title: 'Shopping',
      items: [
        { name: 'My Orders', href: '/profile/orders', icon: Package, desc: 'Track, return, or buy things again' },
        { name: 'Wishlist', href: '/profile/wishlist', icon: Heart, desc: 'Your saved items' },
        { name: 'Redsee Rewards', href: '/profile/rewards', icon: Gift, desc: 'View your points and tiers' },
      ]
    },
    {
      title: 'Preferences & Support',
      items: [
        { name: 'Account Settings', href: '/profile/settings', icon: Settings, desc: 'Security, passwords, notifications' },
        { name: 'Customer Care', href: '/profile/support', icon: HeadphonesIcon, desc: 'Help center and support tickets' },
      ]
    }
  ];

  return (
    <div className="pb-24 md:pb-0">
      <div className="mb-6 md:mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bebas text-white tracking-widest uppercase">Dashboard</h1>
          <p className="text-gray-400 font-poppins text-sm mt-1">Welcome back, {user?.name?.split(' ')[0] || 'User'}</p>
        </div>
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#ff0033] to-[#7a0000] border-2 border-[#ff0033]/50 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(255,0,51,0.2)]">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-bebas text-white text-xl md:text-3xl tracking-widest">{user?.name?.charAt(0) || 'U'}</span>
          )}
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link href="/profile/orders" className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:bg-white/[0.05] transition-colors flex flex-col items-center justify-center text-center group">
          <Package size={24} className="text-[#ff0033] mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-bebas text-xl text-white tracking-widest">Orders</span>
          <span className="text-xs font-poppins text-gray-500">Track & Returns</span>
        </Link>
        <Link href="/profile/wishlist" className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:bg-white/[0.05] transition-colors flex flex-col items-center justify-center text-center group">
          <Heart size={24} className="text-[#ff0033] mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-bebas text-xl text-white tracking-widest">Wishlist</span>
          <span className="text-xs font-poppins text-gray-500">View Saved</span>
        </Link>
      </div>

      <div className="space-y-6">
        {menuGroups.map((group, i) => (
          <div key={i}>
            <h3 className="text-[10px] md:text-xs font-montserrat uppercase tracking-widest font-bold text-gray-500 mb-3 px-1">{group.title}</h3>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
              {group.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={idx}
                    href={item.href}
                    className={`flex items-center p-4 hover:bg-white/5 transition-colors active:bg-white/10 ${idx !== group.items.length - 1 ? 'border-b border-white/5' : ''}`}
                  >
                    <div className="bg-white/5 p-2.5 rounded-xl mr-4 text-gray-400">
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-montserrat text-sm font-bold text-white mb-0.5">{item.name}</h4>
                      <p className="font-poppins text-[10px] text-gray-500">{item.desc}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-600" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout & Meta */}
      <div className="mt-8 pt-6 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full bg-white/5 hover:bg-[#ff0033]/10 hover:text-[#ff0033] border border-white/10 hover:border-[#ff0033]/30 text-white py-4 rounded-xl font-montserrat uppercase tracking-wider font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>

        <div className="mt-6 flex flex-col items-center justify-center space-y-2 text-gray-600">
          <div className="flex items-center space-x-1">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-poppins uppercase tracking-wider">Secure Account</span>
          </div>
          <span className="text-[10px] font-poppins">Redsee v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
