'use client';

import QueryProvider from './QueryProvider';
import ThemeProvider from './ThemeProvider';
import AuthProvider from './AuthProvider';
import LoadingProvider from './LoadingProvider';
import ToastProvider from './ToastProvider';

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <LoadingProvider>
            {children}
            <ToastProvider />
          </LoadingProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
