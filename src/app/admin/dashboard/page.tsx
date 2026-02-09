'use client';

import { useEffect, useState } from 'react';
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
  CheckCircle,
  XCircle,
  AlertCircle,
  Wifi,
  WifiOff,
} from 'lucide-react';

// Mode de test - change à false pour utiliser le vrai backend
const USE_MOCK_DATA = true;

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [mockMode, setMockMode] = useState(USE_MOCK_DATA);

  // Fetch stats avec fallback sur les mocks
  const queryFn = mockMode
    ? () => Promise.resolve(mockDashboardStats)
    : () => adminApi.getDashboardStats();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard-stats', mockMode],
    queryFn,
    refetchInterval: 5 * 60 * 1000,
    retry: mockMode ? false : 1,
  });

  useEffect(() => {
    if (data) {
      setStats(data);
    }
  }, [data]);

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
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {error instanceof Error ? error.message : 'Une erreur inconnue s\'est produite'}
          </p>
          <button
            onClick={() => setMockMode(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-8">
      {/* Header avec Mode Toggle */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vue d'ensemble des statistiques de la plateforme
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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
                Backend Connecté
              </span>
            </>
          )}
          <button
            onClick={() => setMockMode(!mockMode)}
            className="ml-2 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Basculer
          </button>
        </div>
      </div>

      {/* Statistics Grid - Row 1 */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          label="Offres d'emploi"
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

      {/* Statistics Grid - Row 2 */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Applications by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <StatisticsCard
          label="En Attente"
          value={stats.applicationsByStatus.PENDING}
          icon={<Clock size={24} />}
          color="orange"
        />
        <StatisticsCard
          label="En Cours"
          value={stats.applicationsByStatus.IN_PROGRESS}
          icon={<AlertCircle size={24} />}
          color="blue"
        />
        <StatisticsCard
          label="Acceptées"
          value={stats.applicationsByStatus.ACCEPTED}
          icon={<CheckCircle size={24} />}
          color="green"
        />
        <StatisticsCard
          label="Refusées"
          value={stats.applicationsByStatus.REJECTED}
          icon={<XCircle size={24} />}
          color="red"
        />
      </div>

      {/* Additional Info */}
      <div className="mt-8 p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ℹ️ Les statistiques sont automatiquement mises à jour. Dernier rafraîchissement : juste à l'instant
        </p>
      </div>
    </div>
  );
}

// Loading Skeleton
function DashboardLoading() {
  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 animate-pulse" />
        <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Bottom Skeleton */}
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
    </div>
  );
}
