import { create } from 'zustand';

// On définit précisément ce qu'est un utilisateur dans notre système
interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'CANDIDATE';
}

interface AuthState {
  user: User | null;
  setAuth: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setAuth: (user) => {
    // Token stocké en httpOnly cookie (géré par le serveur)
    // On stocke juste les infos utilisateur en localStorage pour persistance
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      // Le cookie httpOnly sera automatiquement supprimé par le serveur
    }
    set({ user: null });
  },
}));