import { create } from 'zustand';
import { STORAGE_KEYS } from '@/constants/storageKeys';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  setAuth: (user, token, refreshToken) => {
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      if (user) localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
    }
    set({ user, isAuthenticated: !!user, isLoading: false });
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const userInfoStr = localStorage.getItem(STORAGE_KEYS.USER_INFO);
      let user = null;
      try {
        if (userInfoStr) user = JSON.parse(userInfoStr);
      } catch (e) {}
      
      set({ user, isAuthenticated: !!(token && user), isLoading: false });
    } else {
      set({ isLoading: false });
    }
  }
}));
