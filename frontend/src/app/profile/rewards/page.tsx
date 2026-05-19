'use client';

import { Gift, Star, Award, Zap } from 'lucide-react';

export default function RewardsPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bebas text-white tracking-widest uppercase mb-1">Redsee Rewards</h1>
      <p className="text-gray-400 font-poppins text-sm mb-8">Earn points and unlock exclusive perks.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-[#ff0033]/20 to-black border border-[#ff0033]/30 p-6 rounded-2xl flex flex-col items-center text-center shadow-[0_0_20px_rgba(255,0,51,0.1)]">
          <Star size={32} className="text-[#ff0033] mb-4" />
          <h2 className="text-3xl font-bebas text-white tracking-widest">0</h2>
          <p className="text-gray-400 text-xs font-montserrat tracking-widest uppercase mt-1">Total Points</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center">
          <Award size={32} className="text-gray-500 mb-4" />
          <h2 className="text-3xl font-bebas text-white tracking-widest">MEMBER</h2>
          <p className="text-gray-400 text-xs font-montserrat tracking-widest uppercase mt-1">Current Tier</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center">
          <Zap size={32} className="text-gray-500 mb-4" />
          <h2 className="text-3xl font-bebas text-white tracking-widest">0</h2>
          <p className="text-gray-400 text-xs font-montserrat tracking-widest uppercase mt-1">Available Coupons</p>
        </div>
      </div>

      <div className="border border-white/10 rounded-2xl p-8 text-center bg-black/40">
        <Gift size={40} className="mx-auto text-gray-600 mb-4" />
        <h3 className="text-white font-montserrat font-bold text-lg mb-2">No rewards activity yet</h3>
        <p className="text-gray-500 font-poppins text-sm max-w-sm mx-auto">Make purchases, leave reviews, and refer friends to start earning points.</p>
      </div>
    </div>
  );
}
