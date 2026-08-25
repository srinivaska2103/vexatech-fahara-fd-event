import { create } from 'zustand';

export const useAnalyticsStore = create((set) => ({
  filters: {
    dateRange: 'this_month', // 'today', 'this_week', 'this_month', 'this_year', 'custom'
    customStartDate: null,
    customEndDate: null,
    packageId: 'all',
    serviceId: 'all',
    staffId: 'all',
  },
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  clearFilters: () => set({
    filters: {
      dateRange: 'this_month',
      customStartDate: null,
      customEndDate: null,
      packageId: 'all',
      serviceId: 'all',
      staffId: 'all',
    }
  }),
}));
