import { NextResponse } from 'next/server';
import { getBackendApiBaseUrl } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const backendBaseUrl = getBackendApiBaseUrl();

  if (backendBaseUrl) {
    const normalizedBaseUrl = backendBaseUrl.replace(/\/+$/, '');
    const altBaseUrl = normalizedBaseUrl.endsWith('/api')
      ? normalizedBaseUrl.replace(/\/api$/, '')
      : `${normalizedBaseUrl}/api`;

    const logoutUrls = [`${normalizedBaseUrl}/auth/logout`, `${altBaseUrl}/auth/logout`];
    const inboundCookie = request.headers.get('cookie') ?? '';

    for (const logoutUrl of logoutUrls) {
      const backendResponse = await fetch(logoutUrl, {
        method: 'POST',
        headers: inboundCookie ? { Cookie: inboundCookie } : undefined,
        cache: 'no-store',
      }).catch(() => null);

      if (backendResponse && backendResponse.status !== 404) {
        break;
      }
    }
  }

  const response = NextResponse.json({ success: true });
  const cookieNames = ['access_token', 'token', 'refreshToken', 'accessToken', 'jwt', 'userRole'];

  for (const name of cookieNames) {
    response.cookies.set({
      name,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
  }

  return response;
}
