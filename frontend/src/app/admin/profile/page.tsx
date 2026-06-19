'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setCredentials } from '@/store/authSlice';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Edit2, 
  Save, 
  X, 
  Loader2,
  Lock,
  ShieldAlert
} from 'lucide-react';

export default function AdminProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const updatePayload: any = {
        name: formData.name,
        phone: formData.phone,
      };

      if (formData.password) {
        updatePayload.password = formData.password;
      }

      const { data } = await api.put('/api/users/profile', updatePayload);
      dispatch(setCredentials(data));
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      
      // Clear password fields
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error: any) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to update profile', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  return (
    <div className="w-full py-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200 dark:border-white/10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bebas text-foreground tracking-widest uppercase">Staff Profile</h1>
          <p className="text-foreground/60 font-poppins text-sm mt-1">Manage your administrative credentials and security settings.</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-foreground/5 hover:bg-foreground/10 text-foreground px-4 py-2 rounded-lg border border-border transition-colors font-montserrat text-xs tracking-widest uppercase shadow-sm"
          >
            <Edit2 size={14} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <button 
            onClick={() => {
              setIsEditing(false);
              setMessage({ text: '', type: '' });
              if (user) {
                setFormData({
                  name: user.name || '',
                  email: user.email || '',
                  phone: user.phone || '',
                  password: '',
                  confirmPassword: ''
                });
              }
            }}
            className="flex items-center space-x-2 text-foreground/60 hover:text-foreground px-4 py-2 rounded-lg border border-transparent transition-colors font-montserrat text-xs tracking-widest uppercase"
          >
            <X size={14} />
            <span>Cancel</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 p-4 rounded-lg font-poppins text-sm border ${
              message.type === 'success' 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Info card */}
        <div className="bg-foreground/5 border border-border p-6 rounded-xl flex items-center space-x-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff0033] to-[#7a0000] border border-[#ff0033]/50 flex items-center justify-center text-white">
            <span className="font-bebas text-2xl tracking-widest">{user?.name?.charAt(0) || 'S'}</span>
          </div>
          <div>
            <h3 className="text-xl font-montserrat font-bold text-foreground tracking-wide">{user?.name}</h3>
            <p className="text-[#ff0033] font-montserrat text-xs font-bold uppercase tracking-widest mt-0.5">
              {user?.role === 'admin' ? 'Super Admin' : 'Staff Member (Coadmin)'}
            </p>
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-background border border-border focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3 text-foreground outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                disabled
                className="w-full bg-background border border-border rounded-lg pl-12 pr-4 py-3 text-foreground outline-none opacity-50 cursor-not-allowed"
              />
            </div>
            {isEditing && (
              <span className="text-[10px] text-foreground/40 font-poppins flex items-center mt-1">
                <ShieldAlert size={12} className="mr-1" /> Contact system administrator to change email.
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-background border border-border focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3 text-foreground outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Password Reset Section (Only shown when editing) */}
        {isEditing && (
          <div className="pt-6 border-t border-border space-y-6">
            <h2 className="text-xl font-bebas text-foreground tracking-widest uppercase flex items-center">
              <Lock size={18} className="mr-2 text-[#ff0033]" /> Change Password
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase">New Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full bg-background border border-border focus:border-[#ff0033] rounded-lg px-4 py-3 text-foreground outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase">Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="w-full bg-background border border-border focus:border-[#ff0033] rounded-lg px-4 py-3 text-foreground outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="pt-6 flex justify-end">
            <button 
              disabled={loading} 
              type="submit" 
              className="bg-[#ff0033] hover:bg-[#cc0029] text-white font-montserrat font-bold tracking-widest uppercase px-6 py-3 rounded-lg transition-colors flex justify-center items-center shadow-lg shadow-[#ff0033]/20"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <Save className="mr-2" size={16} />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
