// Types pour le profil candidat
export type CandidateStatus = 'ACTIVE' | 'REVIEWING' | 'REJECTED';

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  skills?: string[];
  experience?: string;
  cvUrl?: string;
  status: CandidateStatus;
  createdAt: string;
  updatedAt: string;
  applicationsCount?: number;
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

// ============================================
// ADMIN - JOBS
// ============================================

export type JobType = 'CDI' | 'CDD' | 'STAGE';
export type WorkMode = 'REMOTE' | 'ON_SITE' | 'HYBRID';
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  salary?: string;
  location: string;
  jobType: JobType;
  workMode: WorkMode;
  status: JobStatus;
  createdBy: string;
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
