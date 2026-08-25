export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  BOOKINGS: {
    MY_BOOKINGS: '/bookings/my-bookings',
    CAFE_BOOKINGS: '/bookings/cafe-bookings',
    STATUS: (id) => `/bookings/${id}/status`,
    CANCEL: (id) => `/bookings/${id}/cancel`,
  },
  CAFES: {
    LIST: '/cafes',
    DETAIL: (id) => `/cafes/${id}`,
  },
  SETTINGS: {
    PROFILE: '/settings/profile',
  },
  EVENT_PROFILE: {
    ME: '/event-profiles/me',
    CREATE: '/event-profiles',
    BUSINESS_HOURS: '/event-profiles/me/business-hours',
  },
  UPLOADS: {
    SINGLE: '/uploads',
    MULTIPLE: '/uploads/multiple',
  },
  EVENT_SERVICES: {
    LIST: '/event-services',
    DETAIL: (id) => `/event-services/${id}`,
    CREATE: '/event-services',
    UPDATE: (id) => `/event-services/${id}`,
    DELETE: (id) => `/event-services/${id}`
  },
  CALENDAR: {
    EVENTS: '/calendar/events',
    HOLIDAYS: '/calendar/holidays',
    BLOCKED_DATES: '/calendar/blocked-dates',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    READ_ALL: '/notifications/read-all',
    READ: (id) => `/notifications/${id}/read`,
    DELETE: (id) => `/notifications/${id}`,
    PREFERENCES: '/notifications/preferences'
  },
  ACTIVITIES: {
    LIST: '/activities'
  },
  STAFF: {
    LIST: '/staff',
    DETAIL: (id) => `/staff/${id}`,
    CREATE: '/staff',
    UPDATE: (id) => `/staff/${id}`,
    DELETE: (id) => `/staff/${id}`,
    ACTIVATE: (id) => `/staff/${id}/activate`,
    DEACTIVATE: (id) => `/staff/${id}/deactivate`,
    AVAILABILITY: '/staff/availability',
    ASSIGN: '/staff/assign',
    PERFORMANCE: (id) => `/staff/${id}/performance`,
  },
  CUSTOMERS: {
    LIST: '/customers/owner',
    DETAIL: (id) => `/customers/owner/${id}`,
    BOOKINGS: (id) => `/customers/owner/${id}/bookings`,
    NOTES: (id) => `/customers/owner/${id}/notes`,
    STATS: (id) => `/customers/owner/analytics`,
    TOGGLE_VIP: (id) => `/customers/owner/${id}/vip`,
  },
  REVIEWS: {
    LIST: '/reviews',
    DETAIL: (id) => `/reviews/${id}`,
    SUMMARY: '/reviews/summary',
    ANALYTICS: '/reviews/analytics',
    REPLY: (id) => `/reviews/${id}/reply`,
  },
  FINANCE: {
    REVENUE: '/finance/revenue',
    TRANSACTIONS: '/finance/transactions',
    PAYMENTS: '/finance/payments',
    SETTLEMENTS: '/finance/settlements',
    PAYOUTS: '/finance/payouts',
    INVOICES: '/finance/invoices',
    REFUNDS: '/finance/refunds',
    TAXES: '/finance/taxes',
    EXPORT: '/finance/export',
    PAYMENT_ACCOUNT: '/event-profiles/me/payment-account',
    UPDATE_BANK: '/event-profiles/me/payment-account',
    VERIFY_ACCOUNT: '/event-profiles/me/payment-account',
  }
};
