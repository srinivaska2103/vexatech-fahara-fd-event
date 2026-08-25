import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';
import toast from 'react-hot-toast';

export const useToggleVIPMutation = (customerId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (isVip) => {
      const res = await axiosInstance.patch(API_ENDPOINTS.CUSTOMERS.TOGGLE_VIP(customerId), { isVip });
      return res.data;
    },
    onSuccess: () => {
      toast.success('VIP status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['customer-detail', customerId] });
      queryClient.invalidateQueries({ queryKey: ['customers-list'] });
    },
    onError: (error) => {
      console.warn('Backend API missing for VIP Toggle.');
      toast.error(error.response?.data?.message || 'Failed to update VIP status');
    },
  });
};

export const useAddCustomerNoteMutation = (customerId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post(API_ENDPOINTS.CUSTOMERS.NOTES(customerId), payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Note added successfully');
      queryClient.invalidateQueries({ queryKey: ['customer-notes', customerId] });
    },
    onError: (error) => {
      console.warn('Backend API missing for Customer Notes.');
      toast.error(error.response?.data?.message || 'Failed to add note');
    },
  });
};

export const useDeleteCustomerNoteMutation = (customerId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (noteId) => {
      // Assuming DELETE /api/v1/customers/:id/notes/:noteId
      const res = await axiosInstance.delete(`${API_ENDPOINTS.CUSTOMERS.NOTES(customerId)}/${noteId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Note deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['customer-notes', customerId] });
    },
    onError: (error) => {
      console.warn('Backend API missing for Customer Notes.');
      toast.error(error.response?.data?.message || 'Failed to delete note');
    },
  });
};
