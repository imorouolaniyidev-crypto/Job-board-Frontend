'use client';
import Link from 'next/link';
import React from 'react';

export default function JobCard({ job }: { job: any }) {
  const companyName = job.company_name || job.companyName || job.company || '';
  const logo = job.company_logo || job.companyLogo || null;
  const createdAt = job.created_at || job.createdAt || job.created || null;
  const source = job.source || job.applyUrl || job.apply_url || null;

  return (
    <article className={`relative flex flex-col md:flex-row gap-6 p-6 bg-white shadow-sm overflow-hidden ${job.featured}`}>
      {/* Logo */}
      <div className="flex-shrink-0 w-16 h-16 rounded-md bg-muted flex items-center justify-center text-xl font-bold text-card-foreground">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={`${companyName} logo`} className="w-16 h-16 object-cover rounded-md" />
        ) : (
          <div className="w-16 h-16 rounded-md flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="4" fill="#E6F0FF" />
              <path d="M7 11H17" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 7H11" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 15H13" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="flex-1">
        {/* Titre du job - resté inchangé */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          <Link href={`/jobs/${job.id}`}>{job.title}</Link>
        </h3>

        {/* Liste des informations avec icônes */}
        <ul className="space-y-3 mb-6">
          {/* Entreprise */}
          {companyName && (
            <li className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <span className="text-sm">{companyName}</span>
            </li>
          )}

          {/* Localisation */}
          {job.location && (
            <li className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span className="text-sm">{job.location}</span>
            </li>
          )}

          {/* Type de contrat */}
          {job.type && (
            <li className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm">{job.type}</span>
            </li>
          )}

          {/* Salaire */}
          {job.salary && (
            <li className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm font-medium text-orange-600">{job.salary}</span>
            </li>
          )}

          {/* Date de publication */}
          {createdAt && (
            <li className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="text-sm">{formatDate(createdAt)}</span>
            </li>
          )}
        </ul>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {job.tags.map((t: string) => (
              <span key={t} className="px-3 py-1 bg-[#bed8f7] text-[#4a90e2] rounded-full text-sm">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Description réduite */}
        {job.description && (
          <p className="mb-6 text-sm text-gray-600 line-clamp-3">
            {stripHtml(job.description).slice(0, 240)}
            {job.description && stripHtml(job.description).length > 240 ? '…' : ''}
          </p>
        )}

        {/* Boutons centrés en bas */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gray-100">
          <Link 
            href={`/jobs/${job.id}`} 
            className="px-6 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Voir les détails
          </Link>
          
          {isValidUrl(source) ? (
            <a 
              href={source} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-6 py-2 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Postuler maintenant
            </a>
          ) : (
            <button 
              disabled 
              className="px-6 py-2 text-sm bg-orange-500 text-white rounded-md cursor-not-allowed"
            >
              Postuler
            </button>
          )}
        </div>
      </div>

      {/* Badge "En vedette" */}
      {job.featured ? (
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-4 bg-orange-500 text-white text-xs px-3 py-1 rounded rotate-12">
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