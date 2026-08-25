import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1
  })),
  
  markAllAsRead: () => set((state) => ({
    unreadCount: 0,
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  
  clearNotifications: () => set({ notifications: [], unreadCount: 0 })
}));
