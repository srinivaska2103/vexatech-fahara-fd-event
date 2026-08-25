import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';

export const useCalendarEvents = (filters = {}) => {
  return useQuery({
    queryKey: ['calendar-events', filters],
    queryFn: async () => {
      try {
        const queryParams = {};
        if (filters.status && filters.status !== 'all') {
          queryParams.status = filters.status.toUpperCase();
        }
        
        // Use cafe-bookings to fetch the events, since calendar endpoints aren't implemented yet
        const res = await axiosInstance.get('/bookings/cafe-bookings', { params: queryParams });
        const bookings = res.data?.data || res.data || [];
        
        return bookings.map(b => ({
          id: b.id,
          title: `Booking #${b.booking_number || (b.id ? String(b.id).slice(0, 8) : 'BK-1000')}`,
          date: b.date ? b.date.split('T')[0] : new Date().toISOString().split('T')[0],
          status: b.status,
          booking: b
        }));
      } catch (err) {
        console.warn('Backend API error fetching Calendar Events.', err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCalendarHolidays = () => {
  return useQuery({
    queryKey: ['calendar-holidays'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.CALENDAR.HOLIDAYS);
        return res.data.data || [];
      } catch (err) {
        console.warn('Backend API missing for Holidays. Returning empty array.');
        return [];
      }
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useCalendarBlockedDates = () => {
  return useQuery({
    queryKey: ['calendar-blocked-dates'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.CALENDAR.BLOCKED_DATES);
        return res.data.data || [];
      } catch (err) {
        console.warn('Backend API missing for Blocked Dates. Returning empty array.');
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useStaffList = (filters = {}) => {
  return useQuery({
    queryKey: ['staff-list', filters],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.STAFF.LIST, { params: filters });
        return res.data.data || [];
      } catch (err) {
        console.warn('Backend API missing for Staff List. Returning empty array.');
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useStaffAvailability = (staffId, dateRange) => {
  return useQuery({
    queryKey: ['staff-availability', staffId, dateRange],
    queryFn: async () => {
      if (!staffId) return [];
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.STAFF.AVAILABILITY, { params: { staffId, ...dateRange } });
        return res.data.data || [];
      } catch (err) {
        console.warn('Backend API missing for Staff Availability. Returning empty array.');
        return [];
      }
    },
    enabled: !!staffId,
    staleTime: 2 * 60 * 1000,
  });
};
