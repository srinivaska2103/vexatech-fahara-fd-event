'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@/lib/validations';
import { useRegisterMutation } from '@/hooks/auth/useAuthMutations';
import PasswordInput from './PasswordInput';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function EventSignupForm() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data) => {
    registerMutation.mutate(data, {
      onSuccess: (res) => {
        const userId = res?.userId || res?.user?.id || res?.data?.userId || res?.data?.user?.id;
        const queryParam = userId ? `id=${encodeURIComponent(userId)}` : `email=${encodeURIComponent(data.email)}`;
        router.push(`/event/verify-email?${queryParam}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full select-none mt-2">
      
      <div className="flex flex-col space-y-1.5 w-full">
        <label className="text-[11px] font-black text-[#4A3225] uppercase tracking-wider">Owner / Manager Name</label>
        <input
          {...register('name')}
          type="text"
          placeholder="Enter Your Name"
          className={`w-full px-4 py-3 rounded-2xl border bg-[#FFFBF8] text-[#2C1810] placeholder:text-[#B59D8B] text-sm font-medium focus:bg-white focus:outline-none focus:border-[#966746] focus:ring-2 focus:ring-[#966746]/15 transition-all ${
            errors.name ? 'border-red-500 bg-red-50/50' : 'border-[#F0E6DD]'
          }`}
        />
        {errors.name && <span className="text-xs font-bold text-red-500 mt-0.5">{errors.name.message}</span>}
      </div>

      <div className="flex flex-col space-y-1.5 w-full">
        <label className="text-[11px] font-black text-[#4A3225] uppercase tracking-wider">Business Email Address</label>
        <input
          {...register('email')}
          type="email"
          placeholder="manager@company.com"
          className={`w-full px-4 py-3 rounded-2xl border bg-[#FFFBF8] text-[#2C1810] placeholder:text-[#B59D8B] text-sm font-medium focus:bg-white focus:outline-none focus:border-[#966746] focus:ring-2 focus:ring-[#966746]/15 transition-all ${
            errors.email ? 'border-red-500 bg-red-50/50' : 'border-[#F0E6DD]'
          }`}
        />
        {errors.email && <span className="text-xs font-bold text-red-500 mt-0.5">{errors.email.message}</span>}
      </div>

      <div className="flex flex-col space-y-1.5 w-full">
        <label className="text-[11px] font-black text-[#4A3225] uppercase tracking-wider">Phone Number</label>
        <input
          {...register('phone')}
          type="tel"
          placeholder="+91 9876543210"
          className={`w-full px-4 py-3 rounded-2xl border bg-[#FFFBF8] text-[#2C1810] placeholder:text-[#B59D8B] text-sm font-medium focus:bg-white focus:outline-none focus:border-[#966746] focus:ring-2 focus:ring-[#966746]/15 transition-all ${
            errors.phone ? 'border-red-500 bg-red-50/50' : 'border-[#F0E6DD]'
          }`}
        />
        {errors.phone && <span className="text-xs font-bold text-red-500 mt-0.5">{errors.phone.message}</span>}
      </div>

      <PasswordInput
        label="Password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full py-4 px-4 rounded-2xl bg-[#966746] hover:bg-[#85593A] text-white font-black text-sm shadow-lg shadow-[#966746]/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        {registerMutation.isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin text-white" /> Registering Account...</>
        ) : (
          'Register Venue Partner Account'
        )}
      </button>

      <div className="text-center pt-2">
        <p className="text-sm font-medium text-[#7A5A44]">
          Already have an account?{' '}
          <Link href="/event/login" className="font-extrabold text-[#3B2519] hover:underline transition-colors">
            Sign in to portal
          </Link>
        </p>
      </div>
    </form>
  );
}

