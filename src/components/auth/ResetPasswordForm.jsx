'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '@/lib/validations';
import { useResetPasswordMutation, useForgotPasswordMutation } from '@/hooks/auth/useAuthMutations';
import PasswordInput from './PasswordInput';
import OTPInput from './OTPInput';
import AuthFooter from './AuthFooter';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const emailParam = searchParams.get('email');
  const identifier = idParam || emailParam || '';
  
  const resetMutation = useResetPasswordMutation();
  const forgotMutation = useForgotPasswordMutation();
  const [otp, setOtp] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data) => {
    resetMutation.mutate({
      email: identifier,
      otp: data.otp,
      newPassword: data.newPassword,
    }, {
      onSuccess: () => {
        router.push('/event/login');
      }
    });
  };

  const handleOtpComplete = (code) => {
    setOtp(code);
    setValue('otp', code, { shouldValidate: true });
  };

  const handleResendOtp = () => {
    if (!identifier) {
      toast.error('Email not found. Please start over from Forgot Password.');
      return;
    }
    forgotMutation.mutate(identifier, {
      onSuccess: () => {
        toast.success('A new OTP has been sent to your email.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full select-none mt-2">
      <div className="flex flex-col items-center mb-4">
        <span className="text-[11px] font-black text-[#4A3225] uppercase tracking-wider mb-2">Enter 6-Digit OTP Code</span>
        <OTPInput 
          length={6} 
          onComplete={handleOtpComplete}
          error={errors.otp?.message}
        />
        {/* Hidden input to register OTP with RHF */}
        <input type="hidden" {...register('otp')} value={otp} />
      </div>

      <PasswordInput
        label="New Password"
        placeholder="••••••••"
        error={errors.newPassword?.message}
        {...register('newPassword')}
      />

      <PasswordInput
        label="Confirm New Password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <button
        type="submit"
        disabled={resetMutation.isPending}
        className="w-full py-4 px-4 rounded-2xl bg-[#966746] hover:bg-[#85593A] text-white font-black text-sm shadow-lg shadow-[#966746]/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-2"
      >
        {resetMutation.isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin text-white" /> Resetting Password...</>
        ) : (
          'Reset Password & Login'
        )}
      </button>

      <AuthFooter 
        text="Didn't receive the OTP code?" 
        linkText={forgotMutation.isPending ? "Resending..." : "Click to resend"} 
        onClick={forgotMutation.isPending ? undefined : handleResendOtp} 
      />
    </form>
  );
}


