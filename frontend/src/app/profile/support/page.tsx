'use client';

import { HeadphonesIcon, MessageCircle, HelpCircle, FileText } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="text-zinc-800 dark:text-zinc-100">
      <h1 className="text-2xl md:text-3xl font-bebas text-zinc-900 dark:text-white tracking-widest uppercase mb-1">Customer Care</h1>
      <p className="text-zinc-600 dark:text-gray-400 font-poppins text-sm mb-8">We're here to help you with any issues.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <button className="flex items-center p-6 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl hover:border-[#ff0033]/50 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all group text-left cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-[#ff0033]/10 flex items-center justify-center mr-4 group-hover:bg-[#ff0033]/20 transition-colors">
            <MessageCircle className="text-[#ff0033]" />
          </div>
          <div>
            <h3 className="text-zinc-800 dark:text-white font-montserrat font-bold mb-1">Live Chat</h3>
            <p className="text-zinc-500 dark:text-gray-550 text-xs font-poppins">Chat with our support team instantly</p>
          </div>
        </button>

        <button className="flex items-center p-6 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl hover:border-[#ff0033]/50 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all group text-left cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center mr-4 group-hover:bg-zinc-200 dark:group-hover:bg-white/10 transition-colors">
            <FileText className="text-zinc-500 dark:text-gray-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="text-zinc-800 dark:text-white font-montserrat font-bold mb-1">Submit a Ticket</h3>
            <p className="text-zinc-500 dark:text-gray-550 text-xs font-poppins">Report an issue with an order</p>
          </div>
        </button>

        <button className="flex items-center p-6 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl hover:border-[#ff0033]/50 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all group text-left cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center mr-4 group-hover:bg-zinc-200 dark:group-hover:bg-white/10 transition-colors">
            <HelpCircle className="text-zinc-500 dark:text-gray-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="text-zinc-800 dark:text-white font-montserrat font-bold mb-1">FAQs</h3>
            <p className="text-zinc-500 dark:text-gray-550 text-xs font-poppins">Find quick answers to common questions</p>
          </div>
        </button>

        <button className="flex items-center p-6 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl hover:border-[#ff0033]/50 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all group text-left cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center mr-4 group-hover:bg-zinc-200 dark:group-hover:bg-white/10 transition-colors">
            <HeadphonesIcon className="text-zinc-500 dark:text-gray-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="text-zinc-800 dark:text-white font-montserrat font-bold mb-1">Contact Details</h3>
            <p className="text-zinc-500 dark:text-gray-550 text-xs font-poppins">Email or call our support lines</p>
          </div>
        </button>
      </div>

      <div className="border-t border-zinc-200 dark:border-white/10 pt-8">
        <h2 className="text-lg font-bebas text-zinc-900 dark:text-white tracking-widest uppercase mb-4">Recent Support Tickets</h2>
        <div className="flex flex-col items-center justify-center py-10 text-center bg-zinc-50 dark:bg-black/40 rounded-xl border border-zinc-200 dark:border-white/5">
          <p className="text-zinc-500 dark:text-gray-500 font-poppins text-sm">You have no active support tickets.</p>
        </div>
      </div>
    </div>
  );
}
