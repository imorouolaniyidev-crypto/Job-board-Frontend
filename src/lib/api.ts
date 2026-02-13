import axios from 'axios';
import { Candidate, Application, ApplicationStatus, DashboardStats, Job, UserProfile } from './types';

export const api = axios.create({
  // Utilise l'URL définie dans .env.local ou localhost par défaut
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api',
  // Autoriser les cookies httpOnly du serveur à être envoyés automatiquement
  withCredentials: true,
});

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api';
const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, '');

function getStoredAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const tokenCandidates = [
    localStorage.getItem('auth_token'),
    localStorage.getItem('token'),
    localStorage.getItem('accessToken'),
    localStorage.getItem('access_token'),
    localStorage.getItem('jwt'),
  ];
  for (const candidate of tokenCandidates) {
    if (candidate && candidate.trim()) return candidate.trim();
  }
  return null;
}

export function clearStoredAuthToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('token');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('access_token');
  localStorage.removeItem('jwt');
}

function extractTokenDeep(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    // Accept raw JWT or Bearer token strings.
    if (trimmed.split('.').length >= 3) return trimmed;
    if (/^Bearer\s+/i.test(trimmed)) return trimmed.replace(/^Bearer\s+/i, '').trim();
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const nested = extractTokenDeep(item);
      if (nested) return nested;
    }
    return null;
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const directKeys = [
      'token',
      'accessToken',
      'access_token',
      'jwt',
      'idToken',
      'id_token',
      'bearerToken',
      'bearer_token',
    ];

    for (const key of directKeys) {
      const nested = extractTokenDeep(record[key]);
      if (nested) return nested;
    }

    for (const nestedValue of Object.values(record)) {
      const nested = extractTokenDeep(nestedValue);
      if (nested) return nested;
    }
  }

  return null;
}

export function persistAuthTokenFromPayload(payload: unknown) {
  if (typeof window === 'undefined') return;
  const token = extractTokenDeep(payload);
  if (!token) return;
  localStorage.setItem('auth_token', token);
}

api.interceptors.request.use((config) => {
  const token = getStoredAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur response : gestion des erreurs d'authentification
// DÉSACTIVÉ POUR TESTS - À RÉACTIVER EN PRODUCTION
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Si 401 (token invalide ou expiré), déconnexion automatique
//     if (error.response?.status === 401) {
//       if (typeof window !== 'undefined') {
//         // Clear l'état utilisateur
//         useAuthStore.getState().logout();
//         // Redirection vers login
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api;

function normalizeCollectionPayload<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const candidates = [
      record.data,
      record.jobs,
      record.items,
      record.profiles,
      record.candidates,
      record.users,
      record.results,
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate as T[];
      }

      if (candidate && typeof candidate === 'object') {
        const nested = candidate as Record<string, unknown>;
        const nestedArrays = [
          nested.data,
          nested.items,
          nested.profiles,
          nested.candidates,
          nested.users,
          nested.results,
        ];

        for (const nestedCandidate of nestedArrays) {
          if (Array.isArray(nestedCandidate)) {
            return nestedCandidate as T[];
          }
        }
      }
    }
  }

  return [];
}

function normalizeEntityPayload<T>(payload: unknown): T | null {
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    if (record.data && typeof record.data === 'object') {
      return record.data as T;
    }
  }

  if (payload && typeof payload === 'object') {
    return payload as T;
  }

  return null;
}

function extractApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Erreur inconnue';
  }

  const status = error.response?.status;
  const data = error.response?.data as
    | { message?: string; error?: string; details?: string }
    | string
    | undefined;

  const apiMessage =
    typeof data === 'string'
      ? data
      : data?.message || data?.error || data?.details || error.message || 'Erreur API';

  return status ? `HTTP ${status} - ${apiMessage}` : apiMessage;
}

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
// PUBLIC JOBS API ENDPOINTS
// ============================================

