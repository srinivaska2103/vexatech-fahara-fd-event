import AuthLayout from '@/components/auth/AuthLayout';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthFooter from '@/components/auth/AuthFooter';
import VerifyEmailOTP from '@/components/auth/VerifyEmailOTP';
import { Suspense } from 'react';

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <AuthHeader 
        title="Verify Your Email" 
        subtitle="Please enter the 6-digit OTP sent to your inbox" 
      />
      <Suspense fallback={<div className="text-center p-4">Loading verification...</div>}>
        <VerifyEmailOTP />
      </Suspense>
    </AuthLayout>
  );
}
