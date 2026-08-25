import { create } from 'zustand';

export const useStatsStore = create((set) => ({
  // Holds pre-calculated or overridden stats
  customStats: null,
  setCustomStats: (stats) => set({ customStats: stats }),
  clearStats: () => set({ customStats: null }),
}));
