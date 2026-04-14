'use client';

import { AuthProvider } from '@/lib/context/AuthContext';
import { DataProvider } from '@/lib/context/DataContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>
        {children}
      </DataProvider>
    </AuthProvider>
  );
}
