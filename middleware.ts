import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('userRole')?.value;
  const { pathname } = request.nextUrl;

  // Routes protégées (candidat)
  const candidateRoutes = ['/profile', '/applications'];
  const isCandidateRoute = candidateRoutes.some(route => pathname.startsWith(route));

  // Routes protégées (admin)
  const adminRoutes = ['/admin'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Rediriger vers /login si pas de token
  if ((isCandidateRoute || isAdminRoute) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Vérification du rôle pour les routes admin
  if (isAdminRoute && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/applications/:path*', '/admin', '/admin/:path*'],
};