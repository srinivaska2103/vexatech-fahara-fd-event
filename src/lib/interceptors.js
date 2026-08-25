import { STORAGE_KEYS } from '@/constants/storageKeys';
import { useAuthStore } from '@/store/authStore';
import { AuthService } from '@/services/authService';

export const setupInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const url = originalRequest?.url || '';

      // Skip refresh token flow for auth routes (e.g. login, register, forgot-password)
      const isAuthEndpoint = url.includes('/auth/login') || 
                             url.includes('/auth/register') || 
                             url.includes('/auth/verify-otp') ||
                             url.includes('/auth/forgot-password') || 
                             url.includes('/auth/reset-password') ||
                             url.includes('/auth/refresh-token');
      
      if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
        originalRequest._retry = true;
        
        try {
          const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
          if (!refreshToken) throw new Error('No refresh token');

          const response = await AuthService.refreshToken(refreshToken);
          const newToken = response.accessToken || response.data?.accessToken || response.token; 

          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);
          if (response.refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/event/login';
          }
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
};
