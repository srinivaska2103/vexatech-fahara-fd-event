'use client';

import { useState } from 'react';
import { useVerifyOtpMutation, useForgotPasswordMutation } from '@/hooks/auth/useAuthMutations';
import OTPInput from './OTPInput';
import AuthFooter from './AuthFooter';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifyEmailOTP() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id') || searchParams.get('userId') || searchParams.get('email') || '';
  const emailParam = searchParams.get('email') || idParam;
  
  const verifyMutation = useVerifyOtpMutation();
  const forgotMutation = useForgotPasswordMutation();
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setError('');
    
    verifyMutation.mutate({ email: emailParam || idParam, id: idParam, otp }, {
      onSuccess: () => {
        router.push('/event/login');
      }
    });
  };

  const handleResend = () => {
    if (!emailParam) {
      toast.error('Account ID not found. Please register again.');
      return;
    }
    forgotMutation.mutate(emailParam, {
      onSuccess: () => {
        toast.success('A new OTP has been sent to your registered account email.');
      }
    });
  };

  return (
    <div className="space-y-6 w-full flex flex-col items-center select-none mt-2">
      <div className="w-full text-center">
        <p className="text-xs sm:text-sm text-[#7A5A44] font-medium mb-4">
          We've sent a 6-digit verification code to Account ID <span className="font-extrabold text-[#2C1810] font-mono border border-stone-300 px-2 py-0.5 rounded-lg bg-white/60">{idParam}</span>
        </p>
      </div>

      <OTPInput 
        length={6} 
        onComplete={(code) => setOtp(code)}
        error={error}
      />

      <button
        onClick={handleVerify}
        disabled={verifyMutation.isPending || otp.length !== 6}
        className="w-full bg-[#966746] hover:bg-[#85593A] text-white font-black py-4 px-4 rounded-2xl shadow-lg shadow-[#966746]/20 transition-all active:scale-[0.99] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4 cursor-pointer text-sm"
      >
        {verifyMutation.isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin text-white" /> Verifying OTP Code...</>
        ) : (
          'Verify Email & Activate Portal'
        )}
      </button>

      <AuthFooter 
        text="Didn't receive a code?" 
        linkText={forgotMutation.isPending ? "Resending..." : "Click to resend"} 
        onClick={forgotMutation.isPending ? undefined : handleResend} 
      />
    </div>
  );
}

