'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import { RootState } from '@/store/store';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/axios';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const { data } = await api.post('/api/users/register', { name, email, password });
      dispatch(setCredentials(data));
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7a0000]/20 via-black to-black z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 glassmorphism-dark border border-white/10 rounded-2xl z-10 relative"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bebas text-white tracking-widest mb-2">BECOME A MEMBER</h2>
          <p className="text-gray-400 font-poppins text-sm">Join the futuristic fashion revolution</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded text-sm mb-4">{error}</div>}

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-xs font-montserrat tracking-widest text-gray-400 uppercase mb-2">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/50 border border-white/10 focus:border-[#ff0033] rounded px-4 py-3 text-white outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-montserrat tracking-widest text-gray-400 uppercase mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 focus:border-[#ff0033] rounded px-4 py-3 text-white outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-montserrat tracking-widest text-gray-400 uppercase mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 focus:border-[#ff0033] rounded px-4 py-3 text-white outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-montserrat tracking-widest text-gray-400 uppercase mb-2">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 focus:border-[#ff0033] rounded px-4 py-3 text-white outline-none transition-colors"
              required
            />
          </div>
          
          <button type="submit" className="w-full bg-[#ff0033] hover:bg-[#cc0029] text-white font-montserrat font-bold tracking-widest uppercase py-4 rounded transition-colors text-sm">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already a member? <Link href="/login" className="text-[#ff0033] hover:text-white transition-colors">Login Now</Link>
        </p>
      </motion.div>
    </div>
  );
}
