'use client';

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="pt-16 pb-24 min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.3em] text-[#ff0033] block mb-2">GET IN TOUCH</span>
          <h1 className="text-5xl md:text-6xl font-bebas text-zinc-900 dark:text-white tracking-widest uppercase">
            CONTACT US
          </h1>
          <div className="w-16 h-1 bg-[#ff0033] mx-auto mt-4 rounded"></div>
        </div>

        <div className="max-w-lg mx-auto bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-3xl p-8 md:p-10 shadow-sm space-y-8">
          <div>
            <h2 className="text-2xl font-bebas text-black dark:text-white tracking-wide mb-4">WE WANT TO HEAR FROM YOU</h2>
            <p className="font-poppins text-zinc-550 dark:text-zinc-400 text-sm leading-relaxed">
              Have questions about our drops, sizing, shipping, or returns? Drop us a line. Our dedicated support team is available 24/7 to make sure you get the best experience.
            </p>
          </div>

          <div className="space-y-6 font-poppins text-sm">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#ff0033]/10 border border-[#ff0033]/20 flex items-center justify-center text-[#ff0033] flex-shrink-0">
                <Mail size={16} />
              </div>
              <div className="text-left">
                <h4 className="font-montserrat font-bold text-xs text-black dark:text-white uppercase tracking-wider">Email Us</h4>
                <a href="mailto:sudhanshupatel517@gmail.com" className="text-zinc-550 dark:text-zinc-400 hover:text-[#ff0033] transition-colors">sudhanshupatel517@gmail.com</a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#ff0033]/10 border border-[#ff0033]/20 flex items-center justify-center text-[#ff0033] flex-shrink-0">
                <Phone size={16} />
              </div>
              <div className="text-left">
                <h4 className="font-montserrat font-bold text-xs text-black dark:text-white uppercase tracking-wider">Call Us</h4>
                <a href="tel:+918889715939" className="text-zinc-550 dark:text-zinc-400 hover:text-[#ff0033] transition-colors">+91 88897 15939</a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#ff0033]/10 border border-[#ff0033]/20 flex items-center justify-center text-[#ff0033] flex-shrink-0">
                <MapPin size={16} />
              </div>
              <div className="text-left">
                <h4 className="font-montserrat font-bold text-xs text-black dark:text-white uppercase tracking-wider">Headquarters</h4>
                <p className="text-zinc-550 dark:text-zinc-400">Redsee Fashion, Sidhi, Madhya Pradesh, India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
