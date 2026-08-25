import { create } from 'zustand';
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';

export const useCalendarStore = create((set, get) => ({
  currentDate: new Date(),
  view: 'month', // 'month', 'week', 'day', 'agenda'
  filters: {
    status: 'all', // 'all', 'PENDING', 'CONFIRMED', 'CANCELLED'
    service: 'all',
    searchQuery: '',
  },
  selectedEvent: null,

  // Actions
  setView: (view) => set({ view }),
  setCurrentDate: (date) => set({ currentDate: date }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  next: () => {
    const { view, currentDate } = get();
    if (view === 'month') set({ currentDate: addMonths(currentDate, 1) });
    else if (view === 'week') set({ currentDate: addWeeks(currentDate, 1) });
    else if (view === 'day' || view === 'agenda') set({ currentDate: addDays(currentDate, 1) });
  },

  prev: () => {
    const { view, currentDate } = get();
    if (view === 'month') set({ currentDate: subMonths(currentDate, 1) });
    else if (view === 'week') set({ currentDate: subWeeks(currentDate, 1) });
    else if (view === 'day' || view === 'agenda') set({ currentDate: subDays(currentDate, 1) });
  },

  today: () => set({ currentDate: new Date() }),
}));
