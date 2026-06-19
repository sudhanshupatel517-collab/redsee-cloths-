'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQPage() {
  const faqs: FAQItem[] = [
    {
      q: "What is your return policy?",
      a: "We offer a hassle-free 4-day replacement policy on all items. If you receive a product that is sized incorrectly, has a defect, or does not match your expectations, you can request a replacement or return from your profile details dashboard."
    },
    {
      q: "How long does shipping take?",
      a: "Our standard delivery takes 3-5 business days depending on your delivery address. Express shipping options take 1-2 business days. Tracking details will be generated and shown in your profile orders section."
    },
    {
      q: "Are the drops limited edition?",
      a: "Yes, most of our collections are designed in highly limited quantities as exclusive drops. We rarely restock sold-out items to preserve the exclusivity of the streetwear design."
    },
    {
      q: "How can I track my order?",
      a: "Once your order has been packed and shipped, a tracking number and courier link will be displayed on your personal profile dashboard and under 'My Orders'. You can also view progress live through our stepper progress bar."
    },
    {
      q: "Which payment methods do you support?",
      a: "We support Visa, Mastercard, UPI payment modes, Razorpay checkout, Paytm wallet, and Cash on Delivery (COD) on eligible pin codes."
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="pt-16 pb-24 min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-montserrat font-bold tracking-[0.3em] text-[#ff0033] block mb-2">COMMON INQUIRIES</span>
          <h1 className="text-5xl md:text-6xl font-bebas text-zinc-900 dark:text-white tracking-widest uppercase">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <div className="w-16 h-1 bg-[#ff0033] mx-auto mt-4 rounded"></div>
        </div>

        <div className="space-y-4 font-poppins">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className="bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-montserrat font-bold text-sm text-black dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={`text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#ff0033]' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-zinc-500 dark:text-gray-400 leading-relaxed border-t border-zinc-150 dark:border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
