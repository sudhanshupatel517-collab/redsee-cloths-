'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthRoute = pathname === '/auth';
      const isCreatePasswordRoute = pathname === '/create-password';
      
      // Define routes that require authentication
      const isProtectedRoute = pathname?.startsWith('/profile') || 
                               pathname?.startsWith('/admin') || 
                               pathname?.startsWith('/checkout');
      
      if (!user && isProtectedRoute) {
        router.push('/auth');
      } else if (user) {
        const isStaff = user.role === 'admin' || user.role === 'coadmin';
        if (user.hasPassword === false && !isCreatePasswordRoute && !isStaff) {
          router.push('/create-password');
        } else if ((user.hasPassword !== false || isStaff) && isCreatePasswordRoute) {
          router.push('/');
        } else if (isAuthRoute) {
          if (user.role === 'admin' || user.role === 'coadmin') router.push('/admin');
          else router.push('/');
        }
      }
    };

    if (mounted) {
      checkAuth();
    }
  }, [user, pathname, router, mounted]);

  useEffect(() => {
    // Fetch latest profile to keep localStorage and DB perfectly synchronized
    const fetchLatestProfile = async () => {
      if (user && mounted) {
        try {
          // Dynamic import of api and dispatch to avoid circular dependencies in AuthGuard
          const { default: api } = await import('@/lib/axios');
          const { store } = await import('@/store/store');
          const { setCredentials } = await import('@/store/authSlice');
          
          const { data } = await api.get('/api/users/profile');
          // Update store if data changed (simple check using stringify to avoid infinite loops)
          if (JSON.stringify(data) !== JSON.stringify(user)) {
             store.dispatch(setCredentials({ ...user, ...data }));
          }
        } catch (err) {
          console.error("Failed to sync profile on load", err);
        }
      }
    };
    fetchLatestProfile();
  }, [mounted]);

  // Show a branded loading screen during hydration instead of a blank page
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-10 h-10 border-2 border-[#ff0033]/20 rounded-full"></div>
          <div className="absolute inset-0 w-10 h-10 border-2 border-[#ff0033] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <span className="text-white/40 text-xs font-montserrat tracking-[0.3em] uppercase">REDSEE</span>
      </div>
    );
  }

  // If not logged in and trying to access a protected route, render nothing while redirecting
  const isProtectedRoute = pathname?.startsWith('/profile') || 
                           pathname?.startsWith('/admin') || 
                           pathname?.startsWith('/checkout');

  if (!user && isProtectedRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-[#ff0033] font-bebas text-2xl tracking-widest animate-pulse">
          INITIALIZING...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
