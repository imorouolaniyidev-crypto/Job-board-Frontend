'use client';

import { useState } from 'react';
import { Job } from '@/lib/types';
import mockJobs from '@/lib/mockJobs';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import JobForm from '@/components/admin/JobForm';
import DeleteJobModal from '@/components/admin/DeleteJobModal';

type JobModalState = { type: 'create' } | { type: 'edit'; job: Job } | null;

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [jobModal, setJobModal] = useState<JobModalState>(null);
  const [deleteModal, setDeleteModal] = useState<Job | null>(null);
  const [filter, setFilter] = useState<'ALL' | boolean>('ALL');

  const filteredJobs = filter === 'ALL' ? jobs : jobs.filter((job) => job.is_active === filter);

  const handleSaveJob = (formData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (jobModal?.type === 'create') {
      const newJob: Job = {
        ...formData,
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setJobs([newJob, ...jobs]);
    } else if (jobModal?.type === 'edit') {
      const updatedJobs = jobs.map((job) =>
        job.id === jobModal.job.id
          ? {
              ...job,
              ...formData,
              updatedAt: new Date().toISOString(),
            }
          : job
      );
      setJobs(updatedJobs);
    }
    setJobModal(null);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(jobs.filter((job) => job.id !== jobId));
    setDeleteModal(null);
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-8 dark:from-gray-900 dark:to-black">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Offres d&apos;emploi</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerez toutes vos offres d&apos;emploi</p>
        </div>

        <button
          onClick={() => setJobModal({ type: 'create' })}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <Plus size={20} />
          Creer une offre
        </button>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status === 'ALL' ? 'ALL' : status === 'ACTIVE')}
            className={`whitespace-nowrap rounded-lg px-4 py-2 transition-colors ${
              (status === 'ALL' && filter === 'ALL') ||
              (status === 'ACTIVE' && filter === true) ||
              (status === 'INACTIVE' && filter === false)
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {status === 'ALL' ? 'Toutes' : status === 'ACTIVE' ? 'Actives' : 'Inactives'}{' '}
            <span className="text-xs">
              (
              {
                jobs.filter(
                  (j) => status === 'ALL' || (status === 'ACTIVE' ? j.is_active : !j.is_active)
                ).length
              }
              )
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Titre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Entreprise
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Source</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Creee</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Aucune offre trouvee
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{job.title}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{job.company_name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {getTypeLabel(job.type)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {getSourceLabel(job.source)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                          job.is_active
                        )}`}
                      >
                        {job.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(job.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setJobModal({ type: 'edit', job })}
                          className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900"
                          title="Editer"
                        >
                          <Edit2 size={18} />
                        </button>
                        {job.source === 'EXTERNAL' && job.source_url ? (
                          <a
                            href={job.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50 dark:hover:bg-green-900"
                            title="Voir l&apos;offre externe"
                          >
                            <Eye size={18} />
                          </a>
                        ) : null}
                        <button
                          onClick={() => setDeleteModal(job)}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.length}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Actifs</p>
          <p className="text-2xl font-bold text-green-600">{jobs.filter((j) => j.is_active).length}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Inactifs</p>
          <p className="text-2xl font-bold text-red-600">{jobs.filter((j) => !j.is_active).length}</p>
        </div>
      </div>

      {jobModal ? (
        <JobForm
          job={jobModal.type === 'edit' ? jobModal.job : undefined}
          onSave={handleSaveJob}
          onCancel={() => setJobModal(null)}
        />
      ) : null}

      {deleteModal ? (
        <DeleteJobModal
          job={deleteModal}
          onConfirm={() => handleDeleteJob(deleteModal.id)}
          onCancel={() => setDeleteModal(null)}
        />
      ) : null}
    </div>
  );
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    CDI: 'CDI',
    CDD: 'CDD',
  };
  return labels[type] || type;
}

function getSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    INTERNAL: 'Interne',
    EXTERNAL: 'Externe',
  };
  return labels[source] || source;
}

function getStatusColor(isActive: boolean): string {
  return isActive
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
}
