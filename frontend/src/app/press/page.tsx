'use client';

import React from 'react';
import { Newspaper, Mail, Download } from 'lucide-react';

export default function PressPage() {
  return (
    <div className="pt-16 pb-24 min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.3em] text-[#ff0033] block mb-2">NEWS & MEDIA</span>
          <h1 className="text-5xl md:text-6xl font-bebas text-zinc-900 dark:text-white tracking-widest uppercase">
            PRESS ROOM
          </h1>
          <div className="w-16 h-1 bg-[#ff0033] mx-auto mt-4 rounded"></div>
        </div>

        <div className="space-y-12 font-poppins text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed">
          <div>
            <h2 className="text-2xl font-bebas text-black dark:text-white tracking-wide mb-4">REDSEE IN THE NEWS</h2>
            <p>
              Discover mentions of Redsee Store in digital publications and streetwear culture hubs worldwide. For media relations, press kits, or interview queries, reach out directly to our PR team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 p-6 rounded-2xl space-y-3">
              <span className="text-[10px] font-montserrat uppercase font-bold text-[#ff0033]">Vogue India</span>
              <h3 className="font-montserrat font-bold text-sm text-black dark:text-white leading-snug">"Redsee Store is bridging the gap between luxury and streetwear culture."</h3>
              <p className="text-xs text-zinc-500">Highlighting the details of our latest oversized drop and how it aligns with Indian youth design patterns.</p>
            </div>

            <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 p-6 rounded-2xl space-y-3">
              <span className="text-[10px] font-montserrat uppercase font-bold text-[#ff0033]">GQ India</span>
              <h3 className="font-montserrat font-bold text-sm text-black dark:text-white leading-snug">"The emerging brand redefining premium hoodies in South Asia."</h3>
              <p className="text-xs text-zinc-500">Covering our digital drops, loyalty rewards model, and direct-to-consumer strategy.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bebas text-black dark:text-white tracking-wider flex items-center">
                <Newspaper size={18} className="mr-2 text-[#ff0033]" /> PRESS ASSETS
              </h3>
              <p className="text-xs text-zinc-500">Download high-resolution logos, brand guidelines, and product photography packs.</p>
            </div>
            <button className="bg-zinc-100 hover:bg-zinc-250 dark:bg-white/5 dark:hover:bg-white/10 text-black dark:text-white border border-zinc-200 dark:border-white/10 px-5 py-3 rounded-lg text-xs font-montserrat font-bold tracking-widest uppercase flex items-center gap-2 transition-all">
              <Download size={14} /> Download Media Kit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
