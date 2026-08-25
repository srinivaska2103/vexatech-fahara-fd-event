import { create } from 'zustand';
import { THEMES } from '@/constants/theme';
import { STORAGE_KEYS } from '@/constants/storageKeys';

export const useThemeStore = create((set) => ({
  theme: typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.THEME) || THEMES.LIGHT : THEMES.LIGHT,
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      if (theme === THEMES.DARK) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme });
  },
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
      if (newTheme === THEMES.DARK) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return { theme: newTheme };
  }),
}));
