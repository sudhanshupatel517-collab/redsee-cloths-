"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Heart, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "glassmorphism-dark py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-3xl font-bebas text-glow text-white tracking-widest cursor-pointer">
            REDSEE
          </h1>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <span className="text-sm font-montserrat uppercase tracking-wide text-gray-300 hover:text-white relative group cursor-pointer">
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#ff0033] transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <button className="text-gray-300 hover:text-[#ff0033] transition-colors">
            <Search size={20} />
          </button>
          <Link href="/wishlist">
            <button className="text-gray-300 hover:text-[#ff0033] transition-colors">
              <Heart size={20} />
            </button>
          </Link>
          <Link href="/cart">
            <button className="text-gray-300 hover:text-[#ff0033] transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-[#ff0033] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </button>
          </Link>
          <Link href="/profile">
            <button className="text-gray-300 hover:text-[#ff0033] transition-colors">
              <User size={20} />
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <Link href="/cart">
            <button className="text-gray-300 hover:text-[#ff0033] transition-colors relative">
              <ShoppingCart size={20} />
            </button>
          </Link>
          <button
            className="text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-[#0A0A0A] flex flex-col items-center pt-10 space-y-6"
          >
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <span
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-bebas tracking-wider text-gray-300 hover:text-[#ff0033] cursor-pointer"
                >
                  {link.name}
                </span>
              </Link>
            ))}
            <div className="flex space-x-8 pt-8">
              <button className="text-gray-300 hover:text-[#ff0033]">
                <Search size={24} />
              </button>
              <button className="text-gray-300 hover:text-[#ff0033]">
                <Heart size={24} />
              </button>
              <button className="text-gray-300 hover:text-[#ff0033]">
                <User size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
