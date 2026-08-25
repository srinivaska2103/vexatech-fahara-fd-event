import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';
import toast from 'react-hot-toast';

export const useSubmitReplyMutation = (reviewId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post(API_ENDPOINTS.REVIEWS.REPLY(reviewId), payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Reply posted successfully');
      queryClient.invalidateQueries({ queryKey: ['review-detail', reviewId] });
      queryClient.invalidateQueries({ queryKey: ['reviews-list'] });
    },
    onError: (error) => {
      console.warn('Backend API missing for Review Reply.');
      toast.error(error.response?.data?.message || 'Failed to post reply');
    },
  });
};

export const useUpdateReplyMutation = (reviewId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.put(API_ENDPOINTS.REVIEWS.REPLY(reviewId), payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Reply updated successfully');
      queryClient.invalidateQueries({ queryKey: ['review-detail', reviewId] });
      queryClient.invalidateQueries({ queryKey: ['reviews-list'] });
    },
    onError: (error) => {
      console.warn('Backend API missing for Review Reply.');
      toast.error(error.response?.data?.message || 'Failed to update reply');
    },
  });
};

export const useDeleteReplyMutation = (reviewId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(API_ENDPOINTS.REVIEWS.REPLY(reviewId));
      return res.data;
    },
    onSuccess: () => {
      toast.success('Reply deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['review-detail', reviewId] });
      queryClient.invalidateQueries({ queryKey: ['reviews-list'] });
    },
    onError: (error) => {
      console.warn('Backend API missing for Review Reply.');
      toast.error(error.response?.data?.message || 'Failed to delete reply');
    },
  });
};
