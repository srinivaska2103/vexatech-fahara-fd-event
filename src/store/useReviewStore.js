import { create } from 'zustand';

export const useReviewStore = create((set) => ({
  searchQuery: '',
  filters: {
    rating: 'all', // 'all', '5', '4', '3', '2', '1'
    status: 'all', // 'all', 'published', 'pending', 'flagged'
    replyStatus: 'all', // 'all', 'replied', 'unreplied'
    dateRange: 'all', // 'all', 'last30', 'last90', 'thisYear'
  },
  sort: {
    field: 'created_at',
    order: 'desc',
  },
  pagination: {
    page: 1,
    limit: 10,
  },
  selectedReviewIds: [],

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
    pagination: { ...state.pagination, page: 1 }
  })),

  setSort: (field, order) => set({ sort: { field, order } }),
  
  setPagination: (page) => set((state) => ({
    pagination: { ...state.pagination, page }
  })),

  toggleReviewSelection: (id) => set((state) => ({
    selectedReviewIds: state.selectedReviewIds.includes(id)
      ? state.selectedReviewIds.filter(selectedId => selectedId !== id)
      : [...state.selectedReviewIds, id]
  })),

  selectAllReviews: (ids) => set({ selectedReviewIds: ids }),
  
  clearSelection: () => set({ selectedReviewIds: [] }),

  clearFilters: () => set({
    searchQuery: '',
    filters: { rating: 'all', status: 'all', replyStatus: 'all', dateRange: 'all' },
    pagination: { page: 1, limit: 10 }
  })
}));
