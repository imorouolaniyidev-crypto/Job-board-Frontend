import axios from 'axios';
import { useAuthStore } from './store';

export const api = axios.create({
  // Utilise l'URL définie dans .env.local ou localhost par défaut
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  // Autoriser les cookies httpOnly du serveur à être envoyés automatiquement
  withCredentials: true,
});

// Intercepteur response : gestion des erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si 401 (token invalide ou expiré), déconnexion automatique
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear l'état utilisateur
        useAuthStore.getState().logout();
        // Redirection vers login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;