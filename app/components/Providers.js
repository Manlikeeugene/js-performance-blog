'use client';

import { SessionProvider } from 'next-auth/react';
import LoadingProvider from './LoadingProvider'; // Adjust path if needed

export default function Providers({ children }) {
  return (
    <SessionProvider
      baseUrl={process.env.NEXTAUTH_URL} // Ensures correct origin for session fetches
      refetchInterval={60} // Aggressive session polling
      refetchOnWindowFocus={true} // Re-fetch on tab focus
    >
      <LoadingProvider>
        {children}
      </LoadingProvider>
    </SessionProvider>
  );
}