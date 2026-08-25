import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';

export const useCustomerList = (filters = {}, pagination = {}, sort = {}) => {
  return useQuery({
    queryKey: ['customers-list', filters, pagination, sort],
    queryFn: async () => {
      try {
        const params = { ...filters, ...pagination, ...sort };
        const res = await axiosInstance.get(API_ENDPOINTS.CUSTOMERS.LIST, { params });
        return {
          data: res.data.data || [],
          total: res.data.total || 0,
        };
      } catch (err) {
        console.warn('Backend API missing for Customer List. Returning empty array.');
        return { data: [], total: 0 };
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCustomerDetails = (id) => {
  return useQuery({
    queryKey: ['customer-detail', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.CUSTOMERS.DETAIL(id));
        return res.data.data || null;
      } catch (err) {
        console.warn('Backend API missing for Customer Detail. Returning null.');
        return null;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCustomerBookings = (id) => {
  return useQuery({
    queryKey: ['customer-bookings', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.CUSTOMERS.BOOKINGS(id));
        return res.data.data || [];
      } catch (err) {
        console.warn('Backend API missing for Customer Bookings. Returning empty array.');
        return [];
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCustomerNotes = (id) => {
  return useQuery({
    queryKey: ['customer-notes', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.CUSTOMERS.NOTES(id));
        return res.data.data || [];
      } catch (err) {
        console.warn('Backend API missing for Customer Notes. Returning empty array.');
        return [];
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCustomerStatistics = (id) => {
  return useQuery({
    queryKey: ['customer-statistics', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.CUSTOMERS.STATS(id));
        return res.data.data || null;
      } catch (err) {
        console.warn('Backend API missing for Customer Stats. Returning null.');
        return null;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
