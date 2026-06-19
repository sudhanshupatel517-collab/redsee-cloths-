'use client';

import React from 'react';
import { Briefcase, MapPin, AlignLeft } from 'lucide-react';

export default function CareersPage() {
  const jobs = [
    { title: "Senior Streetwear Designer", dept: "Design & Product", loc: "New Delhi, India (Hybrid)", type: "Full-Time" },
    { title: "E-commerce Operations Specialist", dept: "Supply Chain", loc: "New Delhi, India (On-Site)", type: "Full-Time" },
    { title: "Front-End Developer (React / Next.js)", dept: "Technology", loc: "Remote (India)", type: "Full-Time" }
  ];

  return (
    <div className="pt-16 pb-24 min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.3em] text-[#ff0033] block mb-2">JOIN OUR SQUAD</span>
          <h1 className="text-5xl md:text-6xl font-bebas text-zinc-900 dark:text-white tracking-widest uppercase">
            CAREERS
          </h1>
          <div className="w-16 h-1 bg-[#ff0033] mx-auto mt-4 rounded"></div>
        </div>

        <div className="space-y-8 font-poppins text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed">
          <div>
            <h2 className="text-2xl font-bebas text-black dark:text-white tracking-wide mb-4">WORK AT REDSEE</h2>
            <p>
              We're a team of innovators, creatives, and tech enthusiasts building the future of streetwear fashion. If you're passionate about culture, technology, and building exceptional experiences, look at our open opportunities below.
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <h3 className="text-lg font-bebas text-black dark:text-white tracking-wider mb-2">CURRENT OPENINGS</h3>
            {jobs.map((job, idx) => (
              <div 
                key={idx}
                className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <h4 className="font-montserrat font-bold text-sm text-black dark:text-white">{job.title}</h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-550 dark:text-zinc-500">
                    <span className="flex items-center"><Briefcase size={12} className="mr-1" /> {job.dept}</span>
                    <span className="flex items-center"><MapPin size={12} className="mr-1" /> {job.loc}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4">
                  <span className="text-[10px] font-montserrat uppercase tracking-wider font-bold border border-zinc-300 dark:border-white/10 px-3 py-1 rounded-full text-zinc-550 dark:text-gray-400">
                    {job.type}
                  </span>
                  <a 
                    href="mailto:careers@redsee.com" 
                    className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg text-xs font-montserrat font-bold tracking-widest uppercase transition-colors"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
