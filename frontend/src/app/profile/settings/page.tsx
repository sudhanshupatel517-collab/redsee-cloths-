'use client';

import { Settings, Shield, Bell, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bebas text-white tracking-widest uppercase mb-1">Account Settings</h1>
      <p className="text-gray-400 font-poppins text-sm mb-8">Manage your account security and preferences.</p>

      <div className="space-y-6">
        
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <Key className="text-[#ff0033] mr-3" size={20} />
            <h2 className="text-lg font-montserrat font-bold text-white">Password & Security</h2>
          </div>
          <p className="text-gray-500 font-poppins text-sm mb-4">Update your password or enable two-factor authentication.</p>
          <button className="border border-white/20 hover:border-[#ff0033] text-white hover:text-[#ff0033] px-6 py-2.5 rounded-lg font-montserrat font-bold text-xs tracking-widest uppercase transition-colors">
            Change Password
          </button>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <Bell className="text-[#ff0033] mr-3" size={20} />
            <h2 className="text-lg font-montserrat font-bold text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-montserrat text-sm">Email Notifications</p>
                <p className="text-gray-500 font-poppins text-xs">Receive updates on your orders and promotions.</p>
              </div>
              <div className="w-10 h-5 bg-[#ff0033] rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-montserrat text-sm">SMS Notifications</p>
                <p className="text-gray-500 font-poppins text-xs">Receive delivery updates via text message.</p>
              </div>
              <div className="w-10 h-5 bg-gray-700 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <Shield className="text-[#ff0033] mr-3" size={20} />
            <h2 className="text-lg font-montserrat font-bold text-white">Data & Privacy</h2>
          </div>
          <p className="text-gray-500 font-poppins text-sm mb-4">Manage how your data is used or request account deletion.</p>
          <button className="text-red-500 hover:text-red-400 font-montserrat font-bold text-xs tracking-widest uppercase transition-colors">
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}
