import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';

export const useDashboardAnalytics = (filters) => {
  return useQuery({
    queryKey: ['analytics-dashboard', filters],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/api/analytics/dashboard', { params: filters });
        return res.data.data;
      } catch (error) {
        // Fallback or empty state
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useRevenueAnalytics = (filters) => {
  return useQuery({
    queryKey: ['analytics-revenue', filters],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/api/analytics/revenue', { params: filters });
        return res.data.data;
      } catch (error) {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useBookingAnalytics = (filters) => {
  return useQuery({
    queryKey: ['analytics-booking', filters],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/api/analytics/booking', { params: filters });
        return res.data.data;
      } catch (error) {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCustomerAnalytics = (filters) => {
  return useQuery({
    queryKey: ['analytics-customer', filters],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/api/analytics/customer', { params: filters });
        return res.data.data;
      } catch (error) {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const usePackageAnalytics = (filters) => {
  return useQuery({
    queryKey: ['analytics-package', filters],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/api/analytics/package', { params: filters });
        return res.data.data;
      } catch (error) {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useStaffAnalytics = (filters) => {
  return useQuery({
    queryKey: ['analytics-staff', filters],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/api/analytics/staff', { params: filters });
        return res.data.data;
      } catch (error) {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useReports = (filters, pagination) => {
  return useQuery({
    queryKey: ['analytics-reports', filters, pagination],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/api/analytics/reports', { params: { ...filters, ...pagination } });
        return res.data.data;
      } catch (error) {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};
