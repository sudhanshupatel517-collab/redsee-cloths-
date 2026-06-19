'use client';

import React from 'react';
import { Truck, Globe, Timer } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="pt-16 pb-24 min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.3em] text-[#ff0033] block mb-2">DELIVERY POLICY</span>
          <h1 className="text-5xl md:text-6xl font-bebas text-zinc-900 dark:text-white tracking-widest uppercase">
            SHIPPING INFO
          </h1>
          <div className="w-16 h-1 bg-[#ff0033] mx-auto mt-4 rounded"></div>
        </div>

        <div className="space-y-12 font-poppins text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed">
          <div>
            <h2 className="text-2xl font-bebas text-black dark:text-white tracking-wide mb-4">OUR SHIPPING PROMISE</h2>
            <p>
              At Redsee, we treat every drop with maximum priority. We work with leading global shipping and logistics providers to guarantee safe and prompt deliveries. All items are packaged in custom-designed streetwear apparel boxes to ensure pristine condition upon arrival.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-[#ff0033]/10 border border-[#ff0033]/20 flex items-center justify-center text-[#ff0033] mb-4">
                <Timer size={18} />
              </div>
              <h3 className="font-montserrat font-bold text-xs text-black dark:text-white uppercase tracking-wider mb-2">Processing Time</h3>
              <p className="text-[11px] text-zinc-500">Orders are processed within 24-48 hours. Items ordered during drop announcements may require up to 72 hours processing.</p>
            </div>

            <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-[#ff0033]/10 border border-[#ff0033]/20 flex items-center justify-center text-[#ff0033] mb-4">
                <Truck size={18} />
              </div>
              <h3 className="font-montserrat font-bold text-xs text-black dark:text-white uppercase tracking-wider mb-2">Transit Rates</h3>
              <p className="text-[11px] text-zinc-500">Standard domestic shipping (3-5 days) is free. Express shipping options (1-2 days) are computed at checkout details.</p>
            </div>

            <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-[#ff0033]/10 border border-[#ff0033]/20 flex items-center justify-center text-[#ff0033] mb-4">
                <Globe size={18} />
              </div>
              <h3 className="font-montserrat font-bold text-xs text-black dark:text-white uppercase tracking-wider mb-2">Global Shipping</h3>
              <p className="text-[11px] text-zinc-500">We offer worldwide shipping options. Custom clearance duties and international shipping rates are handled at payment portals.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-white/5">
            <h2 className="text-2xl font-bebas text-black dark:text-white tracking-wide mb-4">ORDER TRACKING</h2>
            <p>
              Once your shipment departs, we automatically dispatch an SMS and Email carrying your shipping carrier details and live tracking trackingId. You can monitor the path of your cargo directly in your account's dashboard stepper timeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
