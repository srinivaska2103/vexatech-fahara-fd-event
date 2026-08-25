import { create } from 'zustand';

export const useSidebarStore = create((set) => ({
  isOpen: true,
  isMobileOpen: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  setSidebarOpen: (isOpen) => set({ isOpen }),
  toggleMobileSidebar: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  setMobileSidebarOpen: (isMobileOpen) => set({ isMobileOpen }),
}));
