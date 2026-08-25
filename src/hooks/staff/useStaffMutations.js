import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';
import toast from 'react-hot-toast';

export const useCreateStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post(API_ENDPOINTS.STAFF.CREATE, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Staff created successfully');
      queryClient.invalidateQueries({ queryKey: ['staff-list'] });
    },
    onError: (error) => {
      console.warn('Backend API missing for Staff Create.');
      toast.error(error.response?.data?.message || 'Failed to create staff');
    },
  });
};

export const useUpdateStaffMutation = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.patch(API_ENDPOINTS.STAFF.UPDATE(id), payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Staff updated successfully');
      queryClient.invalidateQueries({ queryKey: ['staff-list'] });
      queryClient.invalidateQueries({ queryKey: ['staff-detail', id] });
    },
    onError: (error) => {
      console.warn('Backend API missing for Staff Update.');
      toast.error(error.response?.data?.message || 'Failed to update staff');
    },
  });
};

export const useDeleteStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(API_ENDPOINTS.STAFF.DELETE(id));
      return res.data;
    },
    onSuccess: () => {
      toast.success('Staff deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['staff-list'] });
    },
    onError: (error) => {
      console.warn('Backend API missing for Staff Delete.');
      toast.error(error.response?.data?.message || 'Failed to delete staff');
    },
  });
};

export const useChangeStaffStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const endpoint = status === 'ACTIVE' 
        ? API_ENDPOINTS.STAFF.ACTIVATE(id) 
        : API_ENDPOINTS.STAFF.DEACTIVATE(id);
      const res = await axiosInstance.post(endpoint);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Staff status updated');
      queryClient.invalidateQueries({ queryKey: ['staff-list'] });
    },
    onError: (error) => {
      console.warn('Backend API missing for Staff Status Change.');
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
};
