import React from 'react';
import JobListClient from '@/components/jobs/JobListClient';
import JobFilters from '@/components/jobs/JobFilters';
import mockJobs from '@/lib/mockJobs';

export default function JobsPage() {
  // server-rendered initial data from mock (no backend)
  const jobs = mockJobs;

  return (
    <main className="container mx-auto p-6">
      <div className="bg-[#2c3e6e] text-white rounded-lg p-8 mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Découvrez nos offres d'emploi</h1>
        <p className="text-sm opacity-90 mx-auto max-w-2xl">Trouvez l'opportunité qui correspond à vos compétences et aspirations professionnelles</p>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
        <JobFilters initial={{ q: '', type: '', location: '' }} />
      </div>

      <JobListClient initialJobs={jobs} />
    </main>
  );
}
