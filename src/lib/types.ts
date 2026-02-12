// Types pour le système de candidature au job board

// Types pour le profil candidat
export type ApplicationStatus = 'PENDING' | 'IN_PROGRESS' | 'ACCEPTED' | 'REJECTED';
export type CandidateStatus = 'ACTIVE' | 'REVIEWING' | 'REJECTED';

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

// User (ancien Candidate)
export interface Candidate {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  skills?: string[];
  experience?: string;
  cvUrl?: string;
  status: CandidateStatus;
  createdAt: string;
  updatedAt: string;
  applicationsCount?: number;
}

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'CANDIDATE';
}

// ============================================
// ADMIN - JOBS
// ============================================

export type JobType = 'CDI' | 'CDD';
export type JobSource = 'INTERNAL' | 'EXTERNAL';

export interface Job {
  id: string;
  title: string;
  company_name: string;
  company_logo?: string;
  description: string;
  location?: string;
  source: JobSource;
  source_url?: string;
  type: JobType;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  applicationsCount?: number;
}

// ============================================
// ADMIN - DASHBOARD STATISTICS
// ============================================

export interface ApplicationsByStatus {
  PENDING: number;
  IN_PROGRESS: number;
  ACCEPTED: number;
  REJECTED: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalCandidates: number;
  totalAdmins: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  applicationsByStatus: ApplicationsByStatus;
  jobsPostedThisMonth: number;
  applicationsThisMonth: number;
  averageApplicationsPerJob: number;
}

export interface StatisticCard {
  label: string;
  value: number;
  icon: string;
  trend?: number;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'cyan';
}

// ============================================
// ADMIN - CANDIDATES APPLICATIONS
// ============================================

export interface ApplicationDetail {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  jobId: string;
  jobTitle: string;
  status: ApplicationStatus;
  applicationDate: string;
  cvUrl?: string;
  notes?: string;
  lastStatusUpdate: string;
}
