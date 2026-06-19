'use client';

import React from 'react';
import { RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="pt-16 pb-24 min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.3em] text-[#ff0033] block mb-2">SATISFACTION GUARANTEED</span>
          <h1 className="text-5xl md:text-6xl font-bebas text-zinc-900 dark:text-white tracking-widest uppercase">
            RETURNS & REFUNDS
          </h1>
          <div className="w-16 h-1 bg-[#ff0033] mx-auto mt-4 rounded"></div>
        </div>

        <div className="space-y-12 font-poppins text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed">
          <div>
            <h2 className="text-2xl font-bebas text-black dark:text-white tracking-wide mb-4">4-DAY EASY REPLACEMENT POLICY</h2>
            <p>
              We stand by the quality of our clothing. If you receive an item that is defective, sized incorrectly, or not up to standard, you have **4 days** from the date of delivery to file a replacement request through your profile dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="font-montserrat font-bold text-xs text-black dark:text-white uppercase tracking-wider flex items-center">
                <CheckCircle size={16} className="text-green-500 mr-2" /> Eligible Items
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-500">
                <li>Products in original unworn, unwashed, and undamaged condition.</li>
                <li>Original price tags, labels, and packaging intact.</li>
                <li>Request submitted within 4 calendar days of delivery.</li>
              </ul>
            </div>

            <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="font-montserrat font-bold text-xs text-black dark:text-white uppercase tracking-wider flex items-center">
                <AlertTriangle size={16} className="text-[#ff0033] mr-2" /> Non-Returnable Items
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-500">
                <li>Undergarments, socks, and personal care accessories.</li>
                <li>Items bought during clearance sales or special archive drops.</li>
                <li>Items missing tags or showing signs of wear/wash.</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-white/5">
            <h2 className="text-2xl font-bebas text-black dark:text-white tracking-wide mb-4">HOW TO INITIATE A RETURN</h2>
            <p>
              1. Log in and navigate to your **Profile Dashboard**.<br />
              2. Click on **Orders** and select the order containing the items you wish to return.<br />
              3. Click **Request Return/Replacement** and follow the prompts to select a pickup slot.<br />
              4. A courier partner will pick up the item within 48 hours. Once verified at our warehouse, your refund or replacement will be initiated immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
