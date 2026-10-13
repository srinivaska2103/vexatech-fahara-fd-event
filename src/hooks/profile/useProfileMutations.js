import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';
import toast from 'react-hot-toast';

export const useGetProfileQuery = () => {
  return useQuery({
    queryKey: ['company_profile'],
    queryFn: async () => {
      const res = await axiosInstance.get(API_ENDPOINTS.EVENT_PROFILE.ME);
      return res.data?.data || res.data || null;
    }
  });
};

export const useCreateProfileMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post(API_ENDPOINTS.EVENT_PROFILE.CREATE, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Profile created successfully!');
      queryClient.invalidateQueries(['company_profile']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create profile');
    }
  });
};

export const useUpdateProfileMutation = (id) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const { business_hours, ...profileData } = data;
      
      // Update the main profile
      const res = await axiosInstance.put(API_ENDPOINTS.EVENT_PROFILE.ME, profileData);
      
      // Update business hours separately
      if (business_hours) {
        await axiosInstance.put(API_ENDPOINTS.EVENT_PROFILE.BUSINESS_HOURS, { business_hours });
      }
      
      return res.data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries(['company_profile']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  });
};

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axiosInstance.post(API_ENDPOINTS.UPLOADS.SINGLE, formData);
      return res.data?.data?.url || res.data?.url || res.data?.imageUrl; // Depends on backend response structure
    },
    onError: (error) => {
      toast.error('Image upload failed');
    }
  });
};

export const useToggleServiceAvailabilityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (isActive) => {
      const res = await axiosInstance.patch('/event-profiles/me/availability', { is_active: isActive });
      return res.data;
    },
    onSuccess: (data) => {
      const isAvailable = data?.data?.is_active ?? data?.is_available ?? true;
      toast.success(
        isAvailable 
          ? 'Event services are now LIVE & AVAILABLE to customers' 
          : 'Event services are now PAUSED / UNAVAILABLE to customers'
      );
      queryClient.invalidateQueries({ queryKey: ['company_profile'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update service availability status');
    }
  });
};
