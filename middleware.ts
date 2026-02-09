import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // Vérification du cookie ou token
  const { pathname } = request.nextUrl;

  // DÉSACTIVÉ POUR TESTS - À RÉACTIVER EN PRODUCTION
  // Rediriger vers /login si on tente d'aller sur /profile sans être connecté
  // if (pathname.startsWith('/profile') && !token) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/applications/:path*', '/admin/:path*'],
};