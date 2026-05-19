'use client';

import { HeadphonesIcon, MessageCircle, HelpCircle, FileText } from 'lucide-react';

export default function SupportPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bebas text-white tracking-widest uppercase mb-1">Customer Care</h1>
      <p className="text-gray-400 font-poppins text-sm mb-8">We're here to help you with any issues.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <button className="flex items-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#ff0033]/50 hover:bg-white/[0.05] transition-all group text-left">
          <div className="w-12 h-12 rounded-full bg-[#ff0033]/10 flex items-center justify-center mr-4 group-hover:bg-[#ff0033]/20 transition-colors">
            <MessageCircle className="text-[#ff0033]" />
          </div>
          <div>
            <h3 className="text-white font-montserrat font-bold mb-1">Live Chat</h3>
            <p className="text-gray-500 text-xs font-poppins">Chat with our support team instantly</p>
          </div>
        </button>

        <button className="flex items-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#ff0033]/50 hover:bg-white/[0.05] transition-all group text-left">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover:bg-white/10 transition-colors">
            <FileText className="text-gray-400 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="text-white font-montserrat font-bold mb-1">Submit a Ticket</h3>
            <p className="text-gray-500 text-xs font-poppins">Report an issue with an order</p>
          </div>
        </button>

        <button className="flex items-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#ff0033]/50 hover:bg-white/[0.05] transition-all group text-left">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover:bg-white/10 transition-colors">
            <HelpCircle className="text-gray-400 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="text-white font-montserrat font-bold mb-1">FAQs</h3>
            <p className="text-gray-500 text-xs font-poppins">Find quick answers to common questions</p>
          </div>
        </button>

        <button className="flex items-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#ff0033]/50 hover:bg-white/[0.05] transition-all group text-left">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover:bg-white/10 transition-colors">
            <HeadphonesIcon className="text-gray-400 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="text-white font-montserrat font-bold mb-1">Contact Details</h3>
            <p className="text-gray-500 text-xs font-poppins">Email or call our support lines</p>
          </div>
        </button>
      </div>

      <div className="border-t border-white/10 pt-8">
        <h2 className="text-lg font-bebas text-white tracking-widest uppercase mb-4">Recent Support Tickets</h2>
        <div className="flex flex-col items-center justify-center py-10 text-center bg-black/40 rounded-xl border border-white/5">
          <p className="text-gray-500 font-poppins text-sm">You have no active support tickets.</p>
        </div>
      </div>
    </div>
  );
}
