'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="pt-16 pb-24 min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.3em] text-[#ff0033] block mb-2">GET IN TOUCH</span>
          <h1 className="text-5xl md:text-6xl font-bebas text-zinc-900 dark:text-white tracking-widest uppercase">
            CONTACT US
          </h1>
          <div className="w-16 h-1 bg-[#ff0033] mx-auto mt-4 rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bebas text-black dark:text-white tracking-wide mb-4">WE WANT TO HEAR FROM YOU</h2>
              <p className="font-poppins text-zinc-550 dark:text-zinc-400 text-sm leading-relaxed">
                Have questions about our drops, sizing, shipping, or returns? Drop us a line. Our dedicated support team is available 24/7 to make sure you get the best experience.
              </p>
            </div>

            <div className="space-y-6 font-poppins text-sm">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#ff0033]/10 border border-[#ff0033]/20 flex items-center justify-center text-[#ff0033]">
                  <Mail size={16} />
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-xs text-black dark:text-white uppercase tracking-wider">Email Us</h4>
                  <a href="mailto:support@redsee.com" className="text-zinc-550 dark:text-zinc-400 hover:text-[#ff0033] transition-colors">support@redsee.com</a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#ff0033]/10 border border-[#ff0033]/20 flex items-center justify-center text-[#ff0033]">
                  <Phone size={16} />
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-xs text-black dark:text-white uppercase tracking-wider">Call Us</h4>
                  <a href="tel:+919999999999" className="text-zinc-550 dark:text-zinc-400 hover:text-[#ff0033] transition-colors">+91 99999 99999</a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#ff0033]/10 border border-[#ff0033]/20 flex items-center justify-center text-[#ff0033]">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-xs text-black dark:text-white uppercase tracking-wider">Headquarters</h4>
                  <p className="text-zinc-550 dark:text-zinc-400">Redsee Fashion District, New Delhi, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bebas text-black dark:text-white tracking-widest uppercase mb-6">Send Message</h3>
            
            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-poppins text-xs"
                >
                  Thank you! Your message has been received successfully. We will get back to you shortly.
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5 font-poppins">
              <div className="space-y-1">
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Your Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-zinc-500">Message</label>
                <textarea 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-black dark:text-white outline-none transition-colors text-sm resize-none"
                  required
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff0033] hover:bg-[#cc0029] text-white font-montserrat font-bold tracking-widest uppercase py-3 rounded-lg transition-colors flex justify-center items-center shadow-lg shadow-[#ff0033]/10"
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Send className="mr-2" size={14} />}
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
