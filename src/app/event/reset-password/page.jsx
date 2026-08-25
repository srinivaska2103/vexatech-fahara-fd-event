import AuthLayout from '@/components/auth/AuthLayout';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthFooter from '@/components/auth/AuthFooter';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <AuthHeader 
        title="Set New Password" 
        subtitle="Enter the OTP and your new password below" 
      />
      <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
      <AuthFooter 
        text="Remembered your password?" 
        linkText="Back to login" 
        href="/event/login" 
      />
    </AuthLayout>
  );
}
