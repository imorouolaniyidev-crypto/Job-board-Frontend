import { NextResponse } from 'next/server';
import { getBackendApiBaseUrl } from '@/lib/admin-auth';

export async function GET(request: Request) {
  const backendBaseUrl = getBackendApiBaseUrl();
  if (!backendBaseUrl) {
    return NextResponse.json({ message: 'API backend non configuree.' }, { status: 500 });
  }

  const normalizedBaseUrl = backendBaseUrl.replace(/\/+$/, '');
  const altBaseUrl = normalizedBaseUrl.endsWith('/api')
    ? normalizedBaseUrl.replace(/\/api$/, '')
    : `${normalizedBaseUrl}/api`;
  const meUrls = [`${normalizedBaseUrl}/auth/me`, `${altBaseUrl}/auth/me`];
  const inboundCookie = request.headers.get('cookie') ?? '';

  for (const meUrl of meUrls) {
    const backendResponse = await fetch(meUrl, {
      method: 'GET',
      headers: inboundCookie ? { Cookie: inboundCookie } : undefined,
      cache: 'no-store',
    }).catch(() => null);

    if (!backendResponse) continue;
    if (backendResponse.status === 404) continue;

    if (!backendResponse.ok) {
      const errorPayload = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(errorPayload, { status: backendResponse.status });
    }

    const payload = await backendResponse.json().catch(() => ({}));
    return NextResponse.json(payload, { status: 200 });
  }

  return NextResponse.json({ message: 'Endpoint auth/me introuvable.' }, { status: 502 });
}
