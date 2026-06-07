'use client';

import { Settings, Shield, Globe, Bell } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="w-full py-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bebas text-foreground tracking-widest uppercase">Platform Settings</h1>
          <p className="text-foreground/60 font-poppins text-sm mt-1">Configure global store preferences and integrations.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-foreground/5 border border-border rounded-xl p-6">
            <div className="flex items-center mb-6">
              <Globe className="text-[#ff0033] mr-3" size={24} />
              <h2 className="text-xl font-bebas tracking-widest text-foreground">Store Details</h2>
            </div>
            <div className="space-y-4 font-poppins">
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase mb-2">Store Name</label>
                <input type="text" defaultValue="Redsee Clothing" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground outline-none" disabled />
              </div>
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase mb-2">Support Email</label>
                <input type="text" defaultValue="support@redsee.com" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground outline-none" disabled />
              </div>
            </div>
          </div>

          <div className="bg-foreground/5 border border-border rounded-xl p-6">
            <div className="flex items-center mb-6">
              <Shield className="text-[#ff0033] mr-3" size={24} />
              <h2 className="text-xl font-bebas tracking-widest text-foreground">Security Preferences</h2>
            </div>
            <p className="text-sm text-foreground/70 font-poppins mb-4">Enforce Two-Factor Authentication (2FA) for all staff members.</p>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-6 bg-[#ff0033] rounded-full relative cursor-not-allowed opacity-80">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
              </div>
              <span className="text-sm font-montserrat text-foreground">Enabled (Required)</span>
            </div>
          </div>

          <div className="bg-foreground/5 border border-border rounded-xl p-6">
            <div className="flex items-center mb-6">
              <Bell className="text-[#ff0033] mr-3" size={24} />
              <h2 className="text-xl font-bebas tracking-widest text-foreground">System Alerts</h2>
            </div>
            <p className="text-sm text-foreground/70 font-poppins">Receive email alerts for out-of-stock items and server errors.</p>
            <div className="mt-4 flex items-center space-x-3">
              <button className="bg-[#ff0033]/10 text-[#ff0033] border border-[#ff0033]/20 px-4 py-2 rounded-lg text-xs font-montserrat font-bold tracking-widest uppercase cursor-not-allowed">
                Configured
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
