'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Users, Search, Shield, Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StaffManagement() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    permissions: [] as string[]
  });

  const availablePermissions = [
    { id: 'manage_products', label: 'Manage Products' },
    { id: 'manage_inventory', label: 'Manage Inventory' },
    { id: 'manage_orders', label: 'Manage Orders' },
    { id: 'manage_discounts', label: 'Manage Discounts' },
    { id: 'manage_categories', label: 'Manage Categories' },
    { id: 'manage_support', label: 'Customer Support' }
  ];

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/admin');
      return;
    }
    fetchStaff();
  }, [user]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await api.get('/api/admin/coadmins', config);
      setStaff(data);
    } catch (err) {
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permId: string) => {
    setFormData(prev => {
      const currentPerms = Array.isArray(prev.permissions) ? prev.permissions : [];
      return {
        ...prev,
        permissions: currentPerms.includes(permId) 
          ? currentPerms.filter(p => p !== permId)
          : [...currentPerms, permId]
      };
    });
  };

  const openModal = (staffMember?: any) => {
    if (staffMember) {
      setEditingId(staffMember._id);
      setFormData({
        name: staffMember.name,
        email: staffMember.email,
        password: '', // Blank unless they want to change it
        permissions: staffMember.permissions || []
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', email: '', password: '', permissions: [] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      if (editingId) {
        await api.put(`/api/admin/coadmins/${editingId}`, formData, config);
      } else {
        await api.post('/api/admin/coadmins', formData, config);
      }
      fetchStaff();
      closeModal();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving staff member');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        await api.delete(`/api/admin/coadmins/${id}`, config);
        fetchStaff();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Error removing staff');
      }
    }
  };

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bebas text-foreground tracking-widest uppercase">Staff Management</h1>
            <p className="text-foreground/60 font-poppins text-sm mt-1">Control co-admin access and granular permissions.</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="flex items-center space-x-2 bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-3 rounded-lg font-montserrat font-bold tracking-widest uppercase text-sm transition-all shadow-[0_0_15px_rgba(255,0,51,0.3)]"
          >
            <Plus size={18} />
            <span>Add Staff</span>
          </button>
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
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium">Staff Member</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium">Role</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium">Permissions</th>
                  <th className="px-6 py-4 font-montserrat text-xs tracking-widest text-foreground/50 uppercase font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                   <tr><td colSpan={4} className="text-center py-8 text-foreground/50 font-poppins">Loading staff...</td></tr>
                ) : filteredStaff.length === 0 ? (
                   <tr><td colSpan={4} className="text-center py-8 text-foreground/50 font-poppins">No staff members found.</td></tr>
                ) : (
                  filteredStaff.map((s) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={s._id} 
                      className="hover:bg-foreground/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-poppins font-medium text-foreground">{s.name}</p>
                        <p className="text-xs text-foreground/50 font-poppins">{s.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-montserrat tracking-wider uppercase flex items-center w-max space-x-1 ${
                          s.role === 'admin' ? 'bg-[#ff0033]/10 text-[#ff0033] border border-[#ff0033]/20' : 
                          'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        }`}>
                          <Shield size={12} />
                          <span>{s.role}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-poppins text-foreground/70">
                        {s.role === 'admin' ? 'All Permissions' : s.permissions?.length > 0 ? s.permissions.join(', ') : 'None'}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button onClick={() => openModal(s)} className="text-foreground/50 hover:text-foreground transition-colors p-2 hover:bg-foreground/5 rounded-lg inline-flex">
                          <Edit2 size={16} />
                        </button>
                        {s.role !== 'admin' && (
                          <button onClick={() => handleDelete(s._id)} className="text-foreground/50 hover:text-[#ff0033] transition-colors p-2 hover:bg-[#ff0033]/10 rounded-lg inline-flex">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background border border-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-foreground/[0.02]">
                <h2 className="text-2xl font-bebas tracking-widest text-foreground">{editingId ? 'Edit Staff' : 'Create Staff'}</h2>
                <button onClick={closeModal} className="text-foreground/50 hover:text-foreground">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase mb-2">Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-foreground/5 border border-border rounded-lg px-4 py-2.5 text-foreground outline-none focus:border-[#ff0033] font-poppins text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase mb-2">Email</label>
                    <input 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-foreground/5 border border-border rounded-lg px-4 py-2.5 text-foreground outline-none focus:border-[#ff0033] font-poppins text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase mb-2">Password {editingId && '(Leave blank to keep current)'}</label>
                    <input 
                      type="password" 
                      required={!editingId}
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-foreground/5 border border-border rounded-lg px-4 py-2.5 text-foreground outline-none focus:border-[#ff0033] font-poppins text-sm transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase mb-4">Permissions</label>
                  <div className="grid grid-cols-2 gap-3">
                    {availablePermissions.map(perm => {
                      const isChecked = Array.isArray(formData.permissions) ? formData.permissions.includes(perm.id) : false;
                      return (
                        <div 
                          key={perm.id} 
                          className="flex items-center space-x-3 cursor-pointer group"
                          onClick={() => {
                            let newPerms = [];
                            if (Array.isArray(formData.permissions)) {
                              if (formData.permissions.includes(perm.id)) {
                                newPerms = formData.permissions.filter(p => p !== perm.id);
                              } else {
                                newPerms = [...formData.permissions, perm.id];
                              }
                            } else {
                              newPerms = [perm.id];
                            }
                            setFormData({ ...formData, permissions: newPerms });
                          }}
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-[#ff0033] border-[#ff0033]' : 'bg-transparent border-border group-hover:border-foreground/50'}`}>
                            {isChecked && <span className="text-white text-xs">✓</span>}
                          </div>
                          <span className="text-sm font-poppins text-foreground/80 group-hover:text-foreground transition-colors select-none">
                            {perm.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end space-x-3">
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="px-6 py-2.5 rounded-lg font-montserrat text-xs tracking-widest uppercase font-bold text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 rounded-lg font-montserrat text-xs tracking-widest uppercase font-bold bg-[#ff0033] hover:bg-[#cc0029] text-white transition-colors"
                  >
                    Save Staff
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
