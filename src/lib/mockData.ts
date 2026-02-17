import { Application } from './types';

// Mock data pour les candidatures
export const mockApplications: Application[] = [
  {
    id: '1',
    job_title: 'React Developer',
    company_name: 'TechCorp',
    status: 'REVIEWED',
    applied_at: '2026-02-05',
    updated_at: '2026-02-08',
  },
  {
    id: '2',
    job_title: 'Senior JavaScript Developer',
    company_name: 'WebAgency',
    status: 'PENDING',
    applied_at: '2026-02-07',
    updated_at: '2026-02-07',
  },
  {
    id: '3',
    job_title: 'Full Stack Developer',
    company_name: 'StartupXYZ',
    status: 'REVIEWED',
    applied_at: '2026-01-20',
    updated_at: '2026-02-03',
  },
  {
    id: '4',
    job_title: 'Frontend Engineer',
    company_name: 'DigitalStudio',
    status: 'REJECTED',
    applied_at: '2026-01-15',
    updated_at: '2026-02-01',
  },
  {
    id: '5',
    job_title: 'Next.js Developer',
    company_name: 'CloudTech',
    status: 'REVIEWED',
    applied_at: '2026-02-03',
    updated_at: '2026-02-06',
  },
];

// Profil utilisateur par défaut
export const defaultUserProfile = {
  user_id: 'user_123',
  first_name: 'Jean',
  last_name: 'Dupont',
  phone: '0612345678',
  email: 'jean.dupont@example.com',
  experiences: '',
  formations: '',
  competences: '',
  cv_url: undefined,
  cv_filename: undefined,
  photo_url: undefined,
  photo_filename: undefined,
};
