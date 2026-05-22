'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import { RootState } from '@/store/store';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import { Mail, Lock, User, ArrowRight, Globe, Loader2 } from 'lucide-react';
import { auth, googleProvider } from '@/firebase/config';
import { signInWithPopup } from 'firebase/auth';
import { useTheme } from 'next-themes';

type AuthView = 'login' | 'signup' | 'forgot' | 'verify_email' | 'google_onboarding';

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
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [googleData, setGoogleData] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');

  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const currentTheme = resolvedTheme || 'dark';

  useEffect(() => {
    setMounted(true);
    if (user) {
      if (user.role === 'admin' || user.role === 'coadmin') router.push('/admin');
      else router.push('/');
    }
  }, [user, router]);

  const handleSuccess = (data: any) => {
    dispatch(setCredentials(data));
    if (data.role === 'admin' || data.role === 'coadmin') router.push('/admin');
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
        // Send OTP request to backend
        await api.post('/api/auth/send-email-otp', { name, email, password });
        setOtpSent(true);
        setView('verify_email');
      } else if (view === 'forgot') {
        setError('Password reset link sent to your email.');
        setTimeout(() => setView('login'), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/verify-email-otp', { email, otp });
      handleSuccess(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid verification code.');
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
      
      if (data.isNewUser) {
        setGoogleData({
          idToken,
          email: data.email,
          name: data.name,
          avatar: data.avatar
        });
        setName(data.name || '');
        setView('google_onboarding');
      } else {
        handleSuccess(data);
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      
      let errorMessage = 'Google Sign-In failed. Please try again.';
      if (err.response?.data?.message) {
        errorMessage = `Backend Error: ${err.response.data.message}`;
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed before completing.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for OAuth operations. Check your Firebase console.';
      } else if (err.code === 'auth/invalid-api-key') {
        errorMessage = 'Firebase API key is invalid or missing in production environment.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/google-signup', {
        ...googleData,
        name,
        phone,
        gender
      });
      handleSuccess(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Removed phone auth logic

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-20 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7a0000]/20 via-black to-black z-0"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff0033]/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#7a0000]/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      <div id="recaptcha-container"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md p-8 md:p-10 glassmorphism-dark border border-border rounded-2xl z-10 relative shadow-2xl backdrop-blur-2xl"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-6"
          >
             {mounted ? (
               <img src={currentTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png'} alt="REDSEE" className="h-16 object-contain" />
             ) : (
               <div className="h-16 w-32 bg-transparent"></div>
             )}
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bebas text-foreground tracking-widest mb-2 uppercase">
            {view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : view === 'forgot' ? 'Reset Password' : view === 'verify_email' ? 'Verify Email' : 'Complete Profile'}
          </h2>
          <p className="text-foreground/60 font-poppins text-sm">
            {view === 'login' ? 'Access the next generation of streetwear.' : 
             view === 'signup' ? 'Join the futuristic fashion revolution.' : 
             view === 'verify_email' ? `We sent a code to ${email}` : 
             view === 'google_onboarding' ? 'Almost there! Add a few details.' : 'We will send you reset instructions.'}
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center font-poppins">
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.div
              key="login-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Primary Authentication Methods */}
              <div className="space-y-4">
                <button 
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full relative group flex items-center justify-center space-x-3 bg-foreground text-background py-3.5 rounded-lg font-montserrat font-semibold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] overflow-hidden"
                >
                  <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="relative z-10">Continue with Google</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                </button>
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink-0 mx-4 text-foreground/50 text-xs font-montserrat lowercase tracking-widest">or sign in with email</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full bg-background/50 border border-border focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3.5 text-foreground outline-none transition-all focus:shadow-[0_0_10px_rgba(255,0,51,0.2)]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-background/50 border border-border focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3.5 text-foreground outline-none transition-all focus:shadow-[0_0_10px_rgba(255,0,51,0.2)]"
                      required
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <button type="button" onClick={() => setView('forgot')} className="text-xs text-foreground/50 hover:text-[#ff0033] transition-colors">Forgot Password?</button>
                  </div>
                </div>
                
                <button disabled={loading} type="submit" className="w-full relative group bg-transparent border border-border hover:border-[#ff0033] text-foreground font-montserrat font-bold tracking-widest uppercase py-3.5 rounded-lg transition-all overflow-hidden flex justify-center items-center">
                  <span className="relative z-10 flex items-center space-x-2">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-[#ff0033]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </form>

              <p className="mt-8 text-center text-foreground/60 text-sm font-poppins">
                Don't have an account? <button onClick={() => setView('signup')} className="text-[#ff0033] hover:text-foreground transition-colors font-bold ml-1">Create Account</button>
              </p>
            </motion.div>
          )}

          {view === 'verify_email' && (
            <motion.form 
              key="verify-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp} 
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase mb-2">Enter 6-Digit Code</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full bg-background/50 border border-border focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3.5 text-foreground tracking-[0.5em] font-bold text-center outline-none transition-colors focus:shadow-[0_0_10px_rgba(255,0,51,0.2)]"
                    required
                  />
                </div>
              </div>
              
              <button disabled={loading} type="submit" className="w-full relative group bg-[#ff0033] hover:bg-[#cc0029] text-foreground font-montserrat font-bold tracking-widest uppercase py-3.5 rounded-lg transition-all overflow-hidden flex justify-center items-center shadow-[0_0_15px_rgba(255,0,51,0.3)] hover:shadow-[0_0_25px_rgba(255,0,51,0.5)]">
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify Email'}
              </button>

              <button type="button" onClick={() => setView('signup')} className="w-full text-center text-sm text-foreground/60 hover:text-foreground transition-colors mt-4">
                Back to Sign Up
              </button>
            </motion.form>
          )}

          {view === 'google_onboarding' && (
            <motion.form 
              key="google-onboarding-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleGoogleSignup} 
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background/50 border border-border focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3.5 text-foreground outline-none transition-colors focus:shadow-[0_0_10px_rgba(255,0,51,0.2)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase mb-2">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50 font-poppins text-sm">+91</span>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-background/50 border border-border focus:border-[#ff0033] rounded-lg pl-14 pr-4 py-3.5 text-foreground outline-none transition-colors focus:shadow-[0_0_10px_rgba(255,0,51,0.2)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase mb-2">Preference</label>
                <div className="relative">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-background/50 border border-border focus:border-[#ff0033] rounded-lg pl-4 pr-10 py-3.5 text-foreground outline-none transition-colors focus:shadow-[0_0_10px_rgba(255,0,51,0.2)] appearance-none"
                    required
                  >
                    <option value="Male">Men's Fashion</option>
                    <option value="Female">Women's Fashion</option>
                    <option value="Other">Unisex / All</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50 text-xs">▼</div>
                </div>
              </div>
              
              <button disabled={loading} type="submit" className="w-full relative group bg-[#ff0033] hover:bg-[#cc0029] text-foreground font-montserrat font-bold tracking-widest uppercase py-3.5 rounded-lg transition-all overflow-hidden flex justify-center items-center shadow-[0_0_15px_rgba(255,0,51,0.3)] hover:shadow-[0_0_25px_rgba(255,0,51,0.5)]">
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Complete Registration'}
              </button>

              <button type="button" onClick={() => setView('login')} className="w-full text-center text-sm text-foreground/60 hover:text-foreground transition-colors mt-4">
                Cancel
              </button>
            </motion.form>
          )}

          {(view === 'signup' || view === 'forgot') && (
            <motion.div 
              key="email-form-container"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {view === 'signup' && (
                <>
                  <button 
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full relative group flex items-center justify-center space-x-3 bg-foreground text-background py-3.5 rounded-lg font-montserrat font-semibold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] overflow-hidden"
                  >
                    <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="relative z-10">Continue with Google</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                  </button>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink-0 mx-4 text-foreground/50 text-xs font-montserrat lowercase tracking-widest">or sign up with email</span>
                    <div className="flex-grow border-t border-border"></div>
                  </div>
                </>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-5">
                {view === 'signup' && (
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-background/50 border border-border focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3.5 text-foreground outline-none transition-colors focus:shadow-[0_0_10px_rgba(255,0,51,0.2)]"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background/50 border border-border focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3.5 text-foreground outline-none transition-colors focus:shadow-[0_0_10px_rgba(255,0,51,0.2)]"
                    required
                  />
                </div>
              </div>

              {view !== 'forgot' && (
                <div>
                  <label className="block text-xs font-montserrat tracking-widest text-foreground/60 uppercase mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-background/50 border border-border focus:border-[#ff0033] rounded-lg pl-12 pr-4 py-3.5 text-foreground outline-none transition-colors focus:shadow-[0_0_10px_rgba(255,0,51,0.2)]"
                      required
                    />
                  </div>
                </div>
              )}
              
              <button disabled={loading} type="submit" className="w-full relative group bg-[#ff0033] hover:bg-[#cc0029] text-foreground font-montserrat font-bold tracking-widest uppercase py-3.5 rounded-lg transition-all overflow-hidden flex justify-center items-center shadow-[0_0_15px_rgba(255,0,51,0.3)] hover:shadow-[0_0_25px_rgba(255,0,51,0.5)]">
                <span className="relative z-10 flex items-center space-x-2">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <span>{view === 'signup' ? 'Create Account' : 'Reset Password'}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
              </button>

              <p className="mt-8 text-center text-foreground/60 text-sm font-poppins">
                Already a member? <button type="button" onClick={() => setView('login')} className="text-[#ff0033] hover:text-foreground transition-colors font-bold ml-1">Sign In</button>
              </p>
            </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust Signals Footer */}
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-center space-x-2 text-foreground/50 text-xs font-poppins">
           <svg className="w-4 h-4 text-[#ff0033]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
           </svg>
           <span>Securely encrypted & powered by Firebase</span>
        </div>

      </motion.div>
    </div>
  );
}