export const jobsApi = {
  getJobs: async (): Promise<Job[]> => {
    try {
      const response = await api.get('/jobs');
      return normalizeCollectionPayload<Job>(response.data);
    } catch (firstError) {
      // Some backends expose /job instead of /jobs.
      try {
        const fallbackResponse = await api.get('/job');
        return normalizeCollectionPayload<Job>(fallbackResponse.data);
      } catch {
        throw new Error(`Impossible de charger les offres: ${extractApiErrorMessage(firstError)}`);
      }
    }
  },

  getJob: async (jobId: string): Promise<Job | null> => {
    try {
      const response = await api.get(`/job/${jobId}`);
      return normalizeEntityPayload<Job>(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status !== 404) {
        throw error;
      }
    }

    try {
      const response = await api.get(`/jobs/${jobId}`);
      return normalizeEntityPayload<Job>(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};

function normalizeCandidateStatus(value: unknown): Candidate['status'] {
  const normalized = String(value || '').trim().toUpperCase();
  if (normalized === 'ACTIVE' || normalized === 'REVIEWING' || normalized === 'REJECTED') {
    return normalized as Candidate['status'];
  }
  return 'ACTIVE';
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function buildProfileData(record: Record<string, unknown>, profileRecord: Record<string, unknown>) {
  const merged = { ...record, ...profileRecord };
  const ignored = new Set([
    'id',
    '_id',
    'user_id',
    'userId',
    'email',
    'userEmail',
    'firstName',
    'first_name',
    'firstname',
    'lastName',
    'last_name',
    'lastname',
    'name',
    'skills',
    'competences',
    'experience',
    'experiences',
    'status',
    'createdAt',
    'created_at',
    'updatedAt',
    'updated_at',
    'cv',
    'cvUrl',
    'cv_url',
    'cvFilename',
    'cv_filename',
    'user',
    'profile',
    'password',
  ]);

  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(merged)) {
    if (ignored.has(key)) continue;
    if (value == null || value === '') continue;
    output[key] = value;
  }

  return Object.keys(output).length > 0 ? output : undefined;
}

function normalizeCandidateEntity(payload: unknown): Candidate | null {
  if (!payload || typeof payload !== 'object') return null;
  const record = payload as Record<string, unknown>;
  const profileRecord = asRecord(record.profile) ?? record;
  const userRecord = asRecord(record.user);

  const id = String(
    profileRecord.id ??
      profileRecord._id ??
      profileRecord.user_id ??
      record.id ??
      record._id ??
      record.user_id ??
      ''
  );
  const email = String(
    userRecord?.email ??
      userRecord?.user_email ??
      record.email ??
      record.user_email ??
      record.userEmail ??
      profileRecord.email ??
      profileRecord.user_email ??
      profileRecord.userEmail ??
      ''
  );
  const firstName = String(
    profileRecord.firstName ??
      profileRecord.first_name ??
      profileRecord.firstname ??
      profileRecord.name ??
      ''
  );
  const lastName = String(
    profileRecord.lastName ?? profileRecord.last_name ?? profileRecord.lastname ?? ''
  );

  if (!id) return null;

  const skillsRaw = profileRecord.skills ?? profileRecord.competences;
  const skills = Array.isArray(skillsRaw)
    ? skillsRaw.map((item) => String(item)).filter(Boolean)
    : typeof skillsRaw === 'string'
      ? skillsRaw
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : undefined;

  return {
    id,
    email: email || `candidate-${id}@unknown.local`,
    firstName: firstName || 'Candidat',
    lastName: lastName || '',
    phone: profileRecord.phone ? String(profileRecord.phone) : undefined,
    skills,
    experience: String(profileRecord.experience ?? profileRecord.experiences ?? '') || undefined,
    cvUrl: String(profileRecord.cvUrl ?? profileRecord.cv_url ?? '') || undefined,
    profileData: buildProfileData(record, profileRecord),
    status: normalizeCandidateStatus(profileRecord.status ?? record.status),
    createdAt: String(
      profileRecord.createdAt ?? profileRecord.created_at ?? record.createdAt ?? new Date().toISOString()
    ),
    updatedAt: String(
      profileRecord.updatedAt ?? profileRecord.updated_at ?? record.updatedAt ?? new Date().toISOString()
    ),
    applicationsCount:
      typeof profileRecord.applicationsCount === 'number'
        ? profileRecord.applicationsCount
        : typeof record.applicationsCount === 'number'
          ? record.applicationsCount
          : undefined,
  };
}

function normalizeCandidatesPayload(payload: unknown): Candidate[] {
  const collection = normalizeCollectionPayload<unknown>(payload);
  return collection
    .map((item) => normalizeCandidateEntity(item))
    .filter((candidate): candidate is Candidate => candidate !== null);
}

export const candidatesApi = {
  getPublicCandidates: async (): Promise<Candidate[]> => {
    try {
      const response = await api.get('/public/profiles');
      const directNormalized = normalizeCandidatesPayload(response.data);
      if (directNormalized.length > 0) return directNormalized;

      const extracted = extractProfilesPayload(response.data)
        .map((entry) => normalizeCandidateEntity(entry))
        .filter((entry): entry is Candidate => entry !== null);
      if (extracted.length > 0) return extracted;

      throw new Error(
        'Route /public/profiles atteinte, mais le format de reponse ne contient aucun candidat exploitable.'
      );
    } catch (error) {
      throw new Error(
        `Impossible de charger les candidats depuis /public/profiles: ${extractApiErrorMessage(error)}`
      );
    }
  },
};

function normalizeUserProfilePayload(payload: unknown): UserProfile {
  const toRecord = (value: unknown): Record<string, unknown> =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const getConnectedUser = (): { id?: string; email?: string } => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return {};
      const parsed = JSON.parse(raw) as { id?: string; email?: string };
      return {
        id: parsed?.id,
        email: parsed?.email?.toLowerCase(),
      };
    } catch {
      return {};
    }
  };

  const connectedUser = getConnectedUser();

  const scoreProfileMatch = (entry: Record<string, unknown>): number => {
    const user = toRecord(entry.user);
    const profile = toRecord(entry.profile);

    const candidateId = String(
      profile.user_id ?? profile.userId ?? user.id ?? entry.user_id ?? entry.userId ?? ''
    );
    const candidateEmail = String(
      user.email ?? user.user_email ?? entry.email ?? entry.user_email ?? profile.email ?? profile.user_email ?? ''
    ).toLowerCase();

    let score = 0;
    if (connectedUser.id && candidateId && connectedUser.id === candidateId) score += 2;
    if (connectedUser.email && candidateEmail && connectedUser.email === candidateEmail) score += 2;
    return score;
  };

  const pickBestEntry = (entries: Record<string, unknown>[]): Record<string, unknown> => {
    if (entries.length === 0) return {};
    let best = entries[0];
    let bestScore = scoreProfileMatch(best);
    for (const entry of entries.slice(1)) {
      const score = scoreProfileMatch(entry);
      if (score > bestScore) {
        best = entry;
        bestScore = score;
      }
    }
    return best;
  };

  const pickString = (source: Record<string, unknown>, keys: string[]): string => {
    for (const key of keys) {
      const value = source[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
      if (typeof value === 'number') return String(value);
    }
    return '';
  };

  const payloadRecord = toRecord(payload);
  const listCandidates = [
    Array.isArray(payload) ? payload : null,
    Array.isArray(payloadRecord.data) ? payloadRecord.data : null,
    Array.isArray(payloadRecord.profiles) ? payloadRecord.profiles : null,
    Array.isArray(payloadRecord.items) ? payloadRecord.items : null,
  ].filter((item): item is unknown[] => Array.isArray(item));

  const selectedEntry = listCandidates.length > 0
    ? pickBestEntry(listCandidates[0].map((item) => toRecord(item)).filter((item) => Object.keys(item).length > 0))
    : {};

  const root = Object.keys(selectedEntry).length > 0 ? selectedEntry : payload;
  const record = toRecord(root);
  const data = toRecord(record.data);
  const profileCandidate =
    data.profile ??
    record.profile ??
    (Object.keys(data).length > 0 ? data : record);
  const profile = Array.isArray(profileCandidate)
    ? toRecord(profileCandidate[0])
    : toRecord(profileCandidate);
  const user = toRecord(data.user || record.user || profile.user);

  const competencesRaw = profile.competences ?? profile.skills ?? profile.competence;
  const competences = Array.isArray(competencesRaw)
    ? competencesRaw.map((item) => String(item)).filter(Boolean).join(', ')
    : typeof competencesRaw === 'string'
      ? competencesRaw
      : '';
  const rawCvUrl = pickString(profile, ['cv_url', 'cvUrl', 'cv', 'resume', 'resume_url']);
  const normalizedCvUrl =
    rawCvUrl && /^https?:\/\//i.test(rawCvUrl)
      ? rawCvUrl
      : rawCvUrl
        ? `${apiOrigin}${rawCvUrl.startsWith('/') ? '' : '/'}${rawCvUrl}`
        : undefined;

  return {
    user_id: pickString(profile, ['user_id', 'userId', 'id']) || pickString(user, ['id']),
    first_name: pickString(profile, ['first_name', 'firstName', 'firstname', 'name']),
    last_name: pickString(profile, ['last_name', 'lastName', 'lastname', 'surname']),
    phone: pickString(profile, ['phone', 'phone_number', 'telephone', 'mobile']),
    email:
      pickString(user, ['email', 'user_email']) ||
      pickString(profile, ['email', 'user_email']) ||
      pickString(record, ['email', 'user_email']),
    experiences: pickString(profile, ['experiences', 'experience', 'description', 'bio', 'about']),
    formations: pickString(profile, ['formations', 'formation', 'education']),
    competences,
    cv_url: normalizedCvUrl,
    cv_filename:
      pickString(profile, ['cv_filename', 'cvFilename']) || undefined,
    created_at: pickString(profile, ['created_at', 'createdAt']) || undefined,
    updated_at: pickString(profile, ['updated_at', 'updatedAt']) || undefined,
  };
}

function hasProfileDetails(profile: UserProfile): boolean {
  return Boolean(
    profile.first_name ||
      profile.last_name ||
      profile.phone ||
      profile.experiences ||
      profile.formations ||
      profile.competences
  );
}

function mergeUserProfile(
  primary: UserProfile,
  secondary: UserProfile,
  connectedUser?: { id?: string; email?: string }
): UserProfile {
  return {
    user_id: primary.user_id || secondary.user_id || connectedUser?.id || '',
    first_name: primary.first_name || secondary.first_name || '',
    last_name: primary.last_name || secondary.last_name || '',
    phone: primary.phone || secondary.phone || '',
    email: connectedUser?.email || primary.email || secondary.email || '',
    experiences: primary.experiences || secondary.experiences || '',
    formations: primary.formations || secondary.formations || '',
    competences: primary.competences || secondary.competences || '',
    cv_url: primary.cv_url || secondary.cv_url,
    cv_filename: primary.cv_filename || secondary.cv_filename,
    created_at: primary.created_at || secondary.created_at,
    updated_at: primary.updated_at || secondary.updated_at,
  };
}

function extractProfilesPayload(payload: unknown): Record<string, unknown>[] {
  const toRecord = (value: unknown): Record<string, unknown> | null =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;

  if (Array.isArray(payload)) {
    return payload.map((item) => toRecord(item)).filter((item): item is Record<string, unknown> => item !== null);
  }

  const record = toRecord(payload);
  if (!record) return [];

  const buckets = [record.data, record.items, record.profiles, record.results];
  for (const bucket of buckets) {
    if (!Array.isArray(bucket)) continue;
    const list = bucket
      .map((item) => toRecord(item))
      .filter((item): item is Record<string, unknown> => item !== null);
    if (list.length > 0) return list;
  }

  return [record];
}

function getProfileUserId(profile: Record<string, unknown>): string {
  const nestedProfile =
    profile.profile && typeof profile.profile === 'object'
      ? (profile.profile as Record<string, unknown>)
      : profile;
  return String(
    nestedProfile.user_id ??
      nestedProfile.userId ??
      nestedProfile.id_user ??
      profile.user_id ??
      profile.userId ??
      ''
  );
}

function getProfileEmail(profile: Record<string, unknown>): string {
  const nestedProfile =
    profile.profile && typeof profile.profile === 'object'
      ? (profile.profile as Record<string, unknown>)
      : profile;
  const nestedUser =
    profile.user && typeof profile.user === 'object'
      ? (profile.user as Record<string, unknown>)
      : {};
  return String(
    nestedUser.email ??
      nestedUser.user_email ??
      nestedProfile.email ??
      nestedProfile.user_email ??
      profile.email ??
      profile.user_email ??
      ''
  ).toLowerCase();
}

export const profileApi = {
  getMyProfile: async (): Promise<UserProfile> => {
    let connectedId = '';
    let connectedEmail = '';
    const connectedUser: { id?: string; email?: string } = {};

    try {
      const meResponse = await api.get('/auth/me');
      const meRecord = (meResponse.data && typeof meResponse.data === 'object'
        ? (meResponse.data as Record<string, unknown>)
        : {}) as Record<string, unknown>;
      const meUser = (meRecord.user && typeof meRecord.user === 'object'
        ? (meRecord.user as Record<string, unknown>)
        : meRecord) as Record<string, unknown>;
      connectedId = String(meUser.id ?? meUser.user_id ?? '');
      connectedEmail = String(meUser.email ?? '').toLowerCase();
      connectedUser.id = connectedId || undefined;
      connectedUser.email = connectedEmail || undefined;
    } catch {
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('user');
          if (raw) {
            const parsed = JSON.parse(raw) as { id?: string; email?: string };
            connectedId = String(parsed.id ?? '');
            connectedEmail = String(parsed.email ?? '').toLowerCase();
            connectedUser.id = connectedId || undefined;
            connectedUser.email = connectedEmail || undefined;
          }
        } catch {
          // Ignore parse failure.
        }
      }
    }

    if ((!connectedId && !connectedEmail) && typeof window !== 'undefined') {
      try {
        const token =
          localStorage.getItem('auth_token') ||
          localStorage.getItem('token') ||
          localStorage.getItem('accessToken') ||
          localStorage.getItem('access_token') ||
          localStorage.getItem('jwt');
        if (token) {
          const parts = token.split('.');
          if (parts.length >= 2) {
            const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            const normalized = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
            const payloadJson = atob(normalized);
            const jwtPayload = JSON.parse(payloadJson) as Record<string, unknown>;
            connectedId = String(jwtPayload.id ?? jwtPayload.userId ?? jwtPayload.user_id ?? jwtPayload.sub ?? '');
            connectedEmail = String(jwtPayload.email ?? '').toLowerCase();
            connectedUser.id = connectedId || undefined;
            connectedUser.email = connectedEmail || undefined;
          }
        }
      } catch {
        // Ignore JWT decode failure.
      }
    }

    if (!connectedId && !connectedEmail) {
      throw new Error('Utilisateur connecte introuvable. Veuillez vous reconnecter.');
    }

    const publicProfiles = await api.get('/public/profiles');
    const entries = extractProfilesPayload(publicProfiles.data);
    const matched = entries.find((entry) => {
      const entryId = getProfileUserId(entry);
      const entryEmail = getProfileEmail(entry);
      if (connectedId && entryId && connectedId === entryId) return true;
      if (connectedEmail && entryEmail && connectedEmail === entryEmail) return true;
      return false;
    });

    if (!matched) {
      throw new Error('Profil du user connecte introuvable dans /public/profiles');
    }

    const fromPublic = normalizeUserProfilePayload(matched);
    if (!hasProfileDetails(fromPublic)) {
      throw new Error('Le profil trouve est vide/incomplet dans /public/profiles');
    }
    return mergeUserProfile(fromPublic, fromPublic, connectedUser);
  },
  updateMyProfile: async (payload: UserProfile, cvFile?: File): Promise<UserProfile> => {
    const formData = new FormData();
    formData.append('firstName', payload.first_name);
    formData.append('lastName', payload.last_name);
    if (payload.phone) formData.append('phone', payload.phone);
    if (payload.competences) formData.append('competences', payload.competences);
    if (payload.formations) formData.append('formation', payload.formations);
    if (payload.experiences) formData.append('experiences', payload.experiences);
    if (cvFile) formData.append('cv', cvFile);

    const response = await api.post('/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const normalized = normalizeUserProfilePayload(response.data?.profile ?? response.data);
    return mergeUserProfile(normalized || payload, payload, {
      id: payload.user_id,
      email: payload.email,
    });
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
