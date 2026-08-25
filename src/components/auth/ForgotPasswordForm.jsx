'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/lib/validations';
import { useForgotPasswordMutation } from '@/hooks/auth/useAuthMutations';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Send } from 'lucide-react';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const forgotMutation = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data) => {
    forgotMutation.mutate(data.email, {
      onSuccess: (res) => {
        const userId = res?.userId || res?.user?.id;
        const param = userId ? `id=${encodeURIComponent(userId)}` : `email=${encodeURIComponent(data.email)}`;
        router.push(`/event/reset-password?${param}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full select-none mt-2">
      <div className="flex flex-col space-y-2 w-full">
        <label className="text-[11px] font-black text-[#4A3225] uppercase tracking-wider">EMAIL ADDRESS</label>
        <input
          {...register('email')}
          type="email"
          placeholder="Enter your registered cafe email"
          className={`w-full px-4 py-3.5 rounded-2xl border bg-[#FFFBF8] text-[#2C1810] placeholder:text-[#B59D8B] text-sm font-medium focus:bg-white focus:outline-none focus:border-[#966746] focus:ring-2 focus:ring-[#966746]/15 transition-all ${
            errors.email ? 'border-red-500 bg-red-50/50' : 'border-[#F0E6DD]'
          }`}
        />
        {errors.email && <span className="text-xs font-bold text-red-500 mt-0.5">{errors.email.message}</span>}
      </div>

      <button
        type="submit"
        disabled={forgotMutation.isPending}
        className="w-full py-4 px-4 rounded-2xl bg-[#966746] hover:bg-[#85593A] text-white font-black text-sm shadow-lg shadow-[#966746]/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        {forgotMutation.isPending ? (
          <><Loader2 className="w-4 h-4 animate-spin text-white" /> Sending Reset OTP...</>
        ) : (
          <>
            <Send className="w-4 h-4 text-white" />
            <span>Send Reset OTP</span>
          </>
        )}
      </button>

      <div className="text-center pt-2">
        <p className="text-sm font-medium text-[#7A5A44]">
          Remember your password?{' '}
          <Link href="/event/login" className="font-extrabold text-[#3B2519] hover:underline transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}

