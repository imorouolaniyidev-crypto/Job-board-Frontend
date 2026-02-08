'use client';

import { useAuthStore } from '@/lib/store';
import { applicationsApi } from '@/lib/api';
import { Application, ApplicationStatus } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Briefcase, Calendar, Building2 } from 'lucide-react';

// Status badge configuration
const statusConfig: Record<ApplicationStatus, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: 'En attente', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  IN_PROGRESS: { label: 'En cours', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  ACCEPTED: { label: 'Acceptée', color: 'text-green-700', bgColor: 'bg-green-100' },
  REJECTED: { label: 'Refusée', color: 'text-red-700', bgColor: 'bg-red-100' },
};

export default function ApplicationsPage() {
  const user = useAuthStore((state) => state.user);

  // Fetch applications
  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: () =>
      user?.id ? applicationsApi.getApplications(user.id) : Promise.reject('No user ID'),
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement de vos candidatures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">
              Erreur lors du chargement des candidatures. Veuillez réessayer.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Candidatures</h1>
          <p className="text-gray-600 mt-2">
            Suivi de tous vos emplois en cours de candidature
          </p>
        </div>

        {/* Empty State */}
        {applications.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucune candidature
                </h3>
                <p className="text-gray-600 mb-6">
                  Vous n'avez pas encore soumis de candidatures. Explorez les offres d'emploi
                  disponibles et commencez à postuler !
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Applications List
          <div className="grid gap-4">
            {applications.map((application) => {
              const status = statusConfig[application.status];
              const applicationDate = new Date(application.applicationDate);

              return (
                <Card
                  key={application.id}
                  className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500"
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Job Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {application.jobTitle}
                        </h3>
                        <div className="space-y-2">
                          {/* Company */}
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building2 className="h-4 w-4" />
                            <span className="text-sm">{application.companyName}</span>
                          </div>
                          {/* Application Date */}
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">
                              {format(applicationDate, 'dd MMMM yyyy', { locale: fr })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center">
                        <Badge
                          className={`text-base font-semibold px-4 py-2 ${status.bgColor} ${status.color} border-0`}
                        >
                          {status.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Status indicator line */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            application.status === 'ACCEPTED'
                              ? 'bg-green-500'
                              : application.status === 'REJECTED'
                                ? 'bg-red-500'
                                : application.status === 'IN_PROGRESS'
                                  ? 'bg-blue-500'
                                  : 'bg-yellow-500'
                          }`}
                        ></div>
                        <span className="text-xs text-gray-600 font-medium">
                          {application.status === 'ACCEPTED' && 'Vous avez été accepté(e) !'}
                          {application.status === 'REJECTED' &&
                            'Votre candidature a été refusée.'}
                          {application.status === 'IN_PROGRESS' &&
                            'Votre candidature est en cours d\'examen.'}
                          {application.status === 'PENDING' &&
                            'Votre candidature est en attente de traitement.'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Stats */}
        {applications.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {applications.length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">
                    {applications.filter((a) => a.status === 'PENDING').length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">En attente</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {applications.filter((a) => a.status === 'IN_PROGRESS').length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">En cours</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {applications.filter((a) => a.status === 'ACCEPTED').length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Acceptées</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
