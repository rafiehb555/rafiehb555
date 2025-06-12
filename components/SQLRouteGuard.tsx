import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FiLock, FiArrowUp } from 'react-icons/fi';

interface SQLRouteGuardProps {
  children: React.ReactNode;
  minLevel: number;
  requireLoyaltyLock?: boolean;
  fallback?: React.ReactNode;
}

export function SQLRouteGuard({
  children,
  minLevel,
  requireLoyaltyLock = false,
  fallback,
}: SQLRouteGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userLevel, setUserLevel] = React.useState<number>(0);
  const [hasLoyaltyLock, setHasLoyaltyLock] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function checkAccess() {
      if (status === 'authenticated' && session?.user) {
        try {
          const response = await fetch('/api/user/sql-status');
          const data = await response.json();

          if (data.success) {
            setUserLevel(data.data.level);
            setHasLoyaltyLock(data.data.hasLoyaltyLock);
          }
        } catch (error) {
          console.error('Error checking SQL status:', error);
        }
      }
      setLoading(false);
    }

    checkAccess();
  }, [session, status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const hasAccess = userLevel >= minLevel && (!requireLoyaltyLock || hasLoyaltyLock);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <FiLock className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Access Restricted
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {requireLoyaltyLock && !hasLoyaltyLock
                ? 'This feature requires an active loyalty lock'
                : `This feature requires SQL level ${minLevel} (current: ${userLevel})`}
            </p>
          </div>
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => router.push('/am/upgrade')}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiArrowUp className="mr-2" />
                  Upgrade SQL Level
                </button>
              </div>
              {requireLoyaltyLock && !hasLoyaltyLock && (
                <div>
                  <button
                    onClick={() => router.push('/am/coin-lock')}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FiLock className="mr-2" />
                    Activate Loyalty Lock
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
