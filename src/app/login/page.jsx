'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

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

        <button
          onClick={() => signIn('google', { callbackUrl: '/discover' })}
          className="w-full h-[52px] bg-white border border-[#E0E0E0] text-[#1A1A1A] font-medium text-[15px] rounded-[12px] flex items-center justify-center gap-3 hover:bg-[#F5F5F5] transition-colors shadow-sm mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

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

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
