'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, X } from 'lucide-react';
import type { Candidate } from '@/lib/types';

interface DeleteCandidateModalProps {
  candidate: Candidate;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteCandidateModal({
  candidate,
  onConfirm,
  onCancel,
}: DeleteCandidateModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    setTimeout(() => {
      onConfirm();
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-lg font-bold text-red-900 dark:text-red-100">
              Supprimer le candidat
            </h2>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-2">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Nom</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {candidate.firstName} {candidate.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {candidate.email}
              </p>
            </div>
            {candidate.applicationsCount && candidate.applicationsCount > 0 && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Candidatures</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {candidate.applicationsCount} candidature{candidate.applicationsCount > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-200">
              ⚠️ Cette action est <strong>irréversible</strong>. Toutes les données du candidat seront
              définitivement supprimées.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? '⏳ Suppression...' : 'Supprimer définitivement'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
