import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/wallet', '/admin', '/franchise', '/verify'];

// Define admin-only routes
const adminRoutes = ['/admin', '/api/admin'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuth = !!token;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Check if the route is admin-only
  const isAdminRoute = adminRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !isAuth) {
    // Redirect to login if trying to access protected route while not authenticated
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If it's an admin route, check for admin role
  if (isAdminRoute) {
    // TODO: Implement admin role check
    // For now, just check if token exists
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Add security headers
  const response = NextResponse.next();

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/wallet/:path*',
    '/admin/:path*',
    '/franchise/:path*',
    '/verify/:path*',
  ],
};
