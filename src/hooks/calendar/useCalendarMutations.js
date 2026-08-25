import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';
import toast from 'react-hot-toast';

export const useAssignStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      // payload: { eventId, staffId }
      const res = await axiosInstance.post(API_ENDPOINTS.STAFF.ASSIGN, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Staff assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      queryClient.invalidateQueries({ queryKey: ['staff-list'] });
    },
    onError: (error) => {
      console.warn('Backend API missing for assigning staff.');
      toast.error(error.response?.data?.message || 'Failed to assign staff');
    },
  });
};

export const useManageHolidayMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post(API_ENDPOINTS.CALENDAR.HOLIDAYS, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Holiday updated successfully');
      queryClient.invalidateQueries({ queryKey: ['calendar-holidays'] });
    },
    onError: (error) => {
      console.warn('Backend API missing for managing holidays.');
      toast.error(error.response?.data?.message || 'Failed to update holiday');
    },
  });
};

export const useBlockDateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post(API_ENDPOINTS.CALENDAR.BLOCKED_DATES, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Date blocked successfully');
      queryClient.invalidateQueries({ queryKey: ['calendar-blocked-dates'] });
    },
    onError: (error) => {
      console.warn('Backend API missing for blocking dates.');
      toast.error(error.response?.data?.message || 'Failed to block date');
    },
  });
};
