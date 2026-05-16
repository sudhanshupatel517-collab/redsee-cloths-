"use client";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <Hero />
      
      {/* Featured Categories */}
      <section className="py-20 bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-96 group overflow-hidden bg-zinc-900 border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1523398002811-999aa8e9f5b9?q=80&w=1000&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-40"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-10 z-10">
                <h3 className="text-4xl font-bebas text-white mb-2">Menswear</h3>
                <Link href="/category/men" className="flex items-center text-[#ff0033] font-montserrat uppercase text-sm tracking-widest font-bold group-hover:text-white transition-colors">
                  Shop Now <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="relative h-96 group overflow-hidden bg-zinc-900 border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-40"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-10 z-10">
                <h3 className="text-4xl font-bebas text-white mb-2">Womenswear</h3>
                <Link href="/category/women" className="flex items-center text-[#ff0033] font-montserrat uppercase text-sm tracking-widest font-bold group-hover:text-white transition-colors">
                  Shop Now <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductGrid title="TRENDING NOW" limit={4} />

      {/* Promotional Banner */}
      <section className="relative py-32 bg-black overflow-hidden border-y border-white/10 my-10">
        <div className="absolute inset-0 z-0 opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000&auto=format&fit=crop')", backgroundAttachment: "fixed", backgroundSize: "cover" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-bebas text-white mb-4">THE <span className="text-[#ff0033] text-glow">OVERSIZED</span> REVOLUTION</h2>
            <p className="text-gray-300 font-poppins max-w-2xl mx-auto mb-8 text-lg">Embrace comfort without compromising on style. The new dropshipping collection redefines streetwear silhouettes.</p>
            <Link href="/category/oversized">
              <button className="bg-white text-black hover:bg-[#ff0033] hover:text-white transition-all duration-300 px-10 py-4 font-montserrat uppercase tracking-wider font-bold text-sm mx-auto flex items-center justify-center">
                Explore Collection
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <ProductGrid title="NEW ARRIVALS" limit={4} />
      
      {/* Features Section */}
      <section className="py-20 bg-[#0A0A0A] border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { title: "Free Shipping", desc: "On all orders over $150" },
              { title: "Premium Quality", desc: "Authentic materials & design" },
              { title: "Easy Returns", desc: "30-day money back guarantee" },
              { title: "Secure Checkout", desc: "256-bit encrypted payments" }
            ].map((feature, i) => (
              <div key={i} className="p-8 border border-white/5 glassmorphism-dark hover:border-[#ff0033]/50 transition-colors group">
                <h4 className="text-xl font-bebas tracking-wide text-white mb-2 group-hover:text-[#ff0033] transition-colors">{feature.title}</h4>
                <p className="text-sm text-gray-500 font-poppins">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
