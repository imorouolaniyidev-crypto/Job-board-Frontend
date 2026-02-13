import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, getAdminSessionValue } from '@/lib/admin-auth';

export function middleware(request: NextRequest) {
  const candidateToken = request.cookies.get('token')?.value;
  const adminSession = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const candidateRoutes = ['/profile', '/applications'];
  const isCandidateRoute = candidateRoutes.some((route) => pathname.startsWith(route));

  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminLoginRoute = pathname === '/admin/login';
  const isAdminProtectedRoute = isAdminRoute && !isAdminLoginRoute;
  const hasValidAdminSession = adminSession === getAdminSessionValue();

  if (isCandidateRoute && !candidateToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminProtectedRoute && !hasValidAdminSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isAdminLoginRoute && hasValidAdminSession) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/applications/:path*', '/admin/:path*'],
};
