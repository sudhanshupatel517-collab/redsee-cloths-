'use client';

import React from 'react';
import { Lock, Eye } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="pt-16 pb-24 min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.3em] text-[#ff0033] block mb-2">DATA PROTECTION</span>
          <h1 className="text-5xl md:text-6xl font-bebas text-zinc-900 dark:text-white tracking-widest uppercase">
            PRIVACY POLICY
          </h1>
          <div className="w-16 h-1 bg-[#ff0033] mx-auto mt-4 rounded"></div>
        </div>

        <div className="space-y-8 font-poppins text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed">
          <div className="flex items-center space-x-3 mb-6 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 p-4 rounded-xl">
            <Lock className="text-[#ff0033] flex-shrink-0" size={24} />
            <p className="text-xs">
              Your privacy is of critical importance to us. We never sell, lease, or distribute your email, phone number, address details, or order histories.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bebas text-black dark:text-white tracking-wider mb-3">1. INFORMATION WE COLLECT</h2>
            <p>
              We collect your name, email address, shipping address details, and phone number when you register an account or place an order. We also store browsing activity (such as recently viewed items and wishlist selections) locally or securely on our database to personalize your shopping dashboard.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bebas text-black dark:text-white tracking-wider mb-3">2. HOW WE USE YOUR DATA</h2>
            <p>
              We use collected information to fulfill orders, process payments, dispatch live tracking details, and communicate critical status alerts. We also utilize aggregated data for performance analysis and store design optimizations.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bebas text-black dark:text-white tracking-wider mb-3">3. PAYMENT SECURITY</h2>
            <p>
              All online checkouts are handled through secure payment gateways (like Razorpay). We do not store credit card credentials, pins, or passwords on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
