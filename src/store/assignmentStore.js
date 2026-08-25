import { create } from 'zustand';

export const useAssignmentStore = create((set) => ({
  modals: {
    assignStaff: { isOpen: false, bookingId: null },
    assignLeader: { isOpen: false, bookingId: null },
  },
  openModal: (type, bookingId) => set((state) => ({
    modals: { ...state.modals, [type]: { isOpen: true, bookingId } }
  })),
  closeModal: (type) => set((state) => ({
    modals: { ...state.modals, [type]: { isOpen: false, bookingId: null } }
  })),
}));
