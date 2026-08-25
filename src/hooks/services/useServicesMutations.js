import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';
import toast from 'react-hot-toast';

export const useCreateServiceMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post(API_ENDPOINTS.EVENT_SERVICES.CREATE, data);
      return res.data?.data;
    },
    onSuccess: () => {
      toast.success('Service created successfully!');
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_data'] });
      queryClient.refetchQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create service');
    }
  });
};

export const useUpdateServiceMutation = (id) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.put(API_ENDPOINTS.EVENT_SERVICES.UPDATE(id), data);
      return res.data?.data;
    },
    onSuccess: () => {
      toast.success('Service updated successfully!');
      queryClient.invalidateQueries(['services']);
      queryClient.invalidateQueries(['services', id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update service');
    }
  });
};

export const useDeleteServiceMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(API_ENDPOINTS.EVENT_SERVICES.DELETE(id));
      return res.data;
    },
    onSuccess: () => {
      toast.success('Service deleted successfully!');
      queryClient.invalidateQueries(['services']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete service');
    }
  });
};
