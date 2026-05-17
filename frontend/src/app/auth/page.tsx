'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import { RootState } from '@/store/store';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import { Mail, Lock, User, Phone, ArrowRight, Globe, Smartphone, Loader2 } from 'lucide-react';
import { auth, googleProvider, RecaptchaVerifier, signInWithPhoneNumber } from '@/firebase/config';
import { signInWithPopup } from 'firebase/auth';

type AuthView = 'login' | 'signup' | 'forgot' | 'phone';

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

export default function AuthPage() {
  const [view, setView] = useState<AuthView>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') router.push('/admin');
      else if (user.role === 'coadmin') router.push('/staff');
      else router.push('/');
    }
  }, [user, router]);

  const handleSuccess = (data: any) => {
    dispatch(setCredentials(data));
    if (data.role === 'admin') router.push('/admin');
    else if (data.role === 'coadmin') router.push('/staff');
    else router.push('/');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (view === 'login') {
        const { data } = await api.post('/api/auth/login', { email, password });
        handleSuccess(data);
      } else if (view === 'signup') {
        const { data } = await api.post('/api/auth/signup', { name, email, password });
        handleSuccess(data);
      } else if (view === 'forgot') {
        // Implement forgot password API
        setError('Password reset link sent to your email.');
        setTimeout(() => setView('login'), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const { data } = await api.post('/api/auth/google', { 
        idToken,
        email: result.user.email,
        name: result.user.displayName,
        avatar: result.user.photoURL
      });
      
      handleSuccess(data);
    } catch (err: any) {
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!otpSent) {
      try {
        setupRecaptcha();
        const formattedPhone = phone.startsWith('+') ? phone : `+1${phone}`; // Fallback country code, should use a proper selector
        const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
        window.confirmationResult = confirmationResult;
        setOtpSent(true);
      } catch (err: any) {
        setError('Failed to send OTP. Ensure phone number includes country code (+1).');
        if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
      }
    } else {
      try {
        const result = await window.confirmationResult.confirm(otp);
        const idToken = await result.user.getIdToken();
        
        const { data } = await api.post('/api/auth/phone', { 
          idToken,
          phone: result.user.phoneNumber
        });
        
        handleSuccess(data);
      } catch (err: any) {
        setError('Invalid OTP code.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden py-20 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7a0000]/30 via-black to-black z-0"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff0033]/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#7a0000]/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      <div id="recaptcha-container"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-8 glassmorphism-dark border border-white/10 rounded-2xl z-10 relative shadow-2xl backdrop-blur-xl"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bebas text-white tracking-widest mb-2 uppercase">
            {view === 'login' ? 'ACCESS PORTAL' : view === 'signup' ? 'BECOME A MEMBER' : view === 'forgot' ? 'RESET SECRETS' : 'MOBILE LOGIN'}
          </h2>
          <p className="text-gray-400 font-poppins text-sm">
            {view === 'login' ? 'Welcome back to the aesthetic revolution' : 'Join the futuristic fashion revolution'}
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center font-poppins">
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {view === 'phone' ? (
            <motion.form 
              key="phone-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handlePhoneAuth} 
              className="space-y-5"
            >
              {!otpSent ? (
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-gray-400 uppercase mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 8900"
                      className="w-full bg-black/50 border border-white/10 focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-4 text-white outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-gray-400 uppercase mb-2">Enter Verification Code</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="text" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-black/50 border border-white/10 focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-4 text-white tracking-[0.5em] font-bold text-center outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
              )}
              
              <button disabled={loading} type="submit" className="w-full relative group bg-[#ff0033] hover:bg-[#cc0029] text-white font-montserrat font-bold tracking-widest uppercase py-4 rounded-lg transition-all overflow-hidden flex justify-center items-center">
                {loading ? <Loader2 className="animate-spin" size={20} /> : (otpSent ? 'Verify Code' : 'Send Code')}
              </button>

              <button type="button" onClick={() => setView('login')} className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors mt-4">
                Use Email instead
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="email-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleEmailAuth} 
              className="space-y-5"
            >
              {view === 'signup' && (
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-gray-400 uppercase mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-4 text-white outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-montserrat tracking-widest text-gray-400 uppercase mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-4 text-white outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {view !== 'forgot' && (
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-gray-400 uppercase mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-4 text-white outline-none transition-colors"
                      required
                    />
                  </div>
                  {view === 'login' && (
                    <div className="flex justify-end mt-2">
                      <button type="button" onClick={() => setView('forgot')} className="text-xs text-gray-500 hover:text-[#ff0033] transition-colors">Forgot Password?</button>
                    </div>
                  )}
                </div>
              )}
              
              <button disabled={loading} type="submit" className="w-full relative group bg-[#ff0033] hover:bg-[#cc0029] text-white font-montserrat font-bold tracking-widest uppercase py-4 rounded-lg transition-all overflow-hidden flex justify-center items-center">
                <span className="relative z-10 flex items-center space-x-2">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <span>{view === 'login' ? 'Authenticate' : view === 'signup' ? 'Create Account' : 'Reset Password'}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {view === 'login' && (
          <div className="mt-8 space-y-4">
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-montserrat uppercase tracking-widest">Or Continue With</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleGoogleAuth}
                disabled={loading}
                className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-lg text-white font-poppins text-sm transition-colors"
              >
                <Globe size={18} className="text-red-500" />
                <span>Google</span>
              </button>
              
              <button 
                onClick={() => setView('phone')}
                disabled={loading}
                className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-lg text-white font-poppins text-sm transition-colors"
              >
                <Smartphone size={18} className="text-gray-300" />
                <span>Mobile OTP</span>
              </button>
            </div>
          </div>
        )}

        {view === 'login' && (
          <p className="mt-8 text-center text-gray-400 text-sm font-poppins">
            Don't have an account? <button onClick={() => setView('signup')} className="text-[#ff0033] hover:text-white transition-colors font-bold ml-1">Register Now</button>
          </p>
        )}

        {(view === 'signup' || view === 'forgot') && (
          <p className="mt-8 text-center text-gray-400 text-sm font-poppins">
            Already a member? <button onClick={() => setView('login')} className="text-[#ff0033] hover:text-white transition-colors font-bold ml-1">Login Instead</button>
          </p>
        )}

      </motion.div>
    </div>
  );
}
