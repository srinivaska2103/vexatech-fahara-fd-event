import { create } from 'zustand';

export const useSettingsStore = create((set) => ({
  activeTab: 'profile', // profile, business, branding, security, danger
  
  setActiveTab: (tab) => set({ activeTab: tab })
}));
