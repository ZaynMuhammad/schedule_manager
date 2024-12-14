'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, currentUser } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (!token && !storedToken) {
        router.push('/sign-in');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [token, currentUser, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!token || !currentUser) {
    return null;
  }

  return <>{children}</>;
} 