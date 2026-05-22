'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Headphones, MessageSquare } from 'lucide-react';

export default function CustomerSupport() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user || (!['admin', 'coadmin'].includes(user.role))) {
      router.push('/auth');
      return;
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center mt-20">
        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
          <Headphones size={40} className="text-[#ff0033]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bebas text-white tracking-widest uppercase mb-4">Customer Support</h1>
        <p className="text-gray-400 font-poppins text-lg max-w-2xl mx-auto mb-8">
          The centralized ticketing and customer support dashboard is currently under construction.
          Once deployed, you will be able to manage user disputes, refund requests, and direct messages here.
        </p>
        
        <button className="flex items-center space-x-2 bg-[#ff0033] hover:bg-[#cc0029] text-white px-8 py-4 rounded-lg font-montserrat font-bold tracking-widest uppercase text-sm transition-all shadow-[0_0_20px_rgba(255,0,51,0.4)] opacity-50 cursor-not-allowed">
          <MessageSquare size={20} />
          <span>Open Ticket System (Coming Soon)</span>
        </button>
      </div>
    </div>
  );
}
