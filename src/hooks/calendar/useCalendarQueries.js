import { useQuery } from '@tanstack/react-query';
import { eventAvailabilityService } from '@/services/eventAvailabilityService';

export const useEventManagerAvailability = (params = {}) => {
  return useQuery({
    queryKey: ['event-manager-availability', params],
    queryFn: async () => {
      try {
        return await eventAvailabilityService.getAvailability(params);
      } catch (err) {
        console.warn('Error fetching Event Manager Availability:', err);
        return { blocks: [], bookings: [], venues: [], services: [] };
      }
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useEventManagerSummary = () => {
  return useQuery({
    queryKey: ['event-manager-summary'],
    queryFn: async () => {
      try {
        return await eventAvailabilityService.getSummary();
      } catch (err) {
        console.warn('Error fetching Event Manager Summary:', err);
        return {
          todayEventsCount: 0,
          todayBookings: [],
          pendingRequestsCount: 0,
          pendingRequests: [],
          todayBlocksCount: 0,
          todayBlocks: [],
          upcomingBlocksCount: 0,
          upcomingBlocks: [],
          upcomingEventsCount: 0,
          upcomingEvents: []
        };
      }
    },
    staleTime: 60 * 1000,
  });
};

export const useCalendarEvents = (filters = {}) => {
  return useQuery({
    queryKey: ['calendar-events', filters],
    queryFn: async () => {
      try {
        const queryParams = {};
        if (filters.status && filters.status !== 'all') {
          queryParams.status = filters.status.toUpperCase();
        }
        
        const availabilityData = await eventAvailabilityService.getAvailability(queryParams);
        const bookings = availabilityData?.bookings || [];
        const blocks = availabilityData?.blocks || [];

        const formattedBookings = bookings.map(b => {
          const dateStr = b.booking_date ? b.booking_date.split('T')[0] : '';
          return {
            id: b.id,
            type: 'BOOKING',
            title: `${b.service_name || 'Event'} (#${b.booking_number || b.id.slice(0, 8)})`,
            date: dateStr,
            startTime: b.start_time,
            endTime: b.end_time,
            status: b.booking_status,
            customerName: b.customer_name,
            customerPhone: b.customer_phone,
            venueName: b.venue_name,
            totalPersons: b.total_persons,
            booking: b
          };
        });

        const formattedBlocks = blocks.map(bl => {
          const startDt = new Date(bl.start_at || bl.startAt);
          const endDt = new Date(bl.end_at || bl.endAt);
          
          // Use local year, month, day so blocks pin precisely on the intended local calendar date
          const y = startDt.getFullYear();
          const m = String(startDt.getMonth() + 1).padStart(2, '0');
          const d = String(startDt.getDate()).padStart(2, '0');
          const dateStr = `${y}-${m}-${d}`;

          const endY = endDt.getFullYear();
          const endM = String(endDt.getMonth() + 1).padStart(2, '0');
          const endD = String(endDt.getDate()).padStart(2, '0');
          const endDateStr = `${endY}-${endM}-${endD}`;

          return {
            id: bl.id,
            type: 'BLOCK',
            title: bl.title || 'Blocked Slot',
            date: dateStr,
            endDate: endDateStr,
            startTime: bl.start_at,
            endTime: bl.end_at,
            status: 'BLOCKED',
            reason: bl.reason,
            isAllDay: bl.is_all_day,
            notes: bl.notes,
            serviceName: bl.event_services?.service_name,
            venueName: bl.cafes?.name,
            block: bl
          };
        });

        return [...formattedBookings, ...formattedBlocks];
      } catch (err) {
        console.warn('Backend API error fetching Calendar Events.', err);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useCalendarBlockedDates = () => {
  return useQuery({
    queryKey: ['calendar-blocked-dates'],
    queryFn: async () => {
      try {
        const data = await eventAvailabilityService.getAvailability();
        return data?.blocks || [];
      } catch (err) {
        console.warn('Error fetching Blocked Dates.', err);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useCalendarHolidays = () => {
  return useQuery({
    queryKey: ['calendar-holidays'],
    queryFn: async () => {
      try {
        const data = await eventAvailabilityService.getAvailability();
        const blocks = data?.blocks || [];
        return blocks.filter(b => b.reason === 'HOLIDAY');
      } catch (err) {
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
      return [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useStaffAvailability = (staffId, dateRange) => {
  return useQuery({
    queryKey: ['staff-availability', staffId, dateRange],
    queryFn: async () => {
      return [];
    },
    enabled: !!staffId,
    staleTime: 2 * 60 * 1000,
  });
};
