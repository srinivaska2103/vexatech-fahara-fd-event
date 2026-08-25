import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

const fetchBookings = async (filters) => {
  const { data } = await axios.get('/bookings/cafe-bookings', { params: filters });
  return data?.data || data || [];
};

export const useGetBookings = (filters = {}) => {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => fetchBookings(filters),
    keepPreviousData: true,
  });
};

const fetchBookingDetails = async (id) => {
  const { data } = await axios.get(`/bookings/${id}`);
  return data?.data || data;
};

export const useGetBookingDetails = (id) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => fetchBookingDetails(id),
    enabled: !!id,
  });
};
