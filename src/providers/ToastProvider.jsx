'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      containerClassName="!top-4 sm:!top-6 !px-3 sm:!px-4 select-none z-50"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#FFFDFB',
          color: '#2C1810',
          border: '1.5px solid #E8DED5',
          borderRadius: '20px',
          boxShadow: '0 20px 25px -5px rgba(44, 24, 16, 0.12), 0 8px 10px -6px rgba(44, 24, 16, 0.08)',
          fontSize: '13px',
          fontWeight: 800,
          padding: '12px 18px',
          maxWidth: '92vw',
        },
        success: {
          iconTheme: {
            primary: '#6F4E37',
            secondary: '#FFF8F0',
          },
          style: {
            border: '1.5px solid #E8DED5',
            background: '#FFFDFB',
            color: '#2C1810',
          }
        },
        error: {
          iconTheme: {
            primary: '#E11D48',
            secondary: '#FFF1F2',
          },
          style: {
            border: '1.5px solid #FECDD3',
            background: '#FFF5F5',
            color: '#9F1239',
          }
        }
      }}
    />
  );
}
