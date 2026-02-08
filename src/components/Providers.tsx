'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [isHydrated, setIsHydrated] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  // Initialize auth from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          setAuth(JSON.parse(user));
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
        }
      }
    }
    setIsHydrated(true);
  }, [setAuth]);

  if (!isHydrated) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}