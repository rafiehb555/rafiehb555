import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { hasPermission, UserRole } from '@/lib/rbac';

interface RouteConfig {
  path: string;
  roles: UserRole[];
  action: string;
  resource: string;
}

const protectedRoutes: RouteConfig[] = [
  {
    path: '/admin',
    roles: ['admin'],
    action: 'manage',
    resource: 'all',
  },
  {
    path: '/shop',
    roles: ['shopkeeper', 'admin'],
    action: 'write',
    resource: 'products',
  },
  {
    path: '/verify',
    roles: ['verifier', 'admin'],
    action: 'write',
    resource: 'kyc',
  },
  {
    path: '/wallet',
    roles: ['customer', 'shopkeeper', 'admin'],
    action: 'read',
    resource: 'wallet',
  },
];

export async function roleCheck(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const userRole = session.user.role as UserRole;
  const pathname = request.nextUrl.pathname;

  // Find matching route configuration
  const routeConfig = protectedRoutes.find(route => pathname.startsWith(route.path));

  if (routeConfig) {
    // Check if user has required role
    const hasRequiredRole = routeConfig.roles.includes(userRole);

    // Check if user has required permission
    const hasRequiredPermission = hasPermission(userRole, routeConfig.action, routeConfig.resource);

    if (!hasRequiredRole || !hasRequiredPermission) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}
