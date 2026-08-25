import { create } from 'zustand';

export const useStaffManagementStore = create((set) => ({
  searchQuery: '',
  filters: {
    role: 'all',
    status: 'all',
    availability: 'all',
  },
  sort: {
    field: 'created_at',
    order: 'desc',
  },
  pagination: {
    page: 1,
    limit: 10,
  },
  selectedStaffIds: [],

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
    pagination: { ...state.pagination, page: 1 } // Reset to page 1 on filter change
  })),

  setSort: (field, order) => set({ sort: { field, order } }),
  
  setPagination: (page) => set((state) => ({
    pagination: { ...state.pagination, page }
  })),

  toggleStaffSelection: (id) => set((state) => ({
    selectedStaffIds: state.selectedStaffIds.includes(id)
      ? state.selectedStaffIds.filter(selectedId => selectedId !== id)
      : [...state.selectedStaffIds, id]
  })),

  selectAllStaff: (ids) => set({ selectedStaffIds: ids }),
  
  clearSelection: () => set({ selectedStaffIds: [] }),

  clearFilters: () => set({
    searchQuery: '',
    filters: { role: 'all', status: 'all', availability: 'all' },
    pagination: { page: 1, limit: 10 }
  })
}));
