"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Heart, User, Menu, X, LogOut, Settings, Sun, Moon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/authSlice";
import api from "@/lib/axios";
import { useTheme } from "next-themes";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Men", href: "/category/men" },
    { name: "Women", href: "/category/women" },
    { name: "Oversized", href: "/category/oversized" },
    { name: "Hoodies", href: "/category/hoodies" },
    { name: "Sneakers", href: "/category/sneakers" },
  ];

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    dispatch(logout());
    setDropdownOpen(false);
  };

  const currentTheme = resolvedTheme || 'dark';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "glassmorphism-dark py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          {mounted ? (
            <img src={currentTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png'} alt="REDSEE" className="h-10 cursor-pointer object-contain" />
          ) : (
            <div className="h-10 w-32 bg-transparent"></div>
          )}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <span className="text-sm font-montserrat uppercase tracking-wide text-foreground/70 hover:text-white relative group cursor-pointer">
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#ff0033] transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center space-x-6 relative">
          {mounted && (
            <button 
              onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
              className="text-foreground/70 hover:text-[#ff0033] transition-colors"
            >
              {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <button className="text-foreground/70 hover:text-[#ff0033] transition-colors">
            <Search size={20} />
          </button>
          <Link href="/wishlist">
            <button className="text-foreground/70 hover:text-[#ff0033] transition-colors">
              <Heart size={20} />
            </button>
          </Link>
          <Link href="/cart">
            <button className="text-foreground/70 hover:text-[#ff0033] transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ff0033] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>
          
          <div className="relative">
            {user ? (
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-foreground/70 hover:text-[#ff0033] transition-colors flex items-center gap-2">
                <User size={20} />
              </button>
            ) : (
              <Link href="/auth">
                <button className="text-foreground/70 hover:text-[#ff0033] transition-colors font-montserrat text-sm font-bold uppercase tracking-widest">
                  Login
                </button>
              </Link>
            )}

            {dropdownOpen && user && (
              <div className="absolute right-0 mt-4 w-48 bg-black border border-white/10 rounded-md shadow-2xl py-2 z-50 glassmorphism-dark">
                <div className="px-4 py-2 border-b border-white/10">
                  <p className="text-sm text-foreground font-poppins">{user.name}</p>
                  <p className="text-xs text-foreground/60 capitalize">{user.role}</p>
                </div>

                <Link href="/profile" onClick={() => setDropdownOpen(false)}>
                  <span className="flex items-center px-4 py-2 text-sm text-foreground/70 hover:bg-[#ff0033] hover:text-white cursor-pointer transition-colors mt-1">
                    <User size={16} className="mr-2" /> My Profile
                  </span>
                </Link>
                
                {user.role === 'admin' && (
                  <Link href="/admin" onClick={() => setDropdownOpen(false)}>
                    <span className="flex items-center px-4 py-2 text-sm text-foreground/70 hover:bg-[#ff0033] hover:text-white cursor-pointer transition-colors">
                      <Settings size={16} className="mr-2" /> Admin Dashboard
                    </span>
                  </Link>
                )}
                {user.role === 'coadmin' && (
                  <Link href="/admin" onClick={() => setDropdownOpen(false)}>
                    <span className="flex items-center px-4 py-2 text-sm text-foreground/70 hover:bg-[#ff0033] hover:text-white cursor-pointer transition-colors">
                      <Settings size={16} className="mr-2" /> Staff Dashboard
                    </span>
                  </Link>
                )}
                
                <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-foreground/70 hover:bg-[#ff0033] hover:text-white cursor-pointer transition-colors">
                  <LogOut size={16} className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile View (Minimalist) */}
        <div className="md:hidden flex items-center space-x-4">
          {mounted && (
            <button 
              onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
              className="text-foreground/70 hover:text-[#ff0033] transition-colors"
            >
              {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
