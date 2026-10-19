import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';

export const eventAvailabilityService = {
  // Get full availability (blocks, bookings, venues, business hours)
  getAvailability: async (params = {}) => {
    const res = await axiosInstance.get(API_ENDPOINTS.CALENDAR.AVAILABILITY, { params });
    return res.data?.data || res.data;
  },

  // Get availability dashboard summary (today's bookings, pending requests, blocked slots, upcoming assignments)
  getSummary: async () => {
    const res = await axiosInstance.get(API_ENDPOINTS.CALENDAR.SUMMARY);
    return res.data?.data || res.data;
  },

  // Get bookings for calendar
  getBookings: async (params = {}) => {
    const res = await axiosInstance.get(API_ENDPOINTS.CALENDAR.BOOKINGS, { params });
    return res.data?.data || res.data || [];
  },

  // Create availability block
  createBlock: async (blockData) => {
    const res = await axiosInstance.post(API_ENDPOINTS.CALENDAR.BLOCKS, blockData);
    return res.data;
  },

  // Update availability block
  updateBlock: async (blockId, blockData) => {
    const res = await axiosInstance.patch(API_ENDPOINTS.CALENDAR.BLOCK_DETAIL(blockId), blockData);
    return res.data;
  },

  // Delete availability block
  deleteBlock: async (blockId) => {
    const res = await axiosInstance.delete(API_ENDPOINTS.CALENDAR.BLOCK_DETAIL(blockId));
    return res.data;
  }
};
