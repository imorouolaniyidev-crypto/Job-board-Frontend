import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, getAdminSessionValue } from '@/lib/admin-auth';

function getJwtRole(token?: string): string | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const normalized = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(normalized)) as { role?: string };
    return payload?.role?.toUpperCase?.() ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const candidateToken =
    request.cookies.get('access_token')?.value ||
    request.cookies.get('token')?.value ||
    request.cookies.get('accessToken')?.value ||
    request.cookies.get('jwt')?.value;
  const adminSession = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const candidateRoutes = ['/profile', '/applications'];
  const isCandidateRoute = candidateRoutes.some((route) => pathname.startsWith(route));

  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminLoginRoute = pathname === '/admin/login';
  const isAdminProtectedRoute = isAdminRoute && !isAdminLoginRoute;
  const hasValidAdminSession = adminSession === getAdminSessionValue();
  const adminRole = getJwtRole(candidateToken);
  const isAdminToken = adminRole === 'ADMIN';

  if (isCandidateRoute && !candidateToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminProtectedRoute && (!hasValidAdminSession || !isAdminToken)) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isAdminLoginRoute && hasValidAdminSession && isAdminToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/applications/:path*', '/admin/:path*'],
};
