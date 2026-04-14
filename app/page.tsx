'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Initialize demo user if needed
    const users = localStorage.getItem('meditrack_users');
    if (!users) {
      const demoUser = {
        id: 'user_demo',
        email: 'demo@example.com',
        name: 'Demo User',
        password: 'password123',
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('meditrack_users', JSON.stringify([demoUser]));
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center">
      <div className="text-foreground">Loading...</div>
    </div>
  );
}
