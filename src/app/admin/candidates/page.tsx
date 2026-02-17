'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Users, CheckCircle, XCircle } from 'lucide-react';
import { adminApi } from '@/lib/api';
import type { Candidate, CandidateStatus } from '@/lib/types';

export default function CandidatesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<CandidateStatus | 'ALL'>('ALL');
  const [updatingContractId, setUpdatingContractId] = useState<string | null>(null);
  const [contractError, setContractError] = useState<string | null>(null);

  const { data: candidates = [], isLoading, error } = useQuery({
    queryKey: ['admin-candidates'],
    queryFn: adminApi.getCandidates,
    staleTime: 60 * 1000,
  });

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || candidate.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchTerm, filterStatus]);

  const statusCounts = {
    ACTIVE: candidates.filter((c) => c.status === 'ACTIVE').length,
    REVIEWING: candidates.filter((c) => c.status === 'REVIEWING').length,
    REJECTED: candidates.filter((c) => c.status === 'REJECTED').length,
  };

  const handleToggleContractStatus = async (candidateId: string, currentStatus: boolean) => {
    try {
      setUpdatingContractId(candidateId);
      setContractError(null);
      await adminApi.updateCandidateContractStatus(candidateId, !currentStatus);
      // Invalidate and refetch candidates
      await queryClient.invalidateQueries({ queryKey: ['admin-candidates'] });
    } catch (err) {
      setContractError(
        err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut de contrat'
      );
      console.error('Contract status update error:', err);
    } finally {
      setUpdatingContractId(null);
    }
  };

  useEffect(() => {
    if (!error || !axios.isAxiosError(error)) return;
    const code = error.response?.status;
    if (code === 401 || code === 403) {
      router.replace('/admin/login');
    }
  }, [error, router]);

  if (isLoading) {
    return <div className="p-4 text-[rgb(18,51,119)]/75 sm:p-6 lg:p-8">Chargement des candidats...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-[rgb(249,153,28)] sm:p-6 lg:p-8">
        {error instanceof Error ? error.message : 'Impossible de charger les candidats.'}
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-white to-[rgb(18,51,119)]/10 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-[rgb(18,51,119)]/10 p-2">
          <Users className="h-6 w-6 text-[rgb(18,51,119)]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[rgb(18,51,119)]">Gestion des Candidats</h1>
          <p className="text-sm text-[rgb(18,51,119)]/75">{candidates.length} candidat(s)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-[rgb(18,51,119)] p-4">
          <p className="text-sm text-[rgb(18,51,119)]/75">Actifs</p>
          <p className="text-2xl font-bold text-[rgb(18,51,119)]">{statusCounts.ACTIVE}</p>
        </Card>
        <Card className="border-l-4 border-l-[rgb(249,153,28)] p-4">
          <p className="text-sm text-[rgb(18,51,119)]/75">En revision</p>
          <p className="text-2xl font-bold text-[rgb(249,153,28)]">{statusCounts.REVIEWING}</p>
        </Card>
        <Card className="border-l-4 border-l-[rgb(18,51,119)] p-4">
          <p className="text-sm text-[rgb(18,51,119)]/75">Rejetes</p>
          <p className="text-2xl font-bold text-[rgb(18,51,119)]">{statusCounts.REJECTED}</p>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['ALL', 'ACTIVE', 'REVIEWING', 'REJECTED'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-lg px-3 py-2 text-sm ${
              filterStatus === status
                ? 'bg-[rgb(18,51,119)] text-white'
                : 'border border-[rgb(18,51,119)]/25 text-[rgb(18,51,119)]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <Input
        placeholder="Rechercher par nom, email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-sm"
      />

      {contractError && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {contractError}
        </div>
      )}

      <Card className="overflow-x-auto border-[rgb(18,51,119)]/20">
        <table className="w-full">
          <thead className="border-b border-[rgb(18,51,119)]/20 bg-[rgb(18,51,119)]/8">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[rgb(18,51,119)]">Nom</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[rgb(18,51,119)]">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[rgb(18,51,119)]">Competences</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[rgb(18,51,119)]">Statut</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[rgb(18,51,119)]">Confirmation</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[rgb(18,51,119)]">Contrat</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[rgb(18,51,119)]">Candidatures</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgb(18,51,119)]/15">
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-[rgb(18,51,119)]/5">
                <td className="px-4 py-3 text-sm">
                  {candidate.firstName} {candidate.lastName}
                </td>
                <td className="px-4 py-3 text-sm text-[rgb(18,51,119)]/80">{candidate.email}</td>
                <td className="px-4 py-3 text-sm text-[rgb(18,51,119)]/80">
                  {(candidate.skills || []).join(', ') || '-'}
                </td>
                <td className="px-4 py-3 text-sm">{candidate.status}</td>
                <td className="px-4 py-3 text-sm">{candidate.confirmationStatus || 'PENDING'}</td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() =>
                      handleToggleContractStatus(candidate.id, candidate.isUnderContract ?? false)
                    }
                    disabled={updatingContractId === candidate.id}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: candidate.isUnderContract
                        ? 'rgb(34, 197, 94)'
                        : 'rgb(209, 213, 219)',
                      color: candidate.isUnderContract ? 'white' : 'rgb(55, 65, 81)',
                    }}
                  >
                    {updatingContractId === candidate.id ? (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : candidate.isUnderContract ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    {candidate.isUnderContract ? 'En contrat' : 'Pas contrat'}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm">{candidate.applicationsCount || 0}</td>
              </tr>
            ))}
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[rgb(18,51,119)]/70">
                  Aucun candidat trouve
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
