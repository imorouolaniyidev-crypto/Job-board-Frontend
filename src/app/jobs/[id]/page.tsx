import React from 'react';
import { Metadata } from 'next';
import mockJobs from '@/lib/mockJobs';

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const j = mockJobs.find((x) => x.id === params.id);
  return {
    title: j ? `${j.title} — ${j.company_name}` : 'Offre',
    description: j ? j.title : undefined,
  };
}

export default function JobDetail({ params }: { params: { id: string } }) {
  const job = mockJobs.find((j) => j.id === params.id);
  if (!job) return <div className="container mx-auto p-6">Offre introuvable</div>;
  return (
    <main className="container mx-auto p-6">
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
        <div className="text-sm text-muted-foreground mb-4">{job.company_name} • {job.location} • {job.type}</div>
        <div className="prose">{job.description || 'Description non disponible pour la maquette.'}</div>
      </div>
    </main>
  );
}
