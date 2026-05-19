'use client';

import { ReactNode } from 'react';
import AuthGuard from '@/components/AuthGuard';
import ProfileSidebar from '@/components/ProfileSidebar';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-black pt-24 pb-12 px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7a0000]/10 via-black to-black z-0"></div>
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-[#ff0033]/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
              <ProfileSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff0033]/50 to-transparent opacity-50"></div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
