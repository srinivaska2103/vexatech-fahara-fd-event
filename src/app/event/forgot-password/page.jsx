import AuthLayout from '@/components/auth/AuthLayout';
import AuthHeader from '@/components/auth/AuthHeader';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <AuthHeader 
        title="Forgot Password" 
        subtitle="Enter your email to receive a 6-digit password reset OTP" 
      />
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

