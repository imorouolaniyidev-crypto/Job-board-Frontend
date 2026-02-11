import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  getBackendApiBaseUrl,
  getAdminSessionValue,
} from '@/lib/admin-auth';

function isAdminFromBackendPayload(payload: unknown): boolean {
  const data = (payload ?? {}) as {
    role?: string;
    isAdmin?: boolean;
    user?: { role?: string; isAdmin?: boolean };
  };

  if (data.isAdmin === true || data.user?.isAdmin === true) {
    return true;
  }

  const roleCandidates = [data.user?.role, data.role]
    .filter((role): role is string => typeof role === 'string')
    .map((role) => role.trim().toUpperCase());

  return roleCandidates.some((role) => role === 'ADMIN' || role === 'ROLE_ADMIN');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email et mot de passe requis.' },
        { status: 400 }
      );
    }

    const backendBaseUrl = getBackendApiBaseUrl();
    if (!backendBaseUrl) {
      return NextResponse.json(
        {
          message:
            "Configuration manquante: définis API_URL (ou NEXT_PUBLIC_API_URL) vers l'API backend.",
        },
        { status: 500 }
      );
    }

    const normalizedBaseUrl = backendBaseUrl.replace(/\/+$/, '');
    const altBaseUrl = normalizedBaseUrl.endsWith('/api')
      ? normalizedBaseUrl.replace(/\/api$/, '')
      : `${normalizedBaseUrl}/api`;

    const loginUrls = [`${normalizedBaseUrl}/auth/login`, `${altBaseUrl}/auth/login`];

    let backendResponse: Response | null = null;
    let backendData: unknown = null;
    let lastTriedUrl = loginUrls[0];

    for (const loginUrl of loginUrls) {
      lastTriedUrl = loginUrl;
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        cache: 'no-store',
      });

      const data = await response.json().catch(() => null);
      backendResponse = response;
      backendData = data;

      if (response.status !== 404) {
        break;
      }
    }

    if (!backendResponse) {
      return NextResponse.json(
        { message: 'Impossible de contacter le backend.' },
        { status: 502 }
      );
    }

    if (!backendResponse.ok) {
      if (backendResponse.status === 404) {
        return NextResponse.json(
          {
            message: `Endpoint backend introuvable: ${lastTriedUrl}`,
          },
          { status: 502 }
        );
      }

      const errorMessage =
        (backendData as { message?: string } | null)?.message ??
        'Identifiants administrateur invalides.';
      return NextResponse.json({ message: errorMessage }, { status: backendResponse.status });
    }

    if (!isAdminFromBackendPayload(backendData)) {
      return NextResponse.json(
        { message: 'Acces refuse: compte non administrateur.' },
        { status: 403 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: getAdminSessionValue(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: 'Requete invalide.' },
      { status: 400 }
    );
  }
}
