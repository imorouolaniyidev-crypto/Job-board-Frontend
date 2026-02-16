import { create } from 'zustand';
import { clearStoredAuthToken } from './api';

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'CANDIDATE';
}

interface AuthState {
  user: User | null;
  setAuth: (user: User) => void;
  logout: () => void;
  fetchMe: (options?: { ignoreForceLogout?: boolean }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setAuth: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('force_logged_out');
    }
    set({ user });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.setItem('force_logged_out', '1');
    }
    clearStoredAuthToken();
    set({ user: null });
  },

  fetchMe: async (options) => {
    try {
      const ignoreForceLogout = options?.ignoreForceLogout === true;
      if (
        !ignoreForceLogout &&
        typeof window !== 'undefined' &&
        localStorage.getItem('force_logged_out') === '1'
      ) {
        set({ user: null });
        return;
      }

      const baseUrl =
        (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(
          /\/+$/,
          ''
        );
      const meUrl = baseUrl ? `${baseUrl}/auth/me` : '/api/auth/me';
      const res = await fetch(meUrl, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Non authentifie');
      const data = await res.json();
      const resolvedUser = data?.user || data?.data?.user || data || null;
      if (!resolvedUser?.id) throw new Error('Session utilisateur invalide');
      set({ user: resolvedUser });
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(resolvedUser));
        localStorage.removeItem('force_logged_out');
      }
    } catch {
      set({ user: null });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    }
  },
}));
