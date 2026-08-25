import { create } from 'zustand';

export const useServicesStore = create((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  statusFilter: 'ALL',
  setStatusFilter: (status) => set({ statusFilter: status }),
  
  categoryFilter: 'ALL',
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  
  sortOption: 'NEWEST',
  setSortOption: (option) => set({ sortOption: option }),
  
  selectedServices: [],
  setSelectedServices: (services) => set({ selectedServices: services }),
  toggleServiceSelection: (id) => set((state) => ({
    selectedServices: state.selectedServices.includes(id) 
      ? state.selectedServices.filter(sId => sId !== id)
      : [...state.selectedServices, id]
  })),
  clearSelection: () => set({ selectedServices: [] }),
  
  serviceGallery: [],
  setServiceGallery: (gallery) => set({ serviceGallery: gallery }),
  addServiceGalleryImage: (image) => set((state) => ({ serviceGallery: [...state.serviceGallery, image] })),
  removeServiceGalleryImage: (index) => set((state) => ({
    serviceGallery: state.serviceGallery.filter((_, i) => i !== index)
  })),
  clearServiceGallery: () => set({ serviceGallery: [] }),
  
  resetFilters: () => set({
    searchQuery: '',
    statusFilter: 'ALL',
    categoryFilter: 'ALL',
    sortOption: 'NEWEST'
  }),
}));
