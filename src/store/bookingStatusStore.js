import { create } from 'zustand';

export const useBookingStatusStore = create((set) => ({
  modals: {
    accept: { isOpen: false, bookingId: null },
    reject: { isOpen: false, bookingId: null },
    cancel: { isOpen: false, bookingId: null },
    reschedule: { isOpen: false, bookingId: null },
  },
  openModal: (type, bookingId) => set((state) => ({
    modals: { ...state.modals, [type]: { isOpen: true, bookingId } }
  })),
  closeModal: (type) => set((state) => ({
    modals: { ...state.modals, [type]: { isOpen: false, bookingId: null } }
  })),
  closeAllModals: () => set({
    modals: {
      accept: { isOpen: false, bookingId: null },
      reject: { isOpen: false, bookingId: null },
      cancel: { isOpen: false, bookingId: null },
      reschedule: { isOpen: false, bookingId: null },
    }
  })
}));
