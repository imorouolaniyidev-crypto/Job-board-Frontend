import axios from 'axios';
import { useAuthStore } from './store';
import { Candidate, Application, ApplicationStatus, DashboardStats, Job } from './types';

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

// ============================================
// CANDIDATE PROFILE API ENDPOINTS
// ============================================

export const candidateApi = {
  // Get candidate profile by ID
  getProfile: async (candidateId: string): Promise<Candidate> => {
    const response = await api.get(`/candidates/${candidateId}`);
    return response.data;
  },

  // Update candidate profile
  updateProfile: async (candidateId: string, data: Partial<Candidate>): Promise<Candidate> => {
    const response = await api.put(`/candidates/${candidateId}`, data);
    return response.data;
  },

  // Upload CV
  uploadCV: async (candidateId: string, file: File): Promise<{ cvUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/candidates/${candidateId}/cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete CV
  deleteCV: async (candidateId: string): Promise<void> => {
    await api.delete(`/candidates/${candidateId}/cv`);
  },
};

// ============================================
// APPLICATIONS API ENDPOINTS
// ============================================

export const applicationsApi = {
  // Get all applications for a candidate
  getApplications: async (candidateId: string): Promise<Application[]> => {
    const response = await api.get(`/candidates/${candidateId}/applications`);
    return response.data;
  },

  // Get single application
  getApplication: async (applicationId: string): Promise<Application> => {
    const response = await api.get(`/applications/${applicationId}`);
    return response.data;
  },

  // Update application status
  updateApplicationStatus: async (
    applicationId: string,
    status: ApplicationStatus
  ): Promise<Application> => {
    const response = await api.patch(`/applications/${applicationId}`, { status });
    return response.data;
  },
};

// ============================================
// ADMIN API ENDPOINTS
// ============================================

export const adminApi = {
  // Dashboard Statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // Jobs Management
  getJobs: async (page?: number, limit?: number): Promise<{ data: Job[]; total: number }> => {
    const response = await api.get('/admin/jobs', { params: { page, limit } });
    return response.data;
  },

  getJob: async (jobId: string): Promise<Job> => {
    const response = await api.get(`/admin/jobs/${jobId}`);
    return response.data;
  },

  createJob: async (data: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<Job> => {
    const response = await api.post('/admin/jobs', data);
    return response.data;
  },

  updateJob: async (jobId: string, data: Partial<Job>): Promise<Job> => {
    const response = await api.put(`/admin/jobs/${jobId}`, data);
    return response.data;
  },

  deleteJob: async (jobId: string): Promise<void> => {
    await api.delete(`/admin/jobs/${jobId}`);
  },
};