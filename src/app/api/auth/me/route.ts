import { NextResponse } from 'next/server';
import { getBackendApiBaseUrl } from '@/lib/admin-auth';

export async function GET(request: Request) {
  const backendBaseUrl = getBackendApiBaseUrl();
  if (!backendBaseUrl) {
    return NextResponse.json({ message: 'API backend non configuree.' }, { status: 503 });
  }

  const normalizedBaseUrl = backendBaseUrl.replace(/\/+$/, '');
  const altBaseUrl = normalizedBaseUrl.endsWith('/api')
    ? normalizedBaseUrl.replace(/\/api$/, '')
    : `${normalizedBaseUrl}/api`;
  const inboundCookie = request.headers.get('cookie') ?? '';
  if (!inboundCookie.trim()) {
    return NextResponse.json({ message: 'Non authentifie.' }, { status: 401 });
  }

  const currentUrl = new URL(request.url);
  const currentOrigin = currentUrl.origin;
  const currentPath = currentUrl.pathname.replace(/\/+$/, '');
  const meUrls = [`${normalizedBaseUrl}/auth/me`, `${altBaseUrl}/auth/me`].filter((candidateUrl) => {
    try {
      const parsed = new URL(candidateUrl);
      const parsedPath = parsed.pathname.replace(/\/+$/, '');
      return !(parsed.origin === currentOrigin && parsedPath === currentPath);
    } catch {
      return true;
    }
  });

  if (meUrls.length === 0) {
    return NextResponse.json(
      { message: 'Configuration backend invalide: boucle detectee sur /api/auth/me.' },
      { status: 503 }
    );
  }

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
