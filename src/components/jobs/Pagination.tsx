'use client';
import React from 'react';

export default function Pagination({ current, onChange, total, perPage = 10 }: { current: number; onChange: (page: number) => void; total?: number; perPage?: number }) {
  const max = total ? Math.max(1, Math.ceil(total / perPage)) : current + 1;
  const start = Math.max(1, current - 2);
  const end = Math.min(max, start + 4);
  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <nav className="flex items-center gap-3 mt-4 justify-center" aria-label="Pagination">
      <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current <= 1} className="w-10 h-10 border rounded bg-white shadow-sm disabled:opacity-50">‹</button>

      {pages[0] > 1 && (
        <button onClick={() => onChange(1)} className="w-10 h-10 border rounded bg-white shadow-sm">1</button>
      )}

      {pages.map((p) => (
        <button key={p} onClick={() => onChange(p)} className={`w-10 h-10 border rounded ${p === current ? 'bg-[#2c3e6e] text-white' : 'bg-white shadow-sm'}`} aria-current={p === current ? 'page' : undefined}>
          {p}
        </button>
      ))}

      {end < max && (
        <button onClick={() => onChange(max)} className="w-10 h-10 border rounded bg-white shadow-sm">{max}</button>
      )}

      <button onClick={() => onChange(Math.min(max, current + 1))} disabled={current >= max} className="w-10 h-10 border rounded bg-white shadow-sm disabled:opacity-50">›</button>
    </nav>
  );
}
