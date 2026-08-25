import { create } from 'zustand';

export const useCustomerStore = create((set) => ({
  searchQuery: '',
  filters: {
    vip: 'all', // 'all', 'true', 'false'
    status: 'all', // 'all', 'active', 'inactive'
    city: 'all',
  },
  sort: {
    field: 'created_at',
    order: 'desc',
  },
  pagination: {
    page: 1,
    limit: 10,
  },
  selectedCustomerIds: [],

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
    pagination: { ...state.pagination, page: 1 } // Reset to page 1 on filter change
  })),

  setSort: (field, order) => set({ sort: { field, order } }),
  
  setPagination: (page) => set((state) => ({
    pagination: { ...state.pagination, page }
  })),

  toggleCustomerSelection: (id) => set((state) => ({
    selectedCustomerIds: state.selectedCustomerIds.includes(id)
      ? state.selectedCustomerIds.filter(selectedId => selectedId !== id)
      : [...state.selectedCustomerIds, id]
  })),

  selectAllCustomers: (ids) => set({ selectedCustomerIds: ids }),
  
  clearSelection: () => set({ selectedCustomerIds: [] }),

  clearFilters: () => set({
    searchQuery: '',
    filters: { vip: 'all', status: 'all', city: 'all' },
    pagination: { page: 1, limit: 10 }
  })
}));
