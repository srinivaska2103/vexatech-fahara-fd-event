import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';

const fetchDashboardBookings = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.CAFE_BOOKINGS);
    return response.data?.data || response.data || [];
  } catch (e) {
    if (e.response?.status === 403) return [];
    throw e;
  }
};

const fetchEventServices = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.EVENT_SERVICES.LIST);
    return response.data?.data || response.data || [];
  } catch (e) {
    if (e.response?.status === 403) return [];
    throw e;
  }
};

const fetchReviewSummary = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.REVIEWS.SUMMARY);
    return response.data?.data || response.data || null;
  } catch (e) {
    return null;
  }
};

export const useDashboardQueries = () => {
  return useQuery({
    queryKey: ['dashboard_data'],
    queryFn: async () => {
      const [bookings, services, reviewSummary] = await Promise.all([
        fetchDashboardBookings(),
        fetchEventServices(),
        fetchReviewSummary()
      ]);
      return { bookings, services, reviewSummary };
    },
    // Refetch immediately
    staleTime: 0,
    select: ({ bookings, services, reviewSummary }) => {
      console.log('DASHBOARD DATA:', { bookings, services, reviewSummary });
      // Safety check if it's not an array
      const data = Array.isArray(bookings) ? bookings : [];
      const servicesData = Array.isArray(services) ? services : [];
      
      const now = new Date();
      
      let totalRevenue = 0;
      let monthlyRevenue = 0;
      let pendingRequests = 0;
      let completedEvents = 0;
      let cancelledEvents = 0;
      let todaysEvents = 0;
      
      const upcoming = [];
      
      data.forEach(booking => {
        const amount = Number(booking.amount || booking.total_amount || booking.event_service_amount || booking.cafe_amount || booking.subtotal || 0);
        const bookingDate = new Date(booking.date || booking.booking_date);
        
        const status = (booking.status || '').toUpperCase();
        
        // Revenue calculations
        if (status === 'COMPLETED' || status === 'CONFIRMED') {
          totalRevenue += amount;
          if (bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear()) {
            monthlyRevenue += amount;
          }
        }
        
        // Status counts
        if (status === 'PENDING') pendingRequests++;
        if (status === 'COMPLETED') completedEvents++;
        if (status === 'CANCELLED') cancelledEvents++;
        
        // Today's events
        if (bookingDate.toDateString() === now.toDateString()) {
          todaysEvents++;
        }
        
        // Upcoming logic
        if (bookingDate >= now && ['CONFIRMED', 'PENDING'].includes(status)) {
          upcoming.push(booking);
        }
      });
      
      // Sort upcoming by date ascending
      upcoming.sort((a, b) => new Date(a.date || a.booking_date) - new Date(b.date || b.booking_date));
      
      // Recent bookings (latest first)
      const sortedAll = [...data].sort((a, b) => new Date(b.createdAt || b.created_at || b.date || b.booking_date) - new Date(a.createdAt || a.created_at || a.date || a.booking_date));
      
      // Calculate daily revenue for the last 7 days (Mon-Sun)
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeklyData = [
        { day: 'Mon', value: 0 },
        { day: 'Tue', value: 0 },
        { day: 'Wed', value: 0 },
        { day: 'Thu', value: 0 },
        { day: 'Fri', value: 0 },
        { day: 'Sat', value: 0 },
        { day: 'Sun', value: 0 },
      ];

      // Calculate last 7 days window
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);

      data.forEach(booking => {
        const amount = Number(booking.amount || booking.total_amount || booking.event_service_amount || booking.cafe_amount || booking.subtotal || 0);
        const bookingDate = new Date(booking.date || booking.booking_date || booking.createdAt);
        const status = (booking.status || '').toUpperCase();

        if (bookingDate >= sevenDaysAgo && (status === 'COMPLETED' || status === 'CONFIRMED')) {
          const dayName = daysOfWeek[bookingDate.getDay()];
          const dayObj = weeklyData.find(d => d.day === dayName);
          if (dayObj) {
            dayObj.value += amount;
          }
        }
      });

      // Average rating from reviewSummary or fallback
      const avgRating = reviewSummary?.averageRating || reviewSummary?.average_rating || (reviewSummary?.reviews && reviewSummary.reviews.length > 0 ? (reviewSummary.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviewSummary.reviews.length).toFixed(1) : 4.8);

      return {
        rawBookings: data,
        stats: {
          totalBookings: data.length,
          totalRevenue,
          monthlyRevenue,
          pendingRequests,
          completedEvents,
          cancelledEvents,
          todaysEvents,
          activeServices: servicesData.filter(s => s.status === 'ACTIVE').length,
          totalCustomers: new Set(data.map(b => b.customerEmail || b.customer_id || b.user_id)).size,
          averageRating: Number(avgRating),
        },
        weeklyRevenue: weeklyData,
        upcomingEvents: upcoming.slice(0, 5),
        recentBookings: sortedAll.slice(0, 5),
        pendingApprovals: data.filter(b => (b.status || '').toUpperCase() === 'PENDING').slice(0, 5),
        services: servicesData,
      };
    }
  });
};

