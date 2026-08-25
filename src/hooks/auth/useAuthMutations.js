import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      // Assuming response has { user, token, refreshToken } or similar.
      // Adjust structure based on actual backend response
      const { user, token, refreshToken } = data.data || data; 
      setAuth(user, token, refreshToken);
      toast.success('Logged in successfully!');
    },
    onError: (error) => {
      const status = error.response?.status;
      const msg = error.response?.data?.message || error.message || '';
      
      if (status === 404 || status === 401 || msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('delete') || msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('user does not exist')) {
        toast.error('Account not found. Please register your account first!', { duration: 5000 });
      } else {
        toast.error(msg || 'Account not found. Please register your account first!');
      }
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: AuthService.register,
    onSuccess: () => {
      toast.success('Registration successful! Please check your email for the OTP.');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || error.message || 'Failed to register';
      toast.error(msg);
    },
  });
};

export const useVerifyOtpMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: AuthService.verifyOtp,
    onSuccess: (data) => {
      const payload = data.data || data;
      const { user, token, accessToken, refreshToken } = payload;
      const validToken = accessToken || token;
      if (validToken) {
        setAuth(user, validToken, refreshToken);
        toast.success('Email verified successfully!');
        if (typeof window !== 'undefined') {
          window.location.href = '/event/dashboard';
        }
      } else {
        toast.success('Email verified successfully!');
        if (typeof window !== 'undefined') {
          window.location.href = '/event/login';
        }
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: AuthService.forgotPassword,
    onSuccess: () => {
      toast.success('OTP sent to your email.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    },
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: AuthService.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    },
  });
};
