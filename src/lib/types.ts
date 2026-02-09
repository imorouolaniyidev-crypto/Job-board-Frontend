// Types pour le système de candidature au job board

export type ApplicationStatus = 'PENDING' | 'IN_PROGRESS' | 'ACCEPTED' | 'REJECTED';

// Profil utilisateur (champs texte simples)
export interface UserProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  experiences: string;      // Texte libre multi-ligne
  formations: string;       // Texte libre multi-ligne
  competences: string;      // Texte libre séparé par virgules
  cv_url?: string;
  cv_filename?: string;
  created_at?: string;
  updated_at?: string;
}

// Candidature à un poste
export interface Application {
  id: string;
  job_title: string;
  company_name: string;
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
}

// User (ancien Candidate - gardé pour compatibilité)
export interface Candidate {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  skills?: string[];
  experience?: string;
  cvUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'CANDIDATE';
}
