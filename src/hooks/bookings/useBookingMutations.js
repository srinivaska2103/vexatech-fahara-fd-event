import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';

export const useAcceptBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.post(`/api/bookings/${id}/accept`);
      return data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      toast.success('Booking accepted successfully.');
    },
    onError: () => toast.error('Failed to accept booking.'),
  });
};

export const useRejectBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }) => {
      const { data } = await axios.post(`/api/bookings/${id}/reject`, { reason });
      return data;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      toast.success('Booking rejected.');
    },
    onError: () => toast.error('Failed to reject booking.'),
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }) => {
      const { data } = await axios.post(`/api/bookings/${id}/cancel`, { reason });
      return data;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      toast.success('Booking cancelled.');
    },
    onError: () => toast.error('Failed to cancel booking.'),
  });
};

export const useRescheduleBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, newDate, newTime }) => {
      const { data } = await axios.post(`/api/bookings/${id}/reschedule`, { date: newDate, time: newTime });
      return data;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      toast.success('Booking rescheduled.');
    },
    onError: () => toast.error('Failed to reschedule booking.'),
  });
};

export const useAssignStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, staffIds }) => {
      const { data } = await axios.post(`/api/bookings/${id}/assign-staff`, { staffIds });
      return data;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      toast.success('Staff assigned successfully.');
    },
    onError: () => toast.error('Failed to assign staff.'),
  });
};

export const useAssignTeamLeader = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, leaderId }) => {
      const { data } = await axios.post(`/api/bookings/${id}/assign-leader`, { leaderId });
      return data;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      toast.success('Team leader assigned successfully.');
    },
    onError: () => toast.error('Failed to assign team leader.'),
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await axios.patch(`/api/bookings/${id}/status`, { status: status.toUpperCase() });
      return data;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      toast.success('Status updated.');
    },
    onError: () => toast.error('Failed to update status.'),
  });
};
