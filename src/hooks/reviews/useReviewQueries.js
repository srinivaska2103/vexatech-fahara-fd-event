import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';

export const useReviewList = (filters = {}, pagination = {}, sort = {}) => {
  return useQuery({
    queryKey: ['reviews-list', filters, pagination, sort],
    queryFn: async () => {
      try {
        const params = { ...filters, ...pagination, ...sort };
        const res = await axiosInstance.get(API_ENDPOINTS.REVIEWS.LIST, { params });
        return {
          data: res.data.data || [],
          total: res.data.total || 0,
        };
      } catch (err) {
        console.warn('Backend API missing for Review List. Returning empty array.');
        return { data: [], total: 0 };
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useReviewDetails = (id) => {
  return useQuery({
    queryKey: ['review-detail', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.REVIEWS.DETAIL(id));
        return res.data.data || null;
      } catch (err) {
        console.warn('Backend API missing for Review Detail. Returning null.');
        return null;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRatingSummary = () => {
  return useQuery({
    queryKey: ['rating-summary'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.REVIEWS.SUMMARY);
        return res.data.data || null;
      } catch (err) {
        console.warn('Backend API missing for Rating Summary. Returning null.');
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useReviewAnalytics = () => {
  return useQuery({
    queryKey: ['review-analytics'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.REVIEWS.ANALYTICS);
        return res.data.data || null;
      } catch (err) {
        console.warn('Backend API missing for Review Analytics. Returning null.');
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};
