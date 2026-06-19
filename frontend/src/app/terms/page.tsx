'use client';

import React from 'react';
import { AlignLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="pt-16 pb-24 min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.3em] text-[#ff0033] block mb-2">USER AGREEMENT</span>
          <h1 className="text-5xl md:text-6xl font-bebas text-zinc-900 dark:text-white tracking-widest uppercase">
            TERMS OF SERVICE
          </h1>
          <div className="w-16 h-1 bg-[#ff0033] mx-auto mt-4 rounded"></div>
        </div>

        <div className="space-y-8 font-poppins text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed">
          <div className="flex items-center space-x-3 mb-6 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 p-4 rounded-xl">
            <AlignLeft className="text-[#ff0033] flex-shrink-0" size={24} />
            <p className="text-xs">
              By using our website, ordering products, or accessing our content, you agree to comply with the terms listed below.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bebas text-black dark:text-white tracking-wider mb-3">1. USER ACCOUNTS</h2>
            <p>
              When creating an account, you must provide accurate, complete, and current information. You are responsible for safeguarding your password credentials and any activity under your account. Staff accounts are strictly designated for platform operations and restricted from customer buying flows.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bebas text-black dark:text-white tracking-wider mb-3">2. PRODUCTS & PRICING</h2>
            <p>
              We reserve the right to cancel or reject orders in cases of pricing inaccuracies, stock discrepancies, or potential fraudulent activity. Streetwear drop availability is limited and items are allocated on a first-come, first-served basis.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bebas text-black dark:text-white tracking-wider mb-3">3. LIMITATION OF LIABILITY</h2>
            <p>
              Redsee Store is provided 'as is' without warranties of any kind. Under no circumstances will Redsee Store, its developers, or its owners be liable for any direct, indirect, incidental, or consequential damages resulting from website usage or purchase actions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
