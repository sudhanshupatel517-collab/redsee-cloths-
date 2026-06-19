'use client';

import React from 'react';
import { Ruler } from 'lucide-react';

export default function SizeGuidePage() {
  return (
    <div className="pt-16 pb-24 min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.3em] text-[#ff0033] block mb-2">FIND YOUR FIT</span>
          <h1 className="text-5xl md:text-6xl font-bebas text-zinc-900 dark:text-white tracking-widest uppercase">
            SIZE GUIDE
          </h1>
          <div className="w-16 h-1 bg-[#ff0033] mx-auto mt-4 rounded"></div>
        </div>

        <div className="space-y-12 font-poppins text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed">
          <div className="flex items-center space-x-3 mb-6 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 p-4 rounded-xl">
            <Ruler className="text-[#ff0033] flex-shrink-0" size={24} />
            <p className="text-xs">
              Streetwear fits differ from classic apparel. Many of our garments are designed with an oversized fit. Please review measurements below.
            </p>
          </div>

          {/* Tops Table */}
          <div>
            <h2 className="text-2xl font-bebas text-black dark:text-white tracking-wide mb-4">T-SHIRTS & HOODIES</h2>
            <div className="overflow-x-auto border border-zinc-200 dark:border-white/5 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-150 dark:bg-white/5 text-black dark:text-white font-montserrat font-bold uppercase">
                    <th className="p-4 border-b border-zinc-200 dark:border-white/5">Size</th>
                    <th className="p-4 border-b border-zinc-200 dark:border-white/5">Chest (inches)</th>
                    <th className="p-4 border-b border-zinc-200 dark:border-white/5">Length (inches)</th>
                    <th className="p-4 border-b border-zinc-200 dark:border-white/5">Sleeve (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { s: "Small", c: "38 - 40", l: "27.5", sl: "8.5" },
                    { s: "Medium", c: "41 - 43", l: "28.5", sl: "9" },
                    { s: "Large", c: "44 - 46", l: "29.5", sl: "9.5" },
                    { s: "X-Large", c: "47 - 49", l: "30.5", sl: "10" }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-white/[0.01]">
                      <td className="p-4 border-b border-zinc-200 dark:border-white/5 font-bold text-black dark:text-white">{row.s}</td>
                      <td className="p-4 border-b border-zinc-200 dark:border-white/5">{row.c}</td>
                      <td className="p-4 border-b border-zinc-200 dark:border-white/5">{row.l}</td>
                      <td className="p-4 border-b border-zinc-200 dark:border-white/5">{row.sl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottoms Table */}
          <div>
            <h2 className="text-2xl font-bebas text-black dark:text-white tracking-wide mb-4">CARGOS & LOWERS</h2>
            <div className="overflow-x-auto border border-zinc-200 dark:border-white/5 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-150 dark:bg-white/5 text-black dark:text-white font-montserrat font-bold uppercase">
                    <th className="p-4 border-b border-zinc-200 dark:border-white/5">Size</th>
                    <th className="p-4 border-b border-zinc-200 dark:border-white/5">Waist Range (inches)</th>
                    <th className="p-4 border-b border-zinc-200 dark:border-white/5">Length (inches)</th>
                    <th className="p-4 border-b border-zinc-200 dark:border-white/5">Hip (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { s: "Small", w: "28 - 30", l: "39", h: "38" },
                    { s: "Medium", w: "31 - 33", l: "40", h: "40" },
                    { s: "Large", w: "34 - 36", l: "41", h: "42" },
                    { s: "X-Large", w: "37 - 39", l: "42", h: "44" }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-white/[0.01]">
                      <td className="p-4 border-b border-zinc-200 dark:border-white/5 font-bold text-black dark:text-white">{row.s}</td>
                      <td className="p-4 border-b border-zinc-200 dark:border-white/5">{row.w}</td>
                      <td className="p-4 border-b border-zinc-200 dark:border-white/5">{row.l}</td>
                      <td className="p-4 border-b border-zinc-200 dark:border-white/5">{row.h}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
