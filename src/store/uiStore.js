import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isGlobalLoading: false,
  setGlobalLoading: (isLoading) => set({ isGlobalLoading: isLoading }),
  activeModal: null,
  setActiveModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
}));
