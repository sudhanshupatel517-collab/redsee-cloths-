'use client';

import { useState } from 'react';
import { Settings, Shield, Bell, Key, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setCredentials } from '@/store/authSlice';

export default function SettingsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = passwords, 2 = OTP
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Notification States
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.hasPassword && !currentPassword) {
      setMessage({ text: 'Current password is required', type: 'error' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }
    if (password.length < 8) {
      setMessage({ text: 'Password must be at least 8 characters', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await api.post('/api/auth/send-password-otp', { currentPassword, password });
      setStep(2);
      setMessage({ text: `OTP sent to ${user?.email}`, type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.response?.data?.message || 'Failed to send OTP', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await api.post('/api/auth/verify-password-setup', { otp });
      if (res.data.hasPassword && user) {
        dispatch(setCredentials({ ...user, hasPassword: true }));
      }
      setMessage({ text: 'Password updated successfully!', type: 'success' });
      setIsChangingPassword(false);
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
      setOtp('');
      setStep(1);
    } catch (error: any) {
      setMessage({ text: error.response?.data?.message || 'Invalid OTP', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };
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
          <p className="text-gray-500 font-poppins text-sm mb-4">Set or update your password to enable email login.</p>
          
          <AnimatePresence>
            {message.text && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-4 p-3 rounded-lg font-poppins text-sm border flex items-center ${
                  message.type === 'success' 
                    ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 size={16} className="mr-2" /> : <XCircle size={16} className="mr-2" />}
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {!isChangingPassword ? (
            <button 
              onClick={() => { setIsChangingPassword(true); setStep(1); }}
              className="border border-white/20 hover:border-[#ff0033] text-white hover:text-[#ff0033] px-6 py-2.5 rounded-lg font-montserrat font-bold text-xs tracking-widest uppercase transition-colors"
            >
              {user?.hasPassword ? 'Change Password' : 'Set Password'}
            </button>
          ) : (
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.form 
                  key="form1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSendOtp} 
                  className="space-y-4 max-w-md"
                >
                  {user?.hasPassword && (
                    <div>
                      <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Current Password</label>
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">New Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Confirm Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-white outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-2.5 rounded-lg font-montserrat font-bold text-xs tracking-widest uppercase transition-colors flex items-center"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : 'Continue'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setMessage({ text: '', type: '' });
                      }}
                      className="border border-white/20 hover:bg-white/5 text-gray-400 hover:text-white px-6 py-2.5 rounded-lg font-montserrat font-bold text-xs tracking-widest uppercase transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
              
              {step === 2 && (
                <motion.form 
                  key="form2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleVerifyOtp} 
                  className="space-y-4 max-w-md"
                >
                  <div>
                    <label className="block text-xs font-montserrat tracking-widest text-gray-500 uppercase mb-2">Enter 6-Digit OTP</label>
                    <input 
                      type="text" 
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-black/40 border border-white/10 focus:border-[#ff0033] rounded-lg px-4 py-3 text-center text-white font-bebas text-2xl tracking-[0.5em] outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button 
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-2.5 rounded-lg font-montserrat font-bold text-xs tracking-widest uppercase transition-colors flex items-center"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : 'Verify & Save'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="border border-white/20 hover:bg-white/5 text-gray-400 hover:text-white px-6 py-2.5 rounded-lg font-montserrat font-bold text-xs tracking-widest uppercase transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          )}
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
              <div 
                onClick={() => setEmailNotif(!emailNotif)}
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${emailNotif ? 'bg-[#ff0033]' : 'bg-gray-700'}`}
              >
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 700, damping: 30 }}
                  className="w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm"
                  style={{ left: emailNotif ? 'auto' : '2px', right: emailNotif ? '2px' : 'auto' }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-montserrat text-sm">SMS Notifications</p>
                <p className="text-gray-500 font-poppins text-xs">Receive delivery updates via text message.</p>
              </div>
              <div 
                onClick={() => setSmsNotif(!smsNotif)}
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${smsNotif ? 'bg-[#ff0033]' : 'bg-gray-700'}`}
              >
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 700, damping: 30 }}
                  className="w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm"
                  style={{ left: smsNotif ? 'auto' : '2px', right: smsNotif ? '2px' : 'auto' }}
                />
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
