import { create } from 'zustand';
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';

export const useCalendarStore = create((set, get) => ({
  currentDate: new Date(),
  selectedDate: new Date(),
  view: 'month', // 'month', 'week', 'day', 'agenda'
  filters: {
    status: 'all', // 'all', 'AVAILABLE', 'BOOKED', 'BLOCKED', 'CONFIRMED', 'PENDING', 'PRIVATE'
    service: 'all',
    searchQuery: '',
  },
  selectedEvent: null,
  isBlockModalOpen: false,
  editingBlock: null,
  defaultBlockDate: null,

  // Actions
  setView: (view) => set({ view }),
  setCurrentDate: (date) => set({ currentDate: date }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  
  openCreateBlockModal: (initialDate = null) => set({
    isBlockModalOpen: true,
    editingBlock: null,
    defaultBlockDate: initialDate || get().selectedDate || new Date()
  }),

  openEditBlockModal: (block) => set({
    isBlockModalOpen: true,
    editingBlock: block,
    defaultBlockDate: new Date(block.start_at || block.startAt)
  }),

  closeBlockModal: () => set({
    isBlockModalOpen: false,
    editingBlock: null,
    defaultBlockDate: null
  }),

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

  today: () => {
    const now = new Date();
    set({ currentDate: now, selectedDate: now });
  },
}));
