import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';

export const AuthService = {
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  register: async (userData) => {
    const payload = {
      ...userData,
      roleName: 'EVENT_MANAGER', // Hardcoded as per requirements
    };
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, payload);
    return response.data;
  },

  verifyOtp: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },

  refreshToken: async (token) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { token });
    return response.data;
  }
};
