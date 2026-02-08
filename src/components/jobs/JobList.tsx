'use client';
import React from 'react';
import JobCard from '@/components/jobs/JobCard';

export default function JobList({ jobs }: { jobs: any[] }) {
  if (!jobs || jobs.length === 0) return <div>Aucun résultat</div>;
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
