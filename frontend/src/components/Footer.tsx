"use client";
import Link from "next/link";
import { Globe, Mail, Phone, MapPin, ArrowUp } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  const currentTheme = resolvedTheme || 'dark';

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-zinc-50 dark:bg-[#0a0a0a] border-t border-zinc-200 dark:border-white/5 pt-12 pb-6 mt-12 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/">
              {mounted ? (
                <img src={currentTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png'} alt="REDSEE STORE" className="w-28 md:w-36 object-contain mb-3" />
              ) : (
                <div className="w-28 h-12 bg-transparent"></div>
              )}
            </Link>
            <p className="text-gray-500 font-poppins text-xs leading-relaxed mb-4 max-w-[240px]">
              Premium streetwear & fashion platform. Bold designs for the bold generation.
            </p>
            <div className="flex items-center gap-3 text-gray-600">
              <a href="mailto:support@redsee.com" className="hover:text-[#ff0033] transition-colors"><Mail size={16} /></a>
              <a href="tel:+919999999999" className="hover:text-[#ff0033] transition-colors"><Phone size={16} /></a>
              <a href="#" className="hover:text-[#ff0033] transition-colors"><Globe size={16} /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-bebas tracking-widest mb-4 text-black dark:text-white">Shop</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Men", href: "/category/men" },
                { label: "Women", href: "/category/women" },
                { label: "Oversized", href: "/category/oversized" },
                { label: "Hoodies", href: "/category/hoodies" },
                { label: "Sneakers", href: "/category/sneakers" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-gray-500 hover:text-[#ff0033] transition-colors text-xs font-poppins">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bebas tracking-widest mb-4 text-black dark:text-white">Support</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "FAQs", href: "/faq" },
                { label: "Shipping Info", href: "/shipping" },
                { label: "Returns & Refunds", href: "/returns" },
                { label: "Size Guide", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-gray-500 hover:text-[#ff0033] transition-colors text-xs font-poppins">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bebas tracking-widest mb-4 text-black dark:text-white">Company</h3>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "#" },
                { label: "Careers", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Press", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-gray-500 hover:text-[#ff0033] transition-colors text-xs font-poppins">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-bebas tracking-widest mb-4 text-black dark:text-white">Newsletter</h3>
            <p className="text-gray-500 text-xs mb-3 font-poppins">Get early access to drops, offers & exclusive deals.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-3 py-2 text-xs w-full focus:outline-none focus:border-[#ff0033]/50 text-black dark:text-white rounded-l font-poppins transition-colors"
              />
              <button type="button" className="bg-[#ff0033] text-white px-3 py-2 text-xs font-bold tracking-wider hover:bg-[#cc0029] transition-colors rounded-r font-montserrat whitespace-nowrap">
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Payment methods */}
        <div className="border-t border-zinc-200 dark:border-white/5 pt-6 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[10px] text-zinc-500 dark:text-gray-600 font-montserrat uppercase tracking-wider mr-2">Payment:</span>
            {["VISA", "Mastercard", "UPI", "Razorpay", "PayTM", "COD"].map((m) => (
              <span key={m} className="px-2 py-1 border border-zinc-200 dark:border-white/5 rounded text-[9px] text-zinc-600 dark:text-gray-500 font-montserrat font-medium bg-zinc-100 dark:bg-white/[0.02]">
                {m}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 md:gap-8 text-[10px] text-zinc-500 dark:text-gray-600 font-poppins">
            <span className="flex items-center gap-1.5"><MapPin size={10} /> Worldwide Shipping</span>
            <span>↩️ 7-Day Easy Returns</span>
            <span>🔒 100% Secure Payments</span>
            <span>📦 Order Tracking</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-200 dark:border-white/5 pt-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-zinc-500 dark:text-gray-600 text-[10px] font-poppins">© 2026 REDSEE STORE. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-zinc-500 dark:text-gray-600 hover:text-black dark:hover:text-white text-[10px] transition-colors font-poppins">Privacy Policy</Link>
            <Link href="/terms" className="text-zinc-500 dark:text-gray-600 hover:text-black dark:hover:text-white text-[10px] transition-colors font-poppins">Terms of Service</Link>
            <button onClick={scrollToTop} className="w-7 h-7 rounded-full border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-500 dark:text-gray-500 hover:text-[#ff0033] hover:border-[#ff0033]/40 transition-all ml-2">
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
