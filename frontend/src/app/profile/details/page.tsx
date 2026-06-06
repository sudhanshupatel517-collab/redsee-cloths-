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
  MapPin, 
  Edit2, 
  Save, 
  X, 
  Loader2,
  Camera
} from 'lucide-react';

export default function MyProfilePage() {
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
    gender: 'Other',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'Other',
        address: user.addresses?.[0] || {
          street: '', city: '', state: '', zipCode: '', country: ''
        }
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (['street', 'city', 'state', 'zipCode', 'country'].includes(name)) {
      setFormData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { data } = await api.put('/api/users/profile', formData);
      dispatch(setCredentials(data));
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
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
    <div className="relative">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200 dark:border-white/10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bebas text-black dark:text-white tracking-widest uppercase">My Profile</h1>
          <p className="text-zinc-500 dark:text-gray-400 font-poppins text-sm mt-1">Manage your personal information and preferences.</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.05] dark:hover:bg-white/10 text-zinc-850 dark:text-white px-4 py-2 rounded-lg border border-zinc-200 dark:border-white/10 transition-colors font-montserrat text-sm tracking-widest uppercase shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-md"
          >
            <Edit2 size={16} />
            <span className="hidden sm:inline">Edit Profile</span>
          </button>
        ) : (
          <button 
            onClick={() => {
              setIsEditing(false);
              setMessage({ text: '', type: '' });
            }}
            className="flex items-center space-x-2 bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-550 dark:text-gray-400 hover:text-black dark:hover:text-white px-4 py-2 rounded-lg border border-transparent transition-colors font-montserrat text-sm tracking-widest uppercase"
          >
            <X size={16} />
            <span className="hidden sm:inline">Cancel</span>
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

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Profile Avatar Section */}
        <div className="flex items-center space-x-6 bg-zinc-100 dark:bg-black/20 p-6 rounded-xl border border-zinc-200 dark:border-white/5">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#ff0033] to-[#7a0000] border-2 border-[#ff0033]/50 shadow-[0_0_20px_rgba(255,0,51,0.2)]">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-bebas text-white text-4xl tracking-widest">{user?.name?.charAt(0) || 'U'}</span>
                </div>
              )}
            </div>
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <Camera size={20} className="text-white mb-1" />
                <span className="text-[10px] text-white font-montserrat font-bold uppercase tracking-wider">Change</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-montserrat font-bold text-black dark:text-white tracking-wide">{user?.name}</h3>
            <p className="text-zinc-500 dark:text-gray-400 font-poppins text-sm mt-1">{user?.role === 'admin' ? 'Super Admin' : user?.role === 'coadmin' ? 'Staff Member' : 'Premium Member'}</p>
          </div>
        </div>

        {/* Personal Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-montserrat tracking-widest text-zinc-550 dark:text-gray-500 uppercase">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3.5 text-black dark:text-white outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-montserrat tracking-widest text-zinc-550 dark:text-gray-500 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                disabled // Email should typically not be easily changeable without verification
                className="w-full bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3.5 text-zinc-650 dark:text-gray-400 outline-none transition-colors opacity-50 cursor-not-allowed"
                required
              />
            </div>
            {isEditing && <span className="text-[10px] text-zinc-500 dark:text-gray-500 font-poppins mt-1 block">Email address cannot be changed directly.</span>}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-montserrat tracking-widest text-zinc-550 dark:text-gray-500 uppercase">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3.5 text-black dark:text-white outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-montserrat tracking-widest text-zinc-550 dark:text-gray-500 uppercase">Shopping Preference</label>
            <div className="relative">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg pl-4 pr-10 py-3.5 text-black dark:text-white outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
              >
                <option value="Male" className="bg-white dark:bg-black text-black dark:text-white">Men's Fashion</option>
                <option value="Female" className="bg-white dark:bg-black text-black dark:text-white">Women's Fashion</option>
                <option value="Other" className="bg-white dark:bg-black text-black dark:text-white">Unisex / All</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 dark:text-gray-500 text-xs">▼</div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="pt-6 border-t border-zinc-200 dark:border-white/10">
          <h2 className="text-lg font-bebas text-black dark:text-white tracking-widest uppercase mb-4 flex items-center">
            <MapPin size={20} className="mr-2 text-[#ff0033]" /> Default Shipping Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-montserrat tracking-widest text-zinc-550 dark:text-gray-500 uppercase">Street Address</label>
              <input 
                type="text" 
                name="street"
                value={formData.address.street}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Flat / House No. / Building"
                className="w-full bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3.5 text-black dark:text-white outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-montserrat tracking-widest text-zinc-550 dark:text-gray-500 uppercase">City</label>
              <input 
                type="text" 
                name="city"
                value={formData.address.city}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3.5 text-black dark:text-white outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-montserrat tracking-widest text-zinc-550 dark:text-gray-500 uppercase">State / Province</label>
              <input 
                type="text" 
                name="state"
                value={formData.address.state}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3.5 text-black dark:text-white outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-montserrat tracking-widest text-zinc-550 dark:text-gray-500 uppercase">Zip / Postal Code</label>
              <input 
                type="text" 
                name="zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3.5 text-black dark:text-white outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-montserrat tracking-widest text-zinc-550 dark:text-gray-500 uppercase">Country</label>
              <input 
                type="text" 
                name="country"
                value={formData.address.country}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3.5 text-black dark:text-white outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-6 flex justify-end"
            >
              <button 
                disabled={loading} 
                type="submit" 
                className="relative group bg-[#ff0033] hover:bg-[#cc0029] text-white font-montserrat font-bold tracking-widest uppercase px-8 py-3.5 rounded-lg transition-all overflow-hidden flex justify-center items-center shadow-[0_0_15px_rgba(255,0,51,0.3)] hover:shadow-[0_0_25px_rgba(255,0,51,0.5)]"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <Save size={18} />
                      <span>Save Changes</span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
