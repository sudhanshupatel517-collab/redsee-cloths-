'use client';

import { useState } from 'react';
import { Users, Search, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminUsers() {
  const [search, setSearch] = useState('');

  // Mock users for UI placeholder until backend is connected
  const mockUsers = [
    { _id: 'USR-001', name: 'Aryan Sharma', email: 'aryan@example.com', role: 'user', joined: '2026-05-15' },
    { _id: 'USR-002', name: 'Himanshu Admin', email: 'himanshu4admin9@redsee.com', role: 'admin', joined: '2026-05-01' },
    { _id: 'USR-003', name: 'Sudhanshu Staff', email: 'sudhanshu4coadmin9@redsee.com', role: 'coadmin', joined: '2026-05-05' },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bebas text-foreground tracking-widest uppercase">Manage Users</h1>
            <p className="text-foreground/60 font-poppins text-sm mt-1">View and manage customer accounts and staff roles.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
            <input 
              type="text" 
              placeholder="Search by Name or Email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-foreground/5 border border-border focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3 text-foreground outline-none transition-colors font-poppins text-sm"
            />
          </div>
        </div>

        <div className="bg-foreground/5 border border-border rounded-xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-foreground/[0.02]">
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium">User ID</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium">Name</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium">Email</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium">Role</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockUsers.map((user) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={user._id} 
                    className="hover:bg-foreground/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-poppins font-medium text-foreground">{user._id}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70 font-poppins">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70 font-poppins">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-montserrat tracking-wider uppercase flex items-center w-max space-x-1 ${
                        user.role === 'admin' ? 'bg-[#ff0033]/10 text-[#ff0033] border border-[#ff0033]/20' : 
                        user.role === 'coadmin' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                        'bg-foreground/10 text-foreground/70 border border-border'
                      }`}>
                        {(user.role === 'admin' || user.role === 'coadmin') && <Shield size={12} />}
                        <span>{user.role}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70 font-poppins text-right">{user.joined}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
