'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations';
import { useLoginMutation } from '@/hooks/auth/useAuthMutations';
import PasswordInput from './PasswordInput';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function EventLoginForm() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/event/dashboard');
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Successfully logged in!');
        router.push('/event/dashboard');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full select-none mt-2">
      
      {/* Demo Credentials Helper Pill */}
      <div 
        onClick={() => {
          const emailInput = document.querySelector('input[type="email"]');
          if (emailInput) {
            emailInput.value = 'manager@company.com';
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }}
        className="p-2.5 rounded-2xl bg-[#FFFBF8] border border-[#966746]/20 hover:border-[#966746]/50 flex items-center justify-between cursor-pointer transition-all active:scale-98 group"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[11px] font-bold text-[#966746]">Demo Account Credentials</span>
        </div>
        <span className="text-[10px] font-black text-[#966746] bg-white border border-[#F0E6DD] px-2 py-0.5 rounded-lg group-hover:bg-[#966746] group-hover:text-white transition-colors">
          Auto-Fill ⚡
        </span>
      </div>

      <div className="space-y-4">
        {/* Email Address */}
        <div className="flex flex-col space-y-1.5 w-full">
          <label className="text-[11px] font-black text-[#4A3225] uppercase tracking-wider">EMAIL ADDRESS</label>
          <input
            {...register('email')}
            type="email"
            placeholder="Enter your email"
            className={`w-full px-4 py-3 rounded-2xl border bg-[#FFFBF8] text-[#2C1810] placeholder:text-[#B59D8B] text-sm font-medium focus:bg-white focus:outline-none focus:border-[#966746] focus:ring-2 focus:ring-[#966746]/15 transition-all ${
              errors.email ? 'border-red-500 bg-red-50/50' : 'border-[#F0E6DD]'
            }`}
          />
          {errors.email && <span className="text-xs font-bold text-red-500 mt-0.5">{errors.email.message}</span>}
        </div>

        {/* Password Header (Label & Forgot password?) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black text-[#4A3225] uppercase tracking-wider">PASSWORD</label>
            <Link href="/event/forgot-password" className="text-xs font-bold text-[#966746] hover:underline transition-all">
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        {loginMutation.isError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/90 text-rose-800 text-xs font-bold flex items-center justify-between gap-2 shadow-xs">
            <span>
              Account not found. Please register your company first!
            </span>
            <Link 
              href="/event/signup" 
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-all shrink-0 shadow-2xs"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Primary Submit Button */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full py-4 px-4 rounded-2xl bg-[#966746] hover:bg-[#85593A] text-white font-black text-sm shadow-lg shadow-[#966746]/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        {loginMutation.isPending ? (
          <><Loader2 className="w-4 h-4 animate-spin text-white" /> Signing in to Dashboard...</>
        ) : (
          <>
            <LogIn className="w-4 h-4 text-white" />
            <span>Sign in to Dashboard</span>
          </>
        )}
      </button>

      <div className="text-center pt-2">
        <p className="text-sm font-medium text-[#7A5A44]">
          Don't have an event account?{' '}
          <Link href="/event/signup" className="font-extrabold text-[#3B2519] hover:underline transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}

