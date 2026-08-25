import { create } from 'zustand';

export const useBookingFilterStore = create((set) => ({
  filters: {
    status: 'all',
    date: '',
    service: 'all',
    package: 'all',
    priceRange: { min: 0, max: 1000000 }
  },
  searchQuery: '',
  sortBy: 'newest', // newest, oldest, upcoming, highest_amount, lowest_amount
  
  setFilters: (newFilters) => set((state) => ({ 
    filters: { ...state.filters, ...newFilters } 
  })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),
  resetFilters: () => set({ 
    filters: { status: 'all', date: '', service: 'all', package: 'all', priceRange: { min: 0, max: 1000000 } },
    searchQuery: '',
    sortBy: 'newest'
  })
}));
