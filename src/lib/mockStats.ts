import { DashboardStats } from './types';

export const mockDashboardStats: DashboardStats = {
  totalUsers: 125,
  totalCandidates: 98,
  totalAdmins: 27,
  totalJobs: 42,
  activeJobs: 35,
  totalApplications: 456,
  applicationsByStatus: {
    PENDING: 145,
    IN_PROGRESS: 189,
    ACCEPTED: 89,
    REJECTED: 33,
  },
  jobsPostedThisMonth: 12,
  applicationsThisMonth: 145,
  averageApplicationsPerJob: 10.8,
};
