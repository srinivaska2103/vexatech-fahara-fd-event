import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  selectedBooking: null,
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
  clearSelectedBooking: () => set({ selectedBooking: null })
}));
