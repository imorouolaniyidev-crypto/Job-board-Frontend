import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  getBackendApiBaseUrl,
  getAdminSessionValue,
} from '@/lib/admin-auth';

function isAdminFromBackendPayload(payload: unknown): boolean {
  const data = (payload ?? {}) as Record<string, unknown>;

  const readPath = (source: unknown, path: string[]): unknown => {
    let current: unknown = source;
    for (const key of path) {
      if (!current || typeof current !== 'object') return undefined;
      current = (current as Record<string, unknown>)[key];
    }
    return current;
  };

  const isTruthyAdminFlag = (value: unknown): boolean => {
    if (value === true || value === 1) return true;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      return normalized === 'true' || normalized === '1' || normalized === 'yes';
    }
    return false;
  };

  const extractStrings = (value: unknown): string[] => {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap((item) => extractStrings(item));
    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>;
      const candidates = [
        record.role,
        record.name,
        record.code,
        record.authority,
        record.value,
      ];
      return candidates.flatMap((item) => extractStrings(item));
    }
    return [];
  };

  const adminFlagPaths = [
    ['isAdmin'],
    ['is_admin'],
    ['user', 'isAdmin'],
    ['user', 'is_admin'],
    ['data', 'isAdmin'],
    ['data', 'is_admin'],
    ['data', 'user', 'isAdmin'],
    ['data', 'user', 'is_admin'],
  ];

  for (const flagPath of adminFlagPaths) {
    if (isTruthyAdminFlag(readPath(data, flagPath))) {
      return true;
    }
  }

  const rolePaths = [
    ['userRole'],
    ['role'],
    ['roles'],
    ['authorities'],
    ['permissions'],
    ['user', 'role'],
    ['user', 'roles'],
    ['user', 'authorities'],
    ['data', 'role'],
    ['data', 'userRole'],
    ['data', 'roles'],
    ['data', 'authorities'],
    ['data', 'permissions'],
    ['data', 'user', 'role'],
    ['data', 'user', 'roles'],
    ['data', 'user', 'authorities'],
  ];

  const tokens = rolePaths
    .flatMap((path) => extractStrings(readPath(data, path)))
    .flatMap((value) => value.split(/[\s,;|]+/))
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);

  return tokens.some((token) =>
    ['ADMIN', 'ROLE_ADMIN', 'ADMINISTRATOR', 'ROLE_SUPER_ADMIN', 'SUPER_ADMIN'].includes(token)
  );
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payloadPart = parts[1];
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const normalized = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = Buffer.from(normalized, 'base64').toString('utf8');
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function isAdminFromTokenPayload(payload: Record<string, unknown> | null): boolean {
  if (!payload) return false;
  return isAdminFromBackendPayload(payload);
}

function extractTokenFromPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const data = payload as Record<string, unknown>;
  const candidates = [
    data.token,
    data.accessToken,
    data.access_token,
    data.jwt,
    (data.data as Record<string, unknown> | undefined)?.token,
    (data.data as Record<string, unknown> | undefined)?.accessToken,
    (data.data as Record<string, unknown> | undefined)?.access_token,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
  }
  return null;
}

function buildCookieHeaderFromSetCookie(response: Response): string {
  const headersWithGetSetCookie = response.headers as Headers & {
    getSetCookie?: () => string[];
  };

  const setCookies = headersWithGetSetCookie.getSetCookie?.() ?? [];
  if (setCookies.length === 0) {
    const single = response.headers.get('set-cookie');
    if (!single) return '';
    const firstChunk = single.split(',')[0]?.trim();
    return firstChunk?.split(';')[0] ?? '';
  }

  return setCookies
    .map((raw) => raw.split(';')[0]?.trim())
    .filter(Boolean)
    .join('; ');
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

    let isAdmin = isAdminFromBackendPayload(backendData);

    if (!isAdmin) {
      const token = extractTokenFromPayload(backendData);
      if (token) {
        const jwtPayload = decodeJwtPayload(token);
        isAdmin = isAdminFromTokenPayload(jwtPayload);
      }
    }

    if (!isAdmin) {
      const meUrls = [`${normalizedBaseUrl}/auth/me`, `${altBaseUrl}/auth/me`];
      const cookieHeader = buildCookieHeaderFromSetCookie(backendResponse);

      for (const meUrl of meUrls) {
        const meResponse = await fetch(meUrl, {
          method: 'GET',
          headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
          cache: 'no-store',
        });

        if (!meResponse.ok) continue;
        const meData = await meResponse.json().catch(() => null);
        if (isAdminFromBackendPayload(meData)) {
          isAdmin = true;
          break;
        }
      }
    }

    if (!isAdmin) {
      const payloadKeys =
        backendData && typeof backendData === 'object'
          ? Object.keys(backendData as Record<string, unknown>)
          : [];
      const isDev = process.env.NODE_ENV !== 'production';
      const hasOnlyMessageKey = payloadKeys.length === 1 && payloadKeys[0] === 'message';

      // Backend sometimes returns only { message: "..." } on successful login (no role/token).
      // In dev mode, allow admin session creation to unblock local work.
      if (isDev && hasOnlyMessageKey) {
        isAdmin = true;
      }
    }

    if (!isAdmin) {
      const payloadKeys =
        backendData && typeof backendData === 'object'
          ? Object.keys(backendData as Record<string, unknown>)
          : [];
      const debugSuffix =
        process.env.NODE_ENV !== 'production' && payloadKeys.length > 0
          ? ` (debug keys: ${payloadKeys.join(', ')})`
          : '';
      return NextResponse.json(
        { message: `Acces refuse: compte non administrateur.${debugSuffix}` },
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
