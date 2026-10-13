import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';

export const useSubscriptionStore = create((set, get) => ({
  subscription: null,
  plans: [],
  status: 'INACTIVE',
  isActive: false,
  isLoading: false,
  error: null,
  currentUserId: null,

  resetSubscription: () => {
    set({
      subscription: null,
      status: 'INACTIVE',
      isActive: false,
      isLoading: false,
      error: null,
      currentUserId: null
    });
  },

  fetchPlans: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SUBSCRIPTION?.PLANS || '/subscriptions/plans');
      const plans = response.data?.data || [];
      set({ plans });
      return plans;
    } catch (err) {
      console.warn('Fetch Plans Error:', err);
      return [];
    }
  },

  fetchSubscription: async (force = false) => {
    let authUserId = null;
    try {
      if (typeof window !== 'undefined') {
        const userInfoStr = localStorage.getItem('user_info') || localStorage.getItem('userInfo');
        if (userInfoStr) {
          const parsed = JSON.parse(userInfoStr);
          authUserId = parsed?.id || null;
        }
      }
    } catch (e) {}

    const state = get();
    const userMismatch = authUserId && state.currentUserId && authUserId !== state.currentUserId;
    if (!force && !userMismatch && state.isActive && state.subscription && state.currentUserId === authUserId) {
      return { subscription: state.subscription, status: state.status, isActive: state.isActive };
    }

    set({ isLoading: true, error: null, currentUserId: authUserId });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SUBSCRIPTION?.STATUS || '/subscriptions/status');
      const data = response.data?.data || {};
      set({
        subscription: data.subscription || null,
        status: data.status || 'INACTIVE',
        isActive: Boolean(data.isActive),
        isLoading: false,
        currentUserId: authUserId
      });
      return data;
    } catch (err) {
      console.error('Fetch Subscription Error:', err);
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to check subscription status'
      });
      return { isActive: false, status: 'INACTIVE' };
    }
  },

  createSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.SUBSCRIPTION?.CREATE || '/subscriptions/event-manager/create');
      set({ isLoading: false });
      return response.data?.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create subscription';
      set({ isLoading: false, error: msg });
      throw err;
    }
  },

  verifySubscription: async (paymentDetails) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.SUBSCRIPTION?.VERIFY || '/subscriptions/verify', paymentDetails);
      const data = response.data?.data || {};
      set({
        subscription: data.subscription || null,
        status: data.status || 'ACTIVE',
        isActive: true,
        isLoading: false
      });
      return response.data;
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Verification failed' });
      throw err;
    }
  },

  cancelSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.SUBSCRIPTION?.CANCEL || '/subscriptions/cancel');
      set({ isLoading: false });
      await get().fetchSubscription();
      return response.data;
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Cancellation failed' });
      throw err;
    }
  },

  reactivateSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.SUBSCRIPTION?.REACTIVATE || '/subscriptions/reactivate');
      set({ isLoading: false });
      await get().fetchSubscription();
      return response.data;
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Reactivation failed' });
      throw err;
    }
  }
}));
