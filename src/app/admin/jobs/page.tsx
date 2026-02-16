'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Job } from '@/lib/types';
import JobForm from '@/components/admin/JobForm';
import DeleteJobModal from '@/components/admin/DeleteJobModal';

type JobModalState = { type: 'create' } | { type: 'edit'; job: Job } | null;

export default function JobsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [jobModal, setJobModal] = useState<JobModalState>(null);
  const [deleteModal, setDeleteModal] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'CDI' | 'CDD'>('ALL');
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'INTERNAL' | 'EXTERNAL'>('ALL');

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-jobs', searchTerm, statusFilter, typeFilter, sourceFilter],
    queryFn: () =>
      adminApi.getJobs({
        search: searchTerm,
        status: statusFilter,
        type: typeFilter,
        source: sourceFilter,
      }),
    staleTime: 60 * 1000,
  });

  const jobs = data?.data ?? [];

  const createMutation = useMutation({
    mutationFn: (payload: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => adminApi.createJob(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-jobs'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Job> }) => adminApi.updateJob(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-jobs'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (jobId: string) => adminApi.deleteJob(jobId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-jobs'] }),
  });

  useEffect(() => {
    if (!error || !axios.isAxiosError(error)) return;
    const code = error.response?.status;
    if (code === 401 || code === 403) {
      router.replace('/admin/login');
    }
  }, [error, router]);

  const handleSaveJob = async (formData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (jobModal?.type === 'create') {
      await createMutation.mutateAsync(formData);
    } else if (jobModal?.type === 'edit') {
      await updateMutation.mutateAsync({ id: jobModal.job.id, payload: formData });
    }
    setJobModal(null);
  };

  const handleDeleteJob = async (jobId: string) => {
    await deleteMutation.mutateAsync(jobId);
    setDeleteModal(null);
  };

  if (isLoading) {
    return <div className="p-8 text-[rgb(18,51,119)]/75">Chargement des offres...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-[rgb(249,153,28)]">
        {error instanceof Error ? error.message : 'Impossible de charger les offres.'}
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-white to-[rgb(18,51,119)]/10 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-[rgb(18,51,119)]">Offres d&apos;emploi</h1>
          <p className="text-[rgb(18,51,119)]/75">Gerez toutes vos offres d&apos;emploi</p>
        </div>

        <button
          onClick={() => setJobModal({ type: 'create' })}
          className="flex items-center gap-2 rounded-lg bg-[rgb(249,153,28)] px-4 py-2 text-white transition-colors hover:bg-[rgb(249,153,28)]/90"
        >
          <Plus size={20} />
          Creer une offre
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Rechercher: titre, entreprise, lieu..."
          className="rounded-lg border border-[rgb(18,51,119)]/25 px-3 py-2 text-sm text-[rgb(18,51,119)] focus:border-[rgb(18,51,119)] focus:outline-none"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
          className="rounded-lg border border-[rgb(18,51,119)]/25 bg-white px-3 py-2 text-sm text-[rgb(18,51,119)] focus:border-[rgb(18,51,119)] focus:outline-none"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="ACTIVE">Actives</option>
          <option value="INACTIVE">Inactives</option>
        </select>

        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value as typeof typeFilter)}
          className="rounded-lg border border-[rgb(18,51,119)]/25 bg-white px-3 py-2 text-sm text-[rgb(18,51,119)] focus:border-[rgb(18,51,119)] focus:outline-none"
        >
          <option value="ALL">Tous les types</option>
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
        </select>

        <select
          value={sourceFilter}
          onChange={(event) => setSourceFilter(event.target.value as typeof sourceFilter)}
          className="rounded-lg border border-[rgb(18,51,119)]/25 bg-white px-3 py-2 text-sm text-[rgb(18,51,119)] focus:border-[rgb(18,51,119)] focus:outline-none"
        >
          <option value="ALL">Toutes les sources</option>
          <option value="INTERNAL">Interne</option>
          <option value="EXTERNAL">Externe</option>
        </select>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 transition-colors ${
              statusFilter === status
                ? 'bg-[rgb(18,51,119)] text-white'
                : 'bg-white text-[rgb(18,51,119)] hover:bg-[rgb(18,51,119)]/10'
            }`}
          >
            {status === 'ALL' ? 'Toutes' : status === 'ACTIVE' ? 'Actives' : 'Inactives'}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-[rgb(18,51,119)]/20 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgb(18,51,119)]/20 bg-[rgb(18,51,119)]/8">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(18,51,119)]">Titre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(18,51,119)]">Entreprise</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(18,51,119)]">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(18,51,119)]">Source</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(18,51,119)]">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[rgb(18,51,119)]">Creee</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-[rgb(18,51,119)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[rgb(18,51,119)]/70">
                    Aucune offre trouvee
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-[rgb(18,51,119)]/15 transition-colors hover:bg-[rgb(18,51,119)]/5"
                  >
                    <td className="px-6 py-4 font-medium text-[rgb(18,51,119)]">{job.title}</td>
                    <td className="px-6 py-4 text-sm text-[rgb(18,51,119)]/80">{job.company_name}</td>
                    <td className="px-6 py-4 text-sm text-[rgb(18,51,119)]">{job.type}</td>
                    <td className="px-6 py-4 text-sm text-[rgb(18,51,119)]/80">{job.source}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                          job.is_active
                            ? 'bg-[rgb(249,153,28)]/20 text-[rgb(249,153,28)]'
                            : 'bg-[rgb(18,51,119)]/15 text-[rgb(18,51,119)]'
                        }`}
                      >
                        {job.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[rgb(18,51,119)]/80">
                      {new Date(job.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setJobModal({ type: 'edit', job })}
                          className="rounded-lg p-2 text-[rgb(18,51,119)] transition-colors hover:bg-[rgb(18,51,119)]/10"
                          title="Editer"
                        >
                          <Edit2 size={18} />
                        </button>
                        {job.source === 'EXTERNAL' && job.source_url ? (
                          <a
                            href={job.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-2 text-[rgb(249,153,28)] transition-colors hover:bg-[rgb(249,153,28)]/20"
                            title="Voir l'offre externe"
                          >
                            <Eye size={18} />
                          </a>
                        ) : null}
                        <button
                          onClick={() => setDeleteModal(job)}
                          className="rounded-lg p-2 text-[rgb(18,51,119)] transition-colors hover:bg-[rgb(18,51,119)]/10"
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
