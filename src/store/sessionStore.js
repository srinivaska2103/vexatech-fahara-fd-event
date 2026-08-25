import { create } from 'zustand';
import { STORAGE_KEYS } from '@/constants/storageKeys';

export const useSessionStore = create((set) => ({
  sessionStartTime: typeof window !== 'undefined' ? Date.now() : null,
  isSessionValid: true,
  validateSession: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) {
        set({ isSessionValid: false });
        return false;
      }
      return true;
    }
    return false;
  },
  resetSession: () => set({ sessionStartTime: Date.now(), isSessionValid: true }),
}));
