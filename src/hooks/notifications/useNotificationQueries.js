import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';

export const useNotifications = (filters) => {
  return useQuery({
    queryKey: ['notifications', filters],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.LIST, { params: filters });
        const data = res.data?.data?.notifications || res.data?.notifications || res.data?.data || res.data || [];
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('NOTIFICATIONS ERR:', error);
        return [];
      }
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useActivityHistory = (filters) => {
  return useQuery({
    queryKey: ['activity-history', filters],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.ACTIVITIES.LIST, { params: filters });
        return res.data.data;
      } catch (error) {
        return [];
      }
    },
  });
};

export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.PREFERENCES);
        return res.data.data;
      } catch (error) {
        // Return default preferences
        return {
          emailNotifications: true,
          pushNotifications: false,
          bookingAlerts: true,
          paymentAlerts: true,
          reviewAlerts: true,
          customerMessageAlerts: true,
          marketingNotifications: false,
          systemNotifications: true,
        };
      }
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.patch(API_ENDPOINTS.NOTIFICATIONS.READ(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.patch(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.put(API_ENDPOINTS.NOTIFICATIONS.PREFERENCES, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
    },
  });
};
