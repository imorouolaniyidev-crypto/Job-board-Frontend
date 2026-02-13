'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { mockDashboardStats } from '@/lib/mockStats';
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
  WifiOff,
} from 'lucide-react';

const USE_MOCK_DATA = true;

export default function DashboardPage() {
  const [mockMode, setMockMode] = useState(USE_MOCK_DATA);

  const queryFn = mockMode
    ? () => Promise.resolve(mockDashboardStats)
    : () => adminApi.getDashboardStats();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard-stats', mockMode],
    queryFn,
    refetchInterval: 5 * 60 * 1000,
    retry: mockMode ? false : 1,
  });

  const stats: DashboardStats | null = data ?? null;

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (error && !mockMode) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            Erreur de connexion au backend
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {error instanceof Error ? error.message : 'Une erreur inconnue s&apos;est produite'}
          </p>
          <button
            onClick={() => setMockMode(true)}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Passer au mode test
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <DashboardLoading />;
  }

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-8 dark:from-gray-900 dark:to-black">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vue d&apos;ensemble des statistiques de la plateforme
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
          {mockMode ? (
            <>
              <WifiOff size={18} className="text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Mode Test (Mock Data)
              </span>
            </>
          ) : (
            <>
              <Wifi size={18} className="text-green-500" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Backend Connecte
              </span>
            </>
          )}
          <button
            onClick={() => setMockMode(!mockMode)}
            className="ml-2 rounded bg-gray-200 px-3 py-1 text-xs transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Basculer
          </button>
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
          color="green"
        />
        <StatisticsCard
          label="Offres d&apos;emploi"
          value={stats.totalJobs}
          icon={<Briefcase size={24} />}
          color="purple"
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
          color="cyan"
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
          color="green"
        />
        <StatisticsCard
          label="Moy. candidatures/offre"
          value={Math.round(stats.averageApplicationsPerJob)}
          icon={<TrendingUp size={24} />}
          color="purple"
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
          color="red"
        />
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Les statistiques sont automatiquement mises a jour. Dernier rafraichissement: juste a
          l&apos;instant
        </p>
      </div>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-8 dark:from-gray-900 dark:to-black">
      <div className="mb-8">
        <div className="mb-2 h-9 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-5 w-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>

      <div className="h-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}
