'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/lib/context/AuthContext';
import { DataProvider } from '@/lib/context/DataContext';
import { useAuth } from '@/lib/context/AuthContext';
import Sidebar from '@/components/dashboard/Sidebar';
import TopHeader from '@/components/dashboard/TopHeader';
import { DashboardLayoutSkeleton } from '@/components/skeletons';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DataProvider>
      <div className="min-h-screen bg-[#0a0b14] flex">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64 min-w-0">
          <TopHeader />
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DataProvider>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AuthProvider>
  );
}
