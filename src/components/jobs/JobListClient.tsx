'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import JobCard from '@/components/jobs/JobCard';
import Pagination from '@/components/jobs/Pagination';
import { jobsApi } from '@/lib/api';
import { Job } from '@/lib/types';

type Filters = {
  q?: string;
  type?: string;
  location?: string;
};

type JobUI = Job & {
  type?: string;
  company_name?: string;
  companyName?: string;
  created_at?: string;
  details?: string;
  summary?: string;
  content?: string;
  job_description?: string;
};

export default function JobListClient({
  initialJobs,
  externalFilters,
}: {
  initialJobs?: Job[];
  externalFilters?: Filters;
}) {
  const shouldFetchFromApi = !initialJobs || initialJobs.length === 0;
  const { data: apiJobs = [], isLoading, error } = useQuery({
    queryKey: ['public-jobs'],
    queryFn: jobsApi.getJobs,
    enabled: shouldFetchFromApi,
    staleTime: 60 * 1000,
  });

  const jobs = useMemo(
    () => (shouldFetchFromApi ? (apiJobs as JobUI[]) : ((initialJobs ?? []) as JobUI[])),
    [apiJobs, initialJobs, shouldFetchFromApi]
  );

  const [filters, setFilters] = useState<Filters>({ q: '', type: '', location: '' });
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const effectiveFilters = externalFilters ?? filters;

  function handleFilters(nextFilters: Filters) {
    setFilters({
      q: nextFilters.q || '',
      type: nextFilters.type || '',
      location: nextFilters.location || '',
    });
    setPage(1);
  }

  function resetFilters() {
    setFilters({ q: '', type: '', location: '' });
    setSort('recent');
    setPage(1);
  }

  const availableTypes = useMemo(() => {
    const values = new Set<string>();
    jobs.forEach((job) => {
      const type = String(job.type || job.jobType || '').trim();
      if (type) values.add(type);
    });
    return Array.from(values);
  }, [jobs]);

  const availableLocations = useMemo(() => {
    const values = new Set<string>();
    jobs.forEach((job) => {
      const location = String(job.location || '').trim();
      if (location) values.add(location);
    });
    return Array.from(values);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const q = (effectiveFilters.q || '').trim().toLowerCase();
    const list = jobs.filter((job) => {
      const jobType = String(job.type || job.jobType || '').toLowerCase();
      const location = String(job.location || '').toLowerCase();
      const title = String(job.title || '').toLowerCase();
      const company = String(job.companyName || job.company_name || job.company || '').toLowerCase();
      const description = getDescriptionText(job).toLowerCase();

      if (effectiveFilters.type && jobType !== String(effectiveFilters.type).toLowerCase()) return false;
      if (effectiveFilters.location && !location.includes(String(effectiveFilters.location).toLowerCase())) return false;
      if (q && !(title.includes(q) || company.includes(q) || description.includes(q))) return false;
      return true;
    });

    list.sort((a, b) => {
      if (sort === 'title') return String(a.title || '').localeCompare(String(b.title || ''));

      const aDate = new Date(a.created_at || a.createdAt || '').getTime();
      const bDate = new Date(b.created_at || b.createdAt || '').getTime();
      if (sort === 'old') return aDate - bDate;
      return bDate - aDate;
    });

    return list;
  }, [jobs, effectiveFilters, sort]);

  const perPage = 10;
  const total = filteredJobs.length;
  const start = (page - 1) * perPage;
  const pageJobs = filteredJobs.slice(start, start + perPage);

  if (isLoading && shouldFetchFromApi) {
    return <div className="py-8 text-center text-sm text-muted-foreground">Chargement des offres...</div>;
  }

  if (error && shouldFetchFromApi) {
    return (
      <div className="py-8 text-center text-sm text-red-600">
        Impossible de charger les offres depuis la base de donnees.
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
      <aside className="hidden md:block">
        <div className="sticky top-20 rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-2xl font-bold">Filtrer les offres</h3>
            <button onClick={resetFilters} className="text-sm text-[#2c3e6e] hover:underline">
              Reinitialiser
            </button>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold">Recherche</label>
            <input
              value={filters.q}
              placeholder="Developpeur, marketing, IA..."
              className="w-full rounded border px-3 py-2 text-sm"
              onChange={(e) => handleFilters({ ...filters, q: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold">Type de contrat</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilters({ ...filters, type: e.target.value })}
              className="w-full rounded border px-3 py-2 text-sm"
            >
              <option value="">Tous les types</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold">Localisation</label>
            <select
              value={filters.location}
              onChange={(e) => handleFilters({ ...filters, location: e.target.value })}
              className="w-full rounded border px-3 py-2 text-sm"
            >
              <option value="">Toutes les villes</option>
              {availableLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>
      </aside>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {filteredJobs.length} Jobes disponible{filteredJobs.length > 1 ? 's' : ''}
            </h2>
            <p className="text-sm text-muted-foreground">Trouvez une opportunite qui vous correspond</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Trier :</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Trier les resultats"
              className="rounded border px-2 py-1 text-sm"
            >
              <option value="recent">Plus recents</option>
              <option value="old">Plus anciens</option>
              <option value="title">Titre A-Z</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {pageJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="mt-6">
          <Pagination current={page} onChange={(p) => setPage(p)} total={total} perPage={perPage} />
        </div>
      </section>
    </div>
  );
}

function getDescriptionText(job: JobUI): string {
  const directCandidates = [
    (job as { description?: unknown }).description,
    (job as { details?: unknown }).details,
    (job as { summary?: unknown }).summary,
    (job as { content?: unknown }).content,
    (job as { job_description?: unknown }).job_description,
    (job as { jobDescription?: unknown }).jobDescription,
    (job as { description_text?: unknown }).description_text,
    (job as { Description?: unknown }).Description,
  ];

  for (const candidate of directCandidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  for (const [key, value] of Object.entries(job as Record<string, unknown>)) {
    if (!/description|details|summary|content/i.test(key)) continue;
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return '';
}
