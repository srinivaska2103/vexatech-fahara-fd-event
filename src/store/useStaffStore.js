import { create } from 'zustand';

export const useStaffStore = create((set, get) => ({
  selectedStaffId: null,
  filters: {
    role: 'all',
    availability: 'all', // 'all', 'available', 'busy', 'leave'
  },
  searchQuery: '',
  selectedDate: new Date(),

  // Actions
  setSelectedStaffId: (id) => set({ selectedStaffId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  clearFilters: () => set({
    filters: { role: 'all', availability: 'all' },
    searchQuery: ''
  })
}));
