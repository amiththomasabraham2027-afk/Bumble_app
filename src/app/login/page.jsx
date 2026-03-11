'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      router.push('/discover');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-6">
      
      {/* Logo & Tagline */}
      <div className="mb-10 flex flex-col items-center">
        <h1 className="text-[28px] font-bold text-[#FFC629] tracking-tight">MATCHN'T</h1>
        <p className="text-[13px] text-[#9CA3AF] italic mt-1">Where singles find their match</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white p-8 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        <h2 className="text-[20px] font-semibold text-[#1A1A1A] mb-6">Welcome back</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full h-[52px] bg-[#F0F0F0] rounded-[12px] px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#FFC629] transition-colors ${error ? 'border-2 border-[#EF4444]' : 'border-transparent'}`}
            />
          </div>
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full h-[52px] bg-[#F0F0F0] rounded-[12px] pl-4 pr-12 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#FFC629] transition-colors ${error ? 'border-2 border-[#EF4444]' : 'border-transparent'}`}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-[13px] font-medium hover:text-[#6B7280] transition-colors"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && (
            <div className="text-[#EF4444] text-[13px] mt-1">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full h-[52px] bg-[#FFC629] text-[#1A1A1A] font-bold text-[17px] rounded-full disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
              ) : (
                'Log In'
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 flex justify-end">
          <button className="text-[#FFC629] text-[13px] font-medium hover:underline">
            Forgot password?
          </button>
        </div>

        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-[#E0E0E0]"></div>
          <span className="text-[#9CA3AF] text-[13px]">or</span>
          <div className="flex-1 h-px bg-[#E0E0E0]"></div>
        </div>

        <Link
          href="/register"
          className="w-full h-[52px] bg-white border-2 border-[#FFC629] text-[#FFC629] font-bold text-[17px] rounded-full flex items-center justify-center hover:bg-[#FFF9E6] transition-colors"
        >
          Create an account
        </Link>
      </div>

    </div>
  );
}
