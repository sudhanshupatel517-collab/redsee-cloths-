'use client';

import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const posts = [
    {
      title: "The Evolution of Streetwear: From Skateboards to Runway",
      date: "June 15, 2026",
      author: "Sneakerhead Guru",
      excerpt: "Streetwear has migrated from local skate subcultures directly to luxury runway fashion. We explore how hoodies and sneakers became premium status symbols.",
      image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Sustainable Fashion: Designing for the Future",
      date: "May 28, 2026",
      author: "Eco Stylist",
      excerpt: "Behind the scenes of our latest eco-friendly drop. How organic materials and ethical manufacturing are reshaping the streetwear landscape.",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="pt-16 pb-24 min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.3em] text-[#ff0033] block mb-2">READ OUR JOURNAL</span>
          <h1 className="text-5xl md:text-6xl font-bebas text-zinc-900 dark:text-white tracking-widest uppercase">
            REDSEE BLOG
          </h1>
          <div className="w-16 h-1 bg-[#ff0033] mx-auto mt-4 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, idx) => (
            <div 
              key={idx}
              className="bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm group hover:border-[#ff0033]/30 transition-all duration-300"
            >
              <div className="aspect-[16/10] overflow-hidden bg-zinc-200 dark:bg-white/5 relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-[10px] font-montserrat text-zinc-550 dark:text-zinc-500 uppercase tracking-wider">
                  <span className="flex items-center"><Calendar size={10} className="mr-1" /> {post.date}</span>
                  <span className="flex items-center"><User size={10} className="mr-1" /> {post.author}</span>
                </div>
                <h3 className="font-montserrat font-bold text-sm text-black dark:text-white group-hover:text-[#ff0033] transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="font-poppins text-xs text-zinc-550 dark:text-zinc-500 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center text-xs font-montserrat font-bold uppercase tracking-wider text-[#ff0033] hover:underline cursor-pointer">
                    Read Article <ArrowRight size={12} className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
