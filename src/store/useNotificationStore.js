import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  activeTab: 'notifications', // 'notifications', 'activity', 'preferences'
  
  notificationFilters: {
    status: 'all', // 'all', 'unread', 'read'
    type: 'all', // 'all', 'booking', 'payment', 'review', 'message', 'system'
    searchQuery: '',
  },

  activityFilters: {
    type: 'all', // 'all', 'booking', 'customer', 'staff', 'payment', 'review'
    dateRange: 'this_week',
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setNotificationFilters: (filters) => set((state) => ({
    notificationFilters: { ...state.notificationFilters, ...filters }
  })),

  setActivityFilters: (filters) => set((state) => ({
    activityFilters: { ...state.activityFilters, ...filters }
  })),
}));
