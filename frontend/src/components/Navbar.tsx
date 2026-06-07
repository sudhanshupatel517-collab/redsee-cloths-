"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Heart, User, Menu, X, LogOut, Settings, Sun, Moon, Shirt, Footprints, Crown, Sparkles, Layers, Gem, Flame } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/authSlice";
import api from "@/lib/axios";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";

const CATEGORIES = [
  { name: "Men", href: "/category/men", icon: Shirt, color: "#ff0033" },
  { name: "Women", href: "/category/women", icon: Crown, color: "#ff0033" },
  { name: "Oversized", href: "/category/oversized", icon: Layers, color: "#ff0033" },
  { name: "Hoodies", href: "/category/hoodies", icon: Sparkles, color: "#ff0033" },
  { name: "Cargo", href: "/category/cargo", icon: Layers, color: "#ff0033" },
  { name: "Lower", href: "/category/lower", icon: Flame, color: "#ff0033" },
  { name: "Shirts", href: "/category/shirts", icon: Shirt, color: "#ff0033" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items) || [];
  const wishlistCount = wishlistItems.length;
  const cartCount = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try { await api.post('/api/auth/logout'); } catch (err) { console.error('Logout error:', err); }
    dispatch(logout());
    setDropdownOpen(false);
  };

  const currentTheme = resolvedTheme || 'dark';

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky w-full top-0 z-50 transition-all duration-300 bg-white/95 dark:bg-black/90 backdrop-blur-md ${
          isScrolled ? "py-2 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.8)]" : "py-3"
        } border-b border-zinc-200 dark:border-white/5 ${pathname === '/' ? 'hidden' : ''}`}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Main row: Logo + Search + Icons */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              {mounted ? (
                <img src={currentTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png'} alt="REDSEE" className="h-8 md:h-10 cursor-pointer object-contain" />
              ) : (
                <div className="h-10 w-28 bg-transparent"></div>
              )}
            </Link>

            {/* Search Bar — centered between logo and icons */}
            <div
              onClick={() => router.push('/search')}
              className="flex-1 max-w-xl mx-auto bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-2 flex items-center cursor-pointer hover:border-[#ff0033]/30 transition-colors"
            >
              <Search size={16} className="text-gray-500 mr-3 flex-shrink-0" />
              <span className="font-poppins text-sm text-gray-500 truncate">Search for t-shirts, hoodies, sneakers...</span>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
              {mounted && (
                <button 
                  onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')} 
                  className="hidden md:flex text-foreground/60 hover:text-[#ff0033] transition-colors p-2 relative"
                  aria-label="Toggle Theme"
                >
                  {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}
              <Link href="/cart" className="hidden md:flex text-foreground/60 hover:text-[#ff0033] transition-colors p-2 relative">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#ff0033] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_6px_rgba(255,0,51,0.5)]">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Account dropdown */}
              <div className="relative hidden md:block">
                {user ? (
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-foreground/60 hover:text-[#ff0033] transition-colors p-2 flex items-center gap-1">
                    <User size={18} />
                    <span className="text-xs font-montserrat font-medium hidden lg:block">{user.name?.split(' ')[0]}</span>
                  </button>
                ) : (
                  <Link href="/auth">
                    <button className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-1.5 text-xs font-montserrat font-bold uppercase tracking-wider transition-colors rounded">
                      Login
                    </button>
                  </Link>
                )}

                {dropdownOpen && user && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111] border border-zinc-200 dark:border-white/10 rounded-lg shadow-2xl py-1 z-50">
                    <div className="px-4 py-2.5 border-b border-zinc-200 dark:border-white/10">
                      <p className="text-sm text-black dark:text-white font-poppins font-medium">{user.name}</p>
                      <p className="text-[10px] text-gray-500 capitalize font-montserrat tracking-wider">{user.role}</p>
                    </div>
                    <Link href="/profile" onClick={() => setDropdownOpen(false)}>
                      <span className="flex items-center px-4 py-2.5 text-sm text-zinc-600 dark:text-gray-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white cursor-pointer transition-colors">
                        <User size={14} className="mr-2" /> My Profile
                      </span>
                    </Link>
                    {(user.role === 'admin' || user.role === 'coadmin') && (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)}>
                        <span className="flex items-center px-4 py-2.5 text-sm text-zinc-600 dark:text-gray-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white cursor-pointer transition-colors">
                          <Settings size={14} className="mr-2" /> {user.role === 'admin' ? 'Admin Panel' : 'Staff Panel'}
                        </span>
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2.5 text-sm text-zinc-600 dark:text-gray-400 hover:bg-[#ff0033]/10 hover:text-[#ff0033] cursor-pointer transition-colors border-t border-zinc-200 dark:border-white/5">
                      <LogOut size={14} className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-foreground/60 hover:text-foreground transition-colors p-2">
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>


        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex"
          >
            <div className="w-[280px] bg-white dark:bg-[#0a0a0a] h-full border-r border-zinc-200 dark:border-white/10 flex flex-col p-6 overflow-y-auto text-foreground">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  {mounted && <img src={currentTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png'} alt="REDSEE" className="h-8 object-contain" />}
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="text-zinc-500 dark:text-gray-400 hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              {/* User section */}
              {user ? (
                <div className="mb-6 pb-4 border-b border-zinc-200 dark:border-white/10">
                  <p className="text-black dark:text-white font-poppins font-medium text-sm">{user.name}</p>
                  <p className="text-[10px] text-gray-500 capitalize font-montserrat tracking-wider mt-0.5">{user.role}</p>
                </div>
              ) : (
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)} className="mb-6 pb-4 border-b border-zinc-200 dark:border-white/10 block">
                  <button className="w-full bg-[#ff0033] text-white py-2.5 text-xs font-montserrat font-bold uppercase tracking-wider rounded">Login / Register</button>
                </Link>
              )}

              {/* Categories */}
              <p className="text-[10px] text-zinc-400 dark:text-gray-600 font-montserrat uppercase tracking-[0.2em] mb-3">Shop by Category</p>
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link key={cat.name} href={cat.href} onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-white/5 text-zinc-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                    <Icon size={16} className="text-zinc-400 dark:text-gray-500" />
                    <span className="text-sm font-poppins">{cat.name}</span>
                  </Link>
                );
              })}

              {/* Quick links */}
              <div className="mt-6 space-y-3">
                {user && (
                  <>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-600 dark:text-gray-400 font-poppins hover:text-black dark:hover:text-white">My Profile</Link>
                    <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-600 dark:text-gray-400 font-poppins hover:text-black dark:hover:text-white">Wishlist</Link>
                    {(user.role === 'admin' || user.role === 'coadmin') && (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-600 dark:text-gray-400 font-poppins hover:text-black dark:hover:text-white">
                        {user.role === 'admin' ? 'Admin Panel' : 'Staff Panel'}
                      </Link>
                    )}
                  </>
                )}
              </div>

              {/* Theme + Logout at bottom */}
              <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-white/10 space-y-3">
                {mounted && (
                  <button onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                    {currentTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    {currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>
                )}
                {user && (
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-sm text-[#ff0033]">
                    <LogOut size={16} /> Logout
                  </button>
                )}
              </div>
            </div>
            {/* Backdrop */}
            <div className="flex-1 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
