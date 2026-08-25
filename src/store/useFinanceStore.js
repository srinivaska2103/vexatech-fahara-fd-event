import { create } from 'zustand';

export const useFinanceStore = create((set) => ({
  searchQuery: '',
  filters: {
    status: 'all', // 'all', 'SUCCESS', 'PENDING', 'FAILED', etc.
    paymentMethod: 'all',
    dateRange: 'all',
  },
  sort: {
    field: 'created_at',
    order: 'desc',
  },
  pagination: {
    page: 1,
    limit: 10,
  },
  
  // Modals state
  isUpdateBankModalOpen: false,
  isVerificationModalOpen: false,
  isRefundModalOpen: false,
  selectedTransaction: null,
  selectedRefund: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
    pagination: { ...state.pagination, page: 1 }
  })),

  setSort: (field, order) => set({ sort: { field, order } }),
  
  setPagination: (page) => set((state) => ({
    pagination: { ...state.pagination, page }
  })),

  setUpdateBankModalOpen: (isOpen) => set({ isUpdateBankModalOpen: isOpen }),
  setVerificationModalOpen: (isOpen) => set({ isVerificationModalOpen: isOpen }),
  setRefundModalOpen: (isOpen) => set({ isRefundModalOpen: isOpen }),
  setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),
  setSelectedRefund: (refund) => set({ selectedRefund: refund }),

  clearFilters: () => set({
    searchQuery: '',
    filters: { status: 'all', paymentMethod: 'all', dateRange: 'all' },
    pagination: { page: 1, limit: 10 }
  })
}));
