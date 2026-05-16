import Link from "next/link";
import { Globe, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8 mt-20">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/">
            <h1 className="text-4xl font-bebas text-glow text-white tracking-widest">
              REDSEE
            </h1>
          </Link>
          <p className="text-gray-400 font-poppins text-sm leading-relaxed">
            The future of fashion. Premium dropshipping platform for luxury aesthetics, oversized streetwear, and bold trends.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="text-gray-400 hover:text-[#ff0033] transition-colors"><Globe size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-[#ff0033] transition-colors"><Mail size={20} /></a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-xl font-bebas tracking-wide mb-6">Shop</h3>
          <ul className="space-y-3">
            <li><Link href="/category/men" className="text-gray-400 hover:text-[#ff0033] transition-colors text-sm uppercase font-montserrat">Men</Link></li>
            <li><Link href="/category/women" className="text-gray-400 hover:text-[#ff0033] transition-colors text-sm uppercase font-montserrat">Women</Link></li>
            <li><Link href="/category/oversized" className="text-gray-400 hover:text-[#ff0033] transition-colors text-sm uppercase font-montserrat">Oversized</Link></li>
            <li><Link href="/category/sneakers" className="text-gray-400 hover:text-[#ff0033] transition-colors text-sm uppercase font-montserrat">Sneakers</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xl font-bebas tracking-wide mb-6">Support</h3>
          <ul className="space-y-3">
            <li><Link href="/contact" className="text-gray-400 hover:text-[#ff0033] transition-colors text-sm uppercase font-montserrat">Contact Us</Link></li>
            <li><Link href="/faq" className="text-gray-400 hover:text-[#ff0033] transition-colors text-sm uppercase font-montserrat">FAQs</Link></li>
            <li><Link href="/shipping" className="text-gray-400 hover:text-[#ff0033] transition-colors text-sm uppercase font-montserrat">Shipping Info</Link></li>
            <li><Link href="/returns" className="text-gray-400 hover:text-[#ff0033] transition-colors text-sm uppercase font-montserrat">Returns & Refunds</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-bebas tracking-wide mb-6">Newsletter</h3>
          <p className="text-gray-400 text-sm mb-4 font-poppins">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
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
        <p className="text-gray-500 text-xs font-poppins">© 2026 REDSEE. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="/privacy" className="text-gray-500 hover:text-white text-xs transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-gray-500 hover:text-white text-xs transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
