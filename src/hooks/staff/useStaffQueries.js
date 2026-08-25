import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';

export const useStaffList = (filters = {}, pagination = {}, sort = {}) => {
  return useQuery({
    queryKey: ['staff-list', filters, pagination, sort],
    queryFn: async () => {
      try {
        const params = { ...filters, ...pagination, ...sort };
        const res = await axiosInstance.get(API_ENDPOINTS.STAFF.LIST, { params });
        return {
          data: res.data.data || [],
          total: res.data.total || 0,
        };
      } catch (err) {
        console.warn('Backend API missing for Staff List. Returning empty array.');
        return { data: [], total: 0 };
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useStaffDetails = (id) => {
  return useQuery({
    queryKey: ['staff-detail', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.STAFF.DETAIL(id));
        return res.data.data || null;
      } catch (err) {
        console.warn('Backend API missing for Staff Detail. Returning null.');
        return null;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useStaffPerformance = (id) => {
  return useQuery({
    queryKey: ['staff-performance', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.STAFF.PERFORMANCE(id));
        return res.data.data || null;
      } catch (err) {
        console.warn('Backend API missing for Staff Performance. Returning null.');
        return null;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
