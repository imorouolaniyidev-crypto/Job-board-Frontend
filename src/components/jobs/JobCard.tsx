'use client';

import Link from 'next/link';
import React from 'react';
import { BriefcaseBusiness, Building2, CalendarDays, FileText, MapPin } from 'lucide-react';

type JobCardData = {
  id: string;
  title?: string;
  description?: string;
  location?: string;
  salary?: string;
  featured?: boolean;
  company?: string;
  company_name?: string;
  companyName?: string;
  company_logo?: string;
  companyLogo?: string;
  created_at?: string;
  createdAt?: string;
  created?: string;
  source?: string;
  applyUrl?: string;
  apply_url?: string;
  type?: string;
  jobType?: string;
};

export default function JobCard({ job }: { job: JobCardData }) {
  const companyName = job.company_name || job.companyName || job.company || '';
  const logo = job.company_logo || job.companyLogo || null;
  const createdAt = job.created_at || job.createdAt || job.created || null;
  const source = job.source || job.applyUrl || job.apply_url || null;
  const contractType = job.type || job.jobType || '';
  const description = getDescriptionText(job);
  const extraDetails = getAdditionalDetails(job);

  return (
    <article
      className={`relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        job.featured ? 'border-orange-200' : 'border-gray-100'
      }`}
    >
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center text-xl font-bold text-card-foreground">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={`${companyName} logo`} className="h-16 w-16 rounded-lg object-cover" />
          ) : (
            <div className="h-16 w-16 rounded-lg flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="4" fill="#E6F0FF" />
                <path d="M7 11H17" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 7H11" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 15H13" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col">
          <h3 className="mb-1 text-xl font-bold text-[#1e3a8a]">
            <Link href={`/jobs/${job.id}`} className="transition-colors hover:text-[#1d4ed8]">
              {job.title}
            </Link>
          </h3>

          <ul className="mb-6 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>
              <span className="inline-flex items-center gap-2">
                <Building2 size={16} className="text-slate-500" />
                <span>{companyName || 'Non disponible'}</span>
              </span>
            </li>
            <li>
              <span className="inline-flex items-start gap-2">
                <FileText size={16} className="mt-0.5 text-slate-500" />
                <span>
                  {description
                    ? `${stripHtml(description).slice(0, 240)}${stripHtml(description).length > 240 ? '...' : ''}`
                    : 'Description non disponible pour cette offre.'}
                </span>
              </span>
            </li>
            <li>
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} className="text-slate-500" />
                <span>{job.location || 'Non disponible'}</span>
              </span>
            </li>
            <li>
              <span className="inline-flex items-center gap-2">
                <BriefcaseBusiness size={16} className="text-slate-500" />
                <span>{contractType || 'Non disponible'}</span>
              </span>
            </li>
          </ul>

          {extraDetails.length > 0 ? (
            <ul className="mb-6 list-disc space-y-1 pl-5 text-sm text-gray-700">
              {extraDetails.map((detail) => (
                <li key={detail.label}>
                  <span className="font-semibold text-slate-800">{detail.label}:</span> {detail.value}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-auto border-t border-gray-100 pt-4">
            <div className="grid gap-3 sm:grid-cols-3 sm:items-center">
              <div />
              <div className="flex justify-center">
                {createdAt ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <CalendarDays size={16} className="text-slate-500" />
                    <span className="text-sm">Publie le {formatDate(createdAt)}</span>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Link
                  href={`/jobs/${job.id}`}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Voir detail
                </Link>

                {isValidUrl(source) ? (
                  <a
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-orange-500  px-5 text-sm font-semibold text-white transition-colors hover:bg-[#c2410c]"
                  >
                    Postuler
                  </a>
                ) : (
                  <button
                    disabled
                    className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-md  bg-orange-500 px-5 text-sm font-semibold text-white"
                  >
                    Postuler
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {job.featured ? (
        <div className="absolute right-3 top-3 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-semibold text-white">
          En vedette
        </div>
      ) : null}
    </article>
  );
}

function stripHtml(input: string) {
  if (!input) return '';
  return input.replace(/<[^>]*>/g, '');
}

function getDescriptionText(job: JobCardData): string {
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

function getAdditionalDetails(job: JobCardData): Array<{ label: string; value: string }> {
  const ignoredKeys = new Set([
    'id',
    'title',
    'description',
    'details',
    'summary',
    'content',
    'job_description',
    'jobDescription',
    'description_text',
    'company',
    'company_name',
    'companyName',
    'company_logo',
    'companyLogo',
    'created_at',
    'createdAt',
    'created',
    'source',
    'applyUrl',
    'apply_url',
    'location',
    'type',
    'jobType',
    'salary',
    'featured',
  ]);

  const details: Array<{ label: string; value: string }> = [];
  const record = job as Record<string, unknown>;

  for (const [key, value] of Object.entries(record)) {
    if (ignoredKeys.has(key) || value == null) continue;
    if (typeof value === 'string' && !value.trim()) continue;

    let formatted = '';
    if (Array.isArray(value)) {
      formatted = value.map((item) => String(item)).join(', ');
    } else if (typeof value === 'object') {
      formatted = JSON.stringify(value);
    } else {
      formatted = String(value);
    }

    if (!formatted.trim()) continue;
    details.push({
      label: key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2'),
      value: formatted,
    });
  }

  return details.slice(0, 8);
}

function isValidUrl(s: unknown) {
  if (!s || typeof s !== 'string') return false;
  return /^https?:\/\//i.test(s);
}

function formatDate(s: unknown) {
  try {
    const d = new Date(s);
    return d.toLocaleDateString('fr-FR');
  } catch {
    return String(s);
  }
}
