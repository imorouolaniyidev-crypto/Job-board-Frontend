'use client';
import Link from 'next/link';
import React from 'react';

export default function JobCard({ job }: { job: any }) {
  const companyName = job.company_name || job.companyName || job.companyName || job.company || '';
  const logo = job.company_logo || job.companyLogo || null;
  const createdAt = job.created_at || job.createdAt || job.createdAt || job.created || null;
  const source = job.source || job.applyUrl || job.apply_url || null;

  return (
    <article className={`relative flex gap-4 p-6 border rounded-lg bg-white shadow-sm overflow-hidden ${job.featured ? 'border-l-8 border-orange-500' : 'border-l-8 border-blue-500'}`}>
      <div className="flex-shrink-0 w-16 h-16 rounded-md bg-muted flex items-center justify-center text-xl font-bold text-card-foreground">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={`${companyName} logo`} className="w-16 h-16 object-cover rounded-md" />
        ) : (
          <div className="w-16 h-16 rounded-md bg-[#2c3e6e] bg-opacity-10 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="4" fill="#E6F0FF" />
              <path d="M7 11H17" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 7H11" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 15H13" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold leading-tight"><Link href={`/jobs/${job.id}`}>{job.title}</Link></h3>
            <div className="text-sm text-muted-foreground">{companyName} • {job.location}</div>
          </div>
          <div className="text-right flex flex-col items-end gap-3">
            <span className="text-sm px-2 py-1 rounded bg-muted text-muted-foreground">{job.type}</span>
            <div className="flex flex-col items-end gap-2">
              <Link href={`/jobs/${job.id}`} className="text-sm text-primary">Voir</Link>
              {job.salary ? (
                <div className="flex items-center gap-20">
                  <div className="text-orange-500 font-semibold text-lg">{job.salary}</div>
                  {isValidUrl(source) ? (
                    <a href={source} target="_blank" rel="noopener noreferrer" className="inline-block text-sm bg-orange-500 text-white px-3 py-1 rounded hover:opacity-90">Postuler</a>
                  ) : (
                    <button disabled className="inline-block text-sm bg-orange-500 text-white px-3 py-1 rounded">Postuler</button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
<div className="mt-4 flex items-center justify-between">

        {job.description ? (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{stripHtml(job.description).slice(0, 240)}{job.description && job.description.length > 240 ? '…' : ''}</p>
        ) : null}
</div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            {job.tags?.map((t: string) => (
              <span key={t} className="px-3 py-1 bg-[#bed8f7] text-[#4a90e2] rounded-full text-sm">{t}</span>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">{createdAt ? formatDate(createdAt) : ''}</div>
        </div>



      </div>
      {job.featured ? (
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-4 bg-orange-500 text-white text-xs px-3 py-1 rounded rotate-12">En vedette</div>
      ) : null}
    </article>
  );
}

function stripHtml(input: string) {
  if (!input) return '';
  return input.replace(/<[^>]*>/g, '');
}

function isValidUrl(s: any) {
  if (!s || typeof s !== 'string') return false;
  return /^https?:\/\//i.test(s);
}

function formatDate(s: any) {
  try {
    const d = new Date(s);
    return d.toLocaleDateString();
  } catch (e) {
    return String(s);
  }
}
