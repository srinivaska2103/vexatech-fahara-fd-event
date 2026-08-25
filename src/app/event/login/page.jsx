import AuthLayout from '@/components/auth/AuthLayout';
import AuthHeader from '@/components/auth/AuthHeader';
import EventLoginForm from '@/components/auth/EventLoginForm';

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthHeader 
        title="Event Manager Login" 
        subtitle="Sign in to your Venue Dashboard" 
      />
      <EventLoginForm />
    </AuthLayout>
  );
}
