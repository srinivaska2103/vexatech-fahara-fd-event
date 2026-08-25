import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';

export const useGetServicesQuery = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.EVENT_SERVICES.LIST);
        const raw = res.data;
        console.log('GET SERVICES API RESPONSE:', raw);
        let items = [];
        if (Array.isArray(raw)) items = raw;
        else if (Array.isArray(raw?.data)) items = raw.data;
        else if (Array.isArray(raw?.services)) items = raw.services;
        else if (Array.isArray(raw?.event_services)) items = raw.event_services;
        else if (Array.isArray(raw?.data?.services)) items = raw.data.services;
        else if (Array.isArray(raw?.data?.data)) items = raw.data.data;
        else if (raw && typeof raw === 'object') {
          const keys = Object.keys(raw);
          for (const key of keys) {
            if (Array.isArray(raw[key])) {
              items = raw[key];
              break;
            }
          }
        }

        if (items && items.length > 0) {
          return items;
        }

        // Fallback: check event-profiles/me for embedded services array
        try {
          const profileRes = await axiosInstance.get(API_ENDPOINTS.EVENT_PROFILE.ME);
          const profileData = profileRes.data?.data || profileRes.data;
          if (Array.isArray(profileData?.services)) return profileData.services;
          if (Array.isArray(profileData?.event_services)) return profileData.event_services;
        } catch (e) {
          // ignore profile fallback error
        }

        return items || [];
      } catch (err) {
        console.error('Error fetching services:', err);
        return [];
      }
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useGetServiceByIdQuery = (id) => {
  return useQuery({
    queryKey: ['services', id],
    queryFn: async () => {
      const res = await axiosInstance.get(API_ENDPOINTS.EVENT_SERVICES.DETAIL(id));
      return res.data?.data || null;
    },
    enabled: !!id
  });
};
