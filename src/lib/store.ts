import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'CANDIDATE';
}

interface AuthState {
  user: User | null;
  setAuth: (user: User) => void;
  logout: () => void;
  fetchMe: () => Promise<void>; // Nouveau : récupère l'user depuis le backend
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setAuth: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    set({ user: null });
  },

  fetchMe: async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: 'include', // Nécessaire pour envoyer le cookie httpOnly
      });
      if (!res.ok) throw new Error('Non authentifié');
      const data = await res.json();
      set({ user: data.user });
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch {
      set({ user: null });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    }
  },
}));
 
