import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // Vérification du cookie ou token
  const { pathname } = request.nextUrl;

  // Routes protégées
  const protectedRoutes = ['/profile', '/applications', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Rediriger vers /login si on tente d'accéder à une route protégée sans être connecté
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/applications/:path*', '/admin/:path*'],
};