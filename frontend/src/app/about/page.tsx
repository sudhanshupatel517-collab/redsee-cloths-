'use client';

import React from 'react';
import { Crown, Sparkles, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-16 pb-24 min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.3em] text-[#ff0033] block mb-2">OUR IDENTITY</span>
          <h1 className="text-5xl md:text-6xl font-bebas text-zinc-900 dark:text-white tracking-widest uppercase">
            ABOUT REDSEE
          </h1>
          <div className="w-16 h-1 bg-[#ff0033] mx-auto mt-4 rounded"></div>
        </div>

        <div className="space-y-12 font-poppins text-zinc-650 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bebas text-black dark:text-white tracking-wide mb-4">BOLD DESIGN FOR THE BOLD GENERATION</h2>
            <p>
              Redsee Store was founded on the idea that streetwear is not just fashion—it is an outlet of self-expression. We curate premium, high-quality, and exclusive streetwear collections for those who refuse to conform. Every piece we launch is meticulously designed and sourced to deliver maximum comfort and unmatched aesthetic appeal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-[#ff0033]/10 border border-[#ff0033]/20 flex items-center justify-center text-[#ff0033] mx-auto mb-4 rounded-full">
                <Crown size={20} />
              </div>
              <h3 className="font-montserrat font-bold text-xs text-black dark:text-white uppercase tracking-wider mb-2">Premium Quality</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">Choice materials sourced internationally for comfort and longevity.</p>
            </div>

            <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-[#ff0033]/10 border border-[#ff0033]/20 flex items-center justify-center text-[#ff0033] mx-auto mb-4 rounded-full">
                <Sparkles size={20} />
              </div>
              <h3 className="font-montserrat font-bold text-xs text-black dark:text-white uppercase tracking-wider mb-2">Exclusive Drops</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">Limited quantity releases ensuring your style remains unique.</p>
            </div>

            <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-[#ff0033]/10 border border-[#ff0033]/20 flex items-center justify-center text-[#ff0033] mx-auto mb-4 rounded-full">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-montserrat font-bold text-xs text-black dark:text-white uppercase tracking-wider mb-2">Secure Experience</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">Full buyer protection from selection, through transit, to your doorstep.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-white/5">
            <h2 className="text-2xl font-bebas text-black dark:text-white tracking-wide mb-4">OUR MISSION</h2>
            <p>
              We seek to democratize luxury streetwear by combining premium-grade craftsmanship with accessible pricing. Through sustainable sourcing methods and cutting-edge digital drops, we hope to build a global community of streetwear enthusiasts who define the future of fashion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
