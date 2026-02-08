 'use client';
import React, { useMemo, useState } from 'react';
import JobCard from '@/components/jobs/JobCard';
import Pagination from '@/components/jobs/Pagination';
import JobFilters from '@/components/jobs/JobFilters';

export default function JobListClient({ initialJobs }: { initialJobs?: any[] }) {
  const jobs = initialJobs || [];
  const [filters, setFilters] = useState({ q: '', type: '', location: '' });
  const [page, setPage] = useState(1);

  function handleFilters(f: { q?: string; type?: string; location?: string }) {
    setFilters({ q: f.q || '', type: f.type || '', location: f.location || '' });
    setPage(1);
  }

  const filteredJobs = useMemo(() => {
    const q = (filters.q || '').trim().toLowerCase();
    return jobs.filter((job: any) => {
      // filter by type
      if (filters.type && String((job.type || '')).toLowerCase() !== String(filters.type).toLowerCase()) return false;
      // filter by location
      if (filters.location && !(String(job.location || '').toLowerCase().includes(String(filters.location).toLowerCase()))) return false;
      // search q on title, companyName/company_name, description
      if (q) {
        const title = String(job.title || '').toLowerCase();
        const company = String(job.companyName || job.company_name || job.company || '').toLowerCase();
        const desc = String((job as any).description || job.description || '').toLowerCase();
        if (!(title.includes(q) || company.includes(q) || desc.includes(q))) return false;
      }
      return true;
    });
  }, [jobs, filters]);

  const perPage = 10;
  const total = filteredJobs.length;
  const start = (page - 1) * perPage;
  const pageJobs = filteredJobs.slice(start, start + perPage);

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
      <aside className="hidden md:block">
        <div className="sticky top-20 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-2xl font-bold">Filtrer les offres</h3>
            <button className="text-sm text-[#2c3e6e]">Réinitialiser</button>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Mots-clés</label>
            <input placeholder="Développeur, Marketing, ..." className="w-full border px-3 py-2 rounded text-sm" onChange={(e) => handleFilters({ ...filters, q: e.target.value })} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Localisation</label>
            <div className="flex flex-col gap-2 text-sm">
              <label><input type="checkbox" className="mr-2" /> Télétravail</label>
              <label><input type="checkbox" className="mr-2" /> Paris</label>
              <label><input type="checkbox" className="mr-2" /> Lyon</label>
              <label><input type="checkbox" className="mr-2" /> Bordeaux</label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Type de contrat</label>
            <div className="flex flex-col gap-2 text-sm">
              <label><input type="checkbox" className="mr-2" /> CDI</label>
              <label><input type="checkbox" className="mr-2" /> CDD</label>
              <label><input type="checkbox" className="mr-2" /> Stage</label>
              <label><input type="checkbox" className="mr-2" /> Freelance</label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Salaire annuel (€)</label>
            <div className="flex gap-2">
              <input placeholder="Min" className="w-1/2 border px-3 py-2 rounded text-sm" />
              <input placeholder="Max" className="w-1/2 border px-3 py-2 rounded text-sm" />
            </div>
          </div>

          <button onClick={() => handleFilters(filters)} className="w-full bg-[#2c3e6e] text-white py-2 rounded">Appliquer les filtres</button>
        </div>
      </aside>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">{filteredJobs.length} résultat{filteredJobs.length > 1 ? 's' : ''}</h2>
            <p className="text-sm text-muted-foreground">Trouvez une opportunité qui vous correspond</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Trier :</label>
            <select aria-label="Trier les résultats" className="border px-2 py-1 rounded text-sm">
              <option value="recent">Les plus récents</option>
              <option value="old">Les plus anciens</option>
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
