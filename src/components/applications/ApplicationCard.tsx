'use client';

import { Application, ApplicationStatus } from '@/lib/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Building2 } from 'lucide-react';

interface ApplicationCardProps {
  application: Application;
}

const statusConfig: Record<
  ApplicationStatus,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  PENDING: {
    label: 'En attente',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  REVIEWED: {
    label: 'En revue',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  REJECTED: {
    label: 'Refusee',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
};

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const status = statusConfig[application.status];
  const applicationDate = new Date(application.applied_at);

  const getStatusIcon = (value: ApplicationStatus) => {
    switch (value) {
      case 'REJECTED':
        return '×';
      case 'REVIEWED':
        return '⟳';
      case 'PENDING':
        return '○';
      default:
        return '○';
    }
  };

  return (
    <div
      className={`border rounded-lg p-6 transition-shadow hover:shadow-md ${status.bgColor} ${status.borderColor} border`}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-lg ${status.bgColor} flex items-center justify-center text-lg ${status.color}`}
            >
              {getStatusIcon(application.status)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{application.job_title}</h3>

              <div className="mt-1 flex items-center gap-2 text-gray-600">
                <Building2 className="h-4 w-4" />
                <span className="text-sm break-words">{application.company_name}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {format(applicationDate, 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${status.bgColor} ${status.color}`}
          >
            {status.label}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 border-opacity-50">
        <p className="text-xs text-gray-600">
          Derniere mise a jour:{' '}
          {format(new Date(application.updated_at), 'dd MMM yyyy HH:mm', {
            locale: fr,
          })}
        </p>
      </div>
    </div>
  );
}
