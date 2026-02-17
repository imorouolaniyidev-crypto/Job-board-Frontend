import React from 'react';
import { Metadata } from 'next';
import { jobsApi } from '@/lib/api';
import { Job } from '@/lib/types';

type PublicJob = Job & {
  type?: string;
  company_name?: string;
  companyName?: string;
};

function getCompanyName(job: PublicJob) {
  return job.company_name || job.companyName || job.company || '';
}

function getJobType(job: PublicJob) {
  return job.type || job.jobType || '';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = (await jobsApi.getJob(id)) as PublicJob | null;
  return {
    title: job ? `${job.title} - ${getCompanyName(job)}` : 'Offre',
    description: job ? job.title : undefined,
  };
}

export default async function JobDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = (await jobsApi.getJob(id)) as PublicJob | null;

  if (!job) {
    return <div className="container mx-auto p-6">Offre introuvable</div>;
  }

  return (
    <main className="container mx-auto px-4 py-6 sm:px-6">
      <div className="rounded-lg bg-card p-4 shadow-sm sm:p-6">
        <h1 className="mb-2 text-xl font-bold sm:text-2xl">{job.title}</h1>
        <div className="text-sm text-muted-foreground mb-4">
          {getCompanyName(job)} - {job.location} - {getJobType(job)}
        </div>
        <div className="prose">{job.description || 'Description non disponible.'}</div>
      </div>
    </main>
  );
}
