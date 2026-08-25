import AuthLayout from '@/components/auth/AuthLayout';
import AuthHeader from '@/components/auth/AuthHeader';
import EventSignupForm from '@/components/auth/EventSignupForm';

export default function SignupPage() {
  return (
    <AuthLayout>
      <AuthHeader 
        title="Event Manager Signup" 
        subtitle="Register your venue partner account" 
      />
      <EventSignupForm />
    </AuthLayout>
  );
}
