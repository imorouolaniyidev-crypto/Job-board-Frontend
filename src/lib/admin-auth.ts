export const ADMIN_SESSION_COOKIE = 'admin_session';
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12h

const DEFAULT_ADMIN_SESSION_VALUE = 'admin-authenticated';

export function getAdminSessionValue() {
  return process.env.ADMIN_SESSION_VALUE ?? DEFAULT_ADMIN_SESSION_VALUE;
}

export function getBackendApiBaseUrl() {
  return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
}
