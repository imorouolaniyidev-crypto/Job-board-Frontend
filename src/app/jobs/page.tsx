import React from 'react';
import JobListClient from '@/components/jobs/JobListClient';
import JobFilters from '@/components/jobs/JobFilters';

export default function JobsPage() {
  return (
    <main className="container mx-auto p-6">
      <div className="mb-6 rounded-lg bg-[#2c3e6e] p-8 text-center text-white">
        <h1 className="mb-2 text-3xl font-bold">Decouvrez nos offres d&apos;emploi</h1>
        <p className="mx-auto max-w-2xl text-sm opacity-90">
          Trouvez l&apos;opportunite qui correspond a vos competences et aspirations professionnelles
        </p>
      </div>

      <div className="mb-6 rounded-lg bg-card p-6 shadow-sm">
        <JobFilters initial={{ q: '', type: '', location: '' }} />
      </div>

      <JobListClient />
    </main>
  );
}
