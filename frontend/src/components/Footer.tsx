"use client";
import Link from "next/link";
import { Globe, Mail } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Footer = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = resolvedTheme || 'dark';

  return (
    <footer className="bg-secondary border-t border-border pt-16 pb-8 mt-20 transition-colors duration-300">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/">
            {mounted ? (
              <img src={currentTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png'} alt="REDSEE" className="w-32 md:w-40 object-contain" />
            ) : (
              <div className="w-32 h-16 bg-transparent"></div>
            )}
          </Link>
          <p className="text-foreground/60 font-poppins text-sm leading-relaxed">
            The future of fashion. Premium dropshipping platform for luxury aesthetics, oversized streetwear, and bold trends.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="text-foreground/60 hover:text-[#ff0033] transition-colors"><Globe size={20} /></a>
            <a href="#" className="text-foreground/60 hover:text-[#ff0033] transition-colors"><Mail size={20} /></a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-xl font-bebas tracking-wide mb-6">Shop</h3>
          <ul className="space-y-3">
            <li><Link href="/category/men" className="text-foreground/60 hover:text-[#ff0033] transition-colors text-sm uppercase font-montserrat">Men</Link></li>
            <li><Link href="/category/women" className="text-foreground/60 hover:text-[#ff0033] transition-colors text-sm uppercase font-montserrat">Women</Link></li>
            <li><Link href="/category/oversized" className="text-foreground/60 hover:text-[#ff0033] transition-colors text-sm uppercase font-montserrat">Oversized</Link></li>
            <li><Link href="/category/sneakers" className="text-foreground/60 hover:text-[#ff0033] transition-colors text-sm uppercase font-montserrat">Sneakers</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xl font-bebas tracking-wide mb-6">Support</h3>
          <ul className="space-y-3">
            <li><Link href="/contact" className="text-foreground/60 hover:text-[#ff0033] transition-colors text-sm uppercase font-montserrat">Contact Us</Link></li>
            <li><Link href="/faq" className="text-foreground/60 hover:text-[#ff0033] transition-colors text-sm uppercase font-montserrat">FAQs</Link></li>
            <li><Link href="/shipping" className="text-foreground/60 hover:text-[#ff0033] transition-colors text-sm uppercase font-montserrat">Shipping Info</Link></li>
            <li><Link href="/returns" className="text-foreground/60 hover:text-[#ff0033] transition-colors text-sm uppercase font-montserrat">Returns & Refunds</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-bebas tracking-wide mb-6">Newsletter</h3>
          <p className="text-foreground/60 text-sm mb-4 font-poppins">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <form className="flex mt-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-black/50 border border-white/10 px-4 py-2 text-sm w-full focus:outline-none focus:border-[#ff0033] text-white transition-colors"
            />
            <button type="button" className="bg-[#ff0033] text-white px-4 py-2 text-sm font-bold tracking-wider hover:bg-[#cc0029] transition-colors">
              JOIN
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
        <p className="text-foreground/50 text-xs font-poppins">© 2026 REDSEE. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="/privacy" className="text-foreground/50 hover:text-white text-xs transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-foreground/50 hover:text-white text-xs transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
