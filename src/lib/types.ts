// Types pour le profil candidat
export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  skills?: string[];
  experience?: string;
  cvUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Types pour les candidatures
export type ApplicationStatus = 'PENDING' | 'IN_PROGRESS' | 'ACCEPTED' | 'REJECTED';

export interface Application {
  id: string;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  applicationDate: string;
  candidateId: string;
}

// Types pour les erreurs API
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
