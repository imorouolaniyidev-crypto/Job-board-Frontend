'use client';

import { useState } from 'react';
import { Application, ApplicationStatus } from '@/lib/types';
import { mockApplications } from '@/lib/mockData';
import ApplicationCard from '@/components/applications/ApplicationCard';
import StatCard from '@/components/applications/StatCard';
import { Briefcase, Filter } from 'lucide-react';

export default function ProtectedApplicationsPage() {
  const [applications] = useState<Application[]>(mockApplications);
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | ApplicationStatus>('ALL');

  const statusOptions: Array<{
    value: 'ALL' | ApplicationStatus;
    label: string;
    color: 'blue' | 'gray' | 'yellow' | 'red';
  }> = [
    { value: 'ALL', label: 'Tous', color: 'gray' },
    { value: 'PENDING', label: 'En attente', color: 'yellow' },
    { value: 'REVIEWED', label: 'En revue', color: 'blue' },
    { value: 'REJECTED', label: 'Refusees', color: 'red' },
  ];

  const filteredApplications =
    selectedStatus === 'ALL'
      ? applications
      : applications.filter((app) => app.status === selectedStatus);

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'PENDING').length,
    reviewed: applications.filter((a) => a.status === 'REVIEWED').length,
    rejected: applications.filter((a) => a.status === 'REJECTED').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-6 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Candidatures</h1>
              <p className="text-gray-600 mt-1">Suivi de toutes vos candidatures</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 px-4">
        <div className="container mx-auto max-w-5xl space-y-8">
          {applications.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total" value={stats.total} color="gray" />
                <StatCard label="En attente" value={stats.pending} color="yellow" />
                <StatCard label="En revue" value={stats.reviewed} color="blue" />
                <StatCard label="Refusees" value={stats.rejected} color="red" />
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtrer par statut
            </h2>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedStatus === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedStatus === 'ALL'
                ? 'Toutes les candidatures'
                : `Candidatures ${statusOptions
                    .find((s) => s.value === selectedStatus)
                    ?.label.toLocaleLowerCase()}`}{' '}
              ({filteredApplications.length})
            </h2>

            {filteredApplications.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucune candidature
                </h3>
                <p className="text-gray-600">
                  Vous n&apos;avez pas de candidature avec ce statut.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
