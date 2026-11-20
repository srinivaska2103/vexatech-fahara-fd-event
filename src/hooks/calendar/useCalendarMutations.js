import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventAvailabilityService } from '@/services/eventAvailabilityService';
import toast from 'react-hot-toast';

export const useCreateBlockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      return await eventAvailabilityService.createBlock(payload);
    },
    onSuccess: (data) => {
      if (data?.hasConflictingBookings) {
        toast((t) => (
          <div className="flex flex-col gap-1">
            <span className="font-bold text-[#252525]">Block created with warnings!</span>
            <span className="text-xs text-amber-700">
              {data.conflictingBookingsCount} existing booking(s) overlap with this blocked period.
            </span>
          </div>
        ), { icon: '⚠️', duration: 6000 });
      } else {
        toast.success(data?.message || 'Availability block created successfully');
      }
      queryClient.invalidateQueries({ queryKey: ['event-manager-availability'] });
      queryClient.invalidateQueries({ queryKey: ['event-manager-summary'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-blocked-dates'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create availability block');
    },
  });
};

export const useUpdateBlockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ blockId, blockData }) => {
      return await eventAvailabilityService.updateBlock(blockId, blockData);
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Availability block updated successfully');
      queryClient.invalidateQueries({ queryKey: ['event-manager-availability'] });
      queryClient.invalidateQueries({ queryKey: ['event-manager-summary'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-blocked-dates'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update availability block');
    },
  });
};

export const useDeleteBlockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (blockId) => {
      return await eventAvailabilityService.deleteBlock(blockId);
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Availability block deleted');
      queryClient.invalidateQueries({ queryKey: ['event-manager-availability'] });
      queryClient.invalidateQueries({ queryKey: ['event-manager-summary'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-blocked-dates'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete block');
    },
  });
};

// Legacy alias compatibility
export const useBlockDateMutation = () => {
  const createMut = useCreateBlockMutation();
  const deleteMut = useDeleteBlockMutation();

  return {
    mutate: (payload, options) => {
      if (payload.action === 'unblock' && payload.id) {
        deleteMut.mutate(payload.id, options);
      } else {
        createMut.mutate({
          title: payload.reason || 'Blocked Date',
          reason: 'UNAVAILABLE',
          startAt: new Date(payload.date).toISOString(),
          endAt: new Date(new Date(payload.date).setHours(23, 59, 59)).toISOString(),
          isAllDay: true
        }, options);
      }
    },
    isPending: createMut.isPending || deleteMut.isPending
  };
};

export const useManageHolidayMutation = () => {
  const createMut = useCreateBlockMutation();
  const deleteMut = useDeleteBlockMutation();

  return {
    mutate: (payload, options) => {
      if (payload.action === 'delete' && payload.id) {
        deleteMut.mutate(payload.id, options);
      } else {
        createMut.mutate({
          title: payload.name || 'Public Holiday',
          reason: 'HOLIDAY',
          startAt: new Date(payload.date).toISOString(),
          endAt: new Date(new Date(payload.date).setHours(23, 59, 59)).toISOString(),
          isAllDay: true
        }, options);
      }
    },
    isPending: createMut.isPending || deleteMut.isPending
  };
};
