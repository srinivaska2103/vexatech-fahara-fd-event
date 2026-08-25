import { create } from 'zustand';

export const useDashboardStore = create((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  // Date range for dashboard filters
  dateRange: 'this_month',
  setDateRange: (range) => set({ dateRange: range }),
}));
