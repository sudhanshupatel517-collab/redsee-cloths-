'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setCredentials } from '@/store/authSlice';
import api from '@/lib/axios';

export default function CreatePasswordPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = password, 2 = otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password Validation State
  const validation = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const isValid = Object.values(validation).every(Boolean) && password === confirmPassword;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/send-password-otp', { password });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/verify-password-setup', { otp });
      if (res.data.hasPassword && user) {
        dispatch(setCredentials({ ...user, hasPassword: true }));
        router.push('/profile');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#ff0033]/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff0033]/10 blur-[150px] rounded-full pointer-events-none opacity-50" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#ff0033]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#ff0033]/20 shadow-[0_0_20px_rgba(255,0,51,0.2)]">
            <KeyRound size={28} className="text-[#ff0033]" />
          </div>
          <h1 className="text-3xl font-bebas text-white tracking-widest uppercase">Secure Account</h1>
          <p className="text-gray-400 font-poppins text-sm mt-2">
            {step === 1 ? 'Create a secure password to access your account features.' : `Enter the 6-digit code sent to ${user?.email}`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-poppins text-center">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOtp}
              className="space-y-6"
            >
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 focus:border-[#ff0033] rounded-xl px-12 py-4 text-white font-poppins text-sm transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 focus:border-[#ff0033] rounded-xl px-12 py-4 text-white font-poppins text-sm transition-all outline-none"
                  required
                />
              </div>

              <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-2">
                <p className="text-xs text-gray-400 font-montserrat uppercase tracking-widest mb-2">Requirements:</p>
                <div className="grid grid-cols-2 gap-2 text-xs font-poppins">
                  <span className={validation.length ? 'text-green-500' : 'text-gray-500'}>✓ 8+ Characters</span>
                  <span className={validation.upper ? 'text-green-500' : 'text-gray-500'}>✓ 1 Uppercase</span>
                  <span className={validation.lower ? 'text-green-500' : 'text-gray-500'}>✓ 1 Lowercase</span>
                  <span className={validation.number ? 'text-green-500' : 'text-gray-500'}>✓ 1 Number</span>
                  <span className={validation.special ? 'text-green-500' : 'text-gray-500'}>✓ 1 Special Char</span>
                  <span className={password === confirmPassword && password ? 'text-green-500' : 'text-gray-500'}>✓ Matches</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isValid || loading}
                className={`w-full py-4 rounded-xl font-montserrat font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center ${
                  isValid && !loading
                    ? 'bg-[#ff0033] text-white hover:bg-[#cc0029] hover:shadow-[0_0_20px_rgba(255,0,51,0.4)]'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Continue'}
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp}
              className="space-y-6"
            >
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-black/50 border border-white/10 focus:border-[#ff0033] rounded-xl px-6 py-4 text-center text-white font-bebas text-3xl tracking-[1em] transition-all outline-none"
                required
              />

              <button
                type="submit"
                disabled={otp.length !== 6 || loading}
                className={`w-full py-4 rounded-xl font-montserrat font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center ${
                  otp.length === 6 && !loading
                    ? 'bg-[#ff0033] text-white hover:bg-[#cc0029] hover:shadow-[0_0_20px_rgba(255,0,51,0.4)]'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify & Secure'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-gray-500 hover:text-white font-poppins text-xs transition-colors"
              >
                Go Back
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
