'use client';

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { DashboardStats } from '@/lib/types';
import StatisticsCard from '@/components/admin/StatisticsCard';
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Clock,
  XCircle,
  AlertCircle,
  Wifi,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: adminApi.getDashboardStats,
    refetchInterval: 5 * 60 * 1000,
    retry: 1,
  });

  const { data: pendingCandidatures = [] } = useQuery({
    queryKey: ['admin-pending-candidatures'],
    queryFn: adminApi.getPendingCandidatures,
    staleTime: 60 * 1000,
  });

  const confirmMutation = useMutation({
    mutationFn: ({ profileId, status }: { profileId: string; status: 'ACCEPTED' | 'REJECTED' }) =>
      adminApi.confirmCandidature(profileId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-candidatures'] });
      queryClient.invalidateQueries({ queryKey: ['admin-candidates'] });
    },
  });

  const stats: DashboardStats | null = data ?? null;

  useEffect(() => {
    if (!error || !axios.isAxiosError(error)) return;
    const code = error.response?.status;
    if (code === 401 || code === 403) {
      router.replace('/admin/login');
    }
  }, [error, router]);

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-[rgb(249,153,28)]" />
          <p className="text-lg font-medium text-[rgb(18,51,119)]">
            Erreur de connexion au backend
          </p>
          <p className="mt-2 text-sm text-[rgb(18,51,119)]/70">
            {error instanceof Error ? error.message : 'Une erreur inconnue s&apos;est produite'}
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <DashboardLoading />;
  }

  const generatedLabel = stats.generatedAt
    ? new Date(stats.generatedAt).toLocaleString('fr-FR')
    : new Date().toLocaleString('fr-FR');

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-white to-[rgb(18,51,119)]/10 p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-[rgb(18,51,119)]">Dashboard</h1>
          <p className="text-[rgb(18,51,119)]/75">
            Vue d&apos;ensemble des statistiques de la plateforme
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-[rgb(18,51,119)]/20 bg-white px-4 py-2">
          <Wifi size={18} className="text-[rgb(249,153,28)]" />
          <span className="text-sm font-medium text-[rgb(18,51,119)]">
            Backend Connecte
          </span>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatisticsCard
          label="Utilisateurs Total"
          value={stats.totalUsers}
          icon={<Users size={24} />}
          color="blue"
        />
        <StatisticsCard
          label="Candidats"
          value={stats.totalCandidates}
          icon={<Users size={24} />}
          color="orange"
        />
        <StatisticsCard
          label="Offres d&apos;emploi"
          value={stats.totalJobs}
          icon={<Briefcase size={24} />}
          color="blue"
        />
        <StatisticsCard
          label="Offres Actives"
          value={stats.activeJobs}
          icon={<TrendingUp size={24} />}
          color="orange"
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatisticsCard
          label="Candidatures Total"
          value={stats.totalApplications}
          icon={<FileText size={24} />}
          color="orange"
        />
        <StatisticsCard
          label="Candidatures ce mois"
          value={stats.applicationsThisMonth}
          icon={<TrendingUp size={24} />}
          color="blue"
        />
        <StatisticsCard
          label="Offres ce mois"
          value={stats.jobsPostedThisMonth}
          icon={<Briefcase size={24} />}
          color="orange"
        />
        <StatisticsCard
          label="Moy. candidatures/offre"
          value={Math.round(stats.averageApplicationsPerJob)}
          icon={<TrendingUp size={24} />}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <StatisticsCard
          label="En Attente"
          value={stats.applicationsByStatus.PENDING}
          icon={<Clock size={24} />}
          color="orange"
        />
        <StatisticsCard
          label="En revue"
          value={stats.applicationsByStatus.REVIEWED}
          icon={<AlertCircle size={24} />}
          color="blue"
        />
        <StatisticsCard
          label="Refusees"
          value={stats.applicationsByStatus.REJECTED}
          icon={<XCircle size={24} />}
          color="orange"
        />
      </div>

      <div className="mt-8 rounded-lg border border-[rgb(18,51,119)]/20 bg-white p-6">
        <p className="text-sm text-[rgb(18,51,119)]/75">
          Les statistiques sont automatiquement mises a jour. Dernier rafraichissement: {generatedLabel}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-[rgb(18,51,119)]/20 bg-white p-5">
          <h3 className="mb-3 text-lg font-semibold text-[rgb(18,51,119)]">Confirmations candidats</h3>
          <p className="text-sm text-[rgb(18,51,119)]/80">
            En attente: {stats.candidateConfirmation?.pending ?? 0}
          </p>
          <p className="text-sm text-[rgb(18,51,119)]/80">
            Acceptes: {stats.candidateConfirmation?.accepted ?? 0}
          </p>
          <p className="text-sm text-[rgb(18,51,119)]/80">
            Rejetes: {stats.candidateConfirmation?.rejected ?? 0}
          </p>
        </div>

        <div className="rounded-lg border border-[rgb(18,51,119)]/20 bg-white p-5">
          <h3 className="mb-3 text-lg font-semibold text-[rgb(18,51,119)]">Repartition des offres</h3>
          <p className="text-sm text-[rgb(18,51,119)]/80">CDI: {stats.jobsByType?.CDI ?? 0}</p>
          <p className="text-sm text-[rgb(18,51,119)]/80">CDD: {stats.jobsByType?.CDD ?? 0}</p>
        </div>

        <div className="rounded-lg border border-[rgb(18,51,119)]/20 bg-white p-5">
          <h3 className="mb-3 text-lg font-semibold text-[rgb(18,51,119)]">Sources des offres</h3>
          <p className="text-sm text-[rgb(18,51,119)]/80">
            Internes: {stats.jobsBySource?.INTERNAL ?? 0}
          </p>
          <p className="text-sm text-[rgb(18,51,119)]/80">
            Externes: {stats.jobsBySource?.EXTERNAL ?? 0}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-[rgb(18,51,119)]/20 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-[rgb(18,51,119)]">
          Candidatures en attente de confirmation ({pendingCandidatures.length})
        </h2>

        {pendingCandidatures.length === 0 ? (
          <p className="text-sm text-[rgb(18,51,119)]/75">Aucune candidature en attente.</p>
        ) : (
          <div className="space-y-3">
            {pendingCandidatures.map((candidate) => (
              <div
                key={candidate.id}
                className="flex flex-col gap-3 rounded-lg border border-[rgb(18,51,119)]/20 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-[rgb(18,51,119)]">
                    {candidate.firstName} {candidate.lastName}
                  </p>
                  <p className="text-sm text-[rgb(18,51,119)]/80">{candidate.email}</p>
                  <p className="text-xs text-[rgb(18,51,119)]/70">
                    Competences: {(candidate.skills || []).join(', ') || 'N/A'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      confirmMutation.mutate({ profileId: candidate.id, status: 'ACCEPTED' })
                    }
                    className="rounded bg-[rgb(249,153,28)] px-3 py-2 text-sm font-medium text-white hover:bg-[rgb(249,153,28)]/90"
                    disabled={confirmMutation.isPending}
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() =>
                      confirmMutation.mutate({ profileId: candidate.id, status: 'REJECTED' })
                    }
                    className="rounded border border-[rgb(18,51,119)] bg-white px-3 py-2 text-sm font-medium text-[rgb(18,51,119)] hover:bg-[rgb(18,51,119)] hover:text-white"
                    disabled={confirmMutation.isPending}
                  >
                    Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-white to-[rgb(18,51,119)]/10 p-8">
      <div className="mb-8">
        <div className="mb-2 h-9 w-48 animate-pulse rounded-lg bg-[rgb(18,51,119)]/20" />
        <div className="h-5 w-96 animate-pulse rounded-lg bg-[rgb(18,51,119)]/20" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-[rgb(18,51,119)]/20" />
        ))}
      </div>

      <div className="h-20 animate-pulse rounded-lg bg-[rgb(18,51,119)]/20" />
    </div>
  );
}
