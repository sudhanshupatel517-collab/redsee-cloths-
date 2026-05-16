'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import { RootState } from '@/store/store';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
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

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
      dispatch(setCredentials(data));
      if (data.role === 'admin') router.push('/admin');
      else if (data.role === 'coadmin') router.push('/staff');
      else router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7a0000]/20 via-black to-black z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 glassmorphism-dark border border-white/10 rounded-2xl z-10 relative"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bebas text-white tracking-widest mb-2">ACCESS PORTAL</h2>
          <p className="text-gray-400 font-poppins text-sm">Enter your credentials to continue</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded text-sm mb-4">{error}</div>}

        <form onSubmit={submitHandler} className="space-y-6">
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
          
          <button type="submit" className="w-full bg-[#ff0033] hover:bg-[#cc0029] text-white font-montserrat font-bold tracking-widest uppercase py-4 rounded transition-colors text-sm">
            Authenticate
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account? <Link href="/signup" className="text-[#ff0033] hover:text-white transition-colors">Register Now</Link>
        </p>
      </motion.div>
    </div>
  );
}
