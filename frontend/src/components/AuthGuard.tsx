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
      
      if (!user && !isAuthRoute) {
        router.push('/auth');
      } else if (user && isAuthRoute) {
        if (user.role === 'admin') router.push('/admin');
        else if (user.role === 'coadmin') router.push('/staff');
        else router.push('/');
      }
    };

    if (mounted) {
      checkAuth();
    }
  }, [user, pathname, router, mounted]);

  // Don't render until mounted to prevent hydration errors from localStorage checks
  if (!mounted) return null;

  // If not logged in and not on auth route, render nothing while redirecting
  if (!user && pathname !== '/auth') {
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
