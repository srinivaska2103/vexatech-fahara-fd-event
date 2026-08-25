import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

// Profile Queries
export const useProfile = () => {
  return useQuery({
    queryKey: ['settings-profile'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/settings/profile');
        const data = res.data.data;
        return {
          ownerName: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
        };
      } catch (error) {
        return {
          ownerName: 'John Doe',
          email: 'john@example.com',
          phone: '+1 234 567 8900',
        }; // Fallback
      }
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const payload = {
        name: data.ownerName,
        phone: data.phone
      };
      // Note: Backend might ignore email updates or handle them, we send what's allowed.
      const res = await axiosInstance.put('/settings/profile', payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings-profile'] }),
  });
};

export const useBusinessSettings = () => {
  return useQuery({
    queryKey: ['settings-business'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/settings/profile');
        const data = res.data.data;
        return {
          businessName: data.business_name || '',
          gstNumber: '', // Backend might not have this natively
          address: data.address || '',
          bankName: data.bank_name || '',
          accountHolder: data.account_holder || '',
          accountNumber: data.account_number || '',
          ifscCode: data.ifsc_code || '',
        };
      } catch (error) {
        return {
          businessName: 'Fahara Events',
          gstNumber: 'GST123456789',
          address: '123 Event Street, City, Country',
          bankName: '',
          accountHolder: '',
          accountNumber: '',
          ifscCode: '',
        };
      }
    },
  });
};

export const useUpdateBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const payload = {
        business_name: data.businessName,
        address: data.address,
        bank_name: data.bankName,
        account_holder: data.accountHolder,
        account_number: data.accountNumber,
        ifsc_code: data.ifscCode
      };
      const res = await axiosInstance.put('/settings/profile', payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings-business'] }),
  });
};

// Security Queries
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.put('/settings/security/password', data);
      return res.data;
    },
  });
};

export const useActiveSessions = () => {
  return useQuery({
    queryKey: ['settings-sessions'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/settings/security/sessions');
        return res.data.data;
      } catch (error) {
        return [];
      }
    },
  });
};

export const useLoginHistory = () => {
  return useQuery({
    queryKey: ['settings-login-history'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/settings/security/login-history');
        return res.data.data;
      } catch (error) {
        return [];
      }
    },
  });
};

export const useLogoutAllDevices = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post('/settings/security/logout-all');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-sessions'] });
    },
  });
};

// Branding Queries
export const useBrandingSettings = () => {
  return useQuery({
    queryKey: ['settings-branding'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/settings/branding');
        return res.data.data;
      } catch (error) {
        return { primaryColor: '#6F4E37', secondaryColor: '#A67B5B' };
      }
    },
  });
};

export const useUpdateBranding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.put('/settings/branding', data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings-branding'] }),
  });
};
