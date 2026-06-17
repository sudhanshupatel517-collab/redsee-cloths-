"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?q=80&w=2000&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        {/* Red Glow effect */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7A0000] rounded-full blur-[150px] opacity-40"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-start justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[#ff0033] font-montserrat tracking-[0.3em] uppercase text-sm font-bold mb-4 block"
          >
            New Collection 2026
          </motion.span>
          <h1 className="text-6xl md:text-8xl font-bebas text-foreground leading-none mb-6">
            DEFINE YOUR <br />
            <span className="text-glow text-transparent bg-clip-text bg-gradient-to-r from-[#ff0033] to-[#7A0000]">IDENTITY.</span>
          </h1>
          <p className="text-foreground/70 font-poppins text-lg mb-10 max-w-xl">
            Discover the perfect blend of dark luxury and modern streetwear. Elevate your wardrobe with Redsee Store's exclusive, limited-edition pieces.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/shop">
              <button className="bg-[#ff0033] hover:bg-foreground hover:text-background transition-all duration-300 text-foreground px-8 py-4 font-montserrat uppercase tracking-wider font-bold text-sm flex items-center justify-center group w-full sm:w-auto">
                Shop Now
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/new-arrivals">
              <button className="bg-transparent border border-foreground/30 hover:border-foreground transition-all duration-300 text-foreground px-8 py-4 font-montserrat uppercase tracking-wider font-bold text-sm flex items-center justify-center w-full sm:w-auto">
                Explore Trends
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
