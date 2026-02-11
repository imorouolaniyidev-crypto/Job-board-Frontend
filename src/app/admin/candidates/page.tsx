'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Edit2, Trash2, Plus, Users } from 'lucide-react';
import mockCandidates from '@/lib/mockCandidates';
import type { Candidate, CandidateStatus } from '@/lib/types';
import CandidateForm from '@/components/admin/CandidateForm';
import DeleteCandidateModal from '@/components/admin/DeleteCandidateModal';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<CandidateStatus | 'ALL'>('ALL');
  const [candidateModal, setCandidateModal] = useState<{
    isOpen: boolean;
    candidate?: Candidate;
  }>({ isOpen: false });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    candidate?: Candidate;
  }>({ isOpen: false });

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch =
        candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'ALL' || candidate.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchTerm, filterStatus]);

  // Status badges
  const getStatusColor = (status: CandidateStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500/20 text-green-700 dark:text-green-400';
      case 'REVIEWING':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
      case 'REJECTED':
        return 'bg-red-500/20 text-red-700 dark:text-red-400';
    }
  };

  const getStatusLabel = (status: CandidateStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'Actif';
      case 'REVIEWING':
        return 'En révision';
      case 'REJECTED':
        return 'Rejeté';
    }
  };

  // Count by status
  const statusCounts = {
    ACTIVE: candidates.filter(c => c.status === 'ACTIVE').length,
    REVIEWING: candidates.filter(c => c.status === 'REVIEWING').length,
    REJECTED: candidates.filter(c => c.status === 'REJECTED').length,
  };

  // Handle save
  const handleSave = (candidate: Candidate) => {
    if (candidateModal.candidate) {
      setCandidates(candidates.map(c => (c.id === candidate.id ? candidate : c)));
    } else {
      setCandidates([...candidates, { ...candidate, id: `cand-${Date.now()}` }]);
    }
    setCandidateModal({ isOpen: false });
  };

  // Handle delete
  const handleDelete = () => {
    if (deleteModal.candidate) {
      setCandidates(candidates.filter(c => c.id !== deleteModal.candidate!.id));
      setDeleteModal({ isOpen: false });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gestion des Candidats</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {candidates.length} candidat{candidates.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setCandidateModal({ isOpen: true })}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Ajouter un candidat
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-green-500">
          <p className="text-sm text-gray-600 dark:text-gray-400">Actifs</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {statusCounts.ACTIVE}
          </p>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <p className="text-sm text-gray-600 dark:text-gray-400">En révision</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {statusCounts.REVIEWING}
          </p>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <p className="text-sm text-gray-600 dark:text-gray-400">Rejetés</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {statusCounts.REJECTED}
          </p>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'ACTIVE', 'REVIEWING', 'REJECTED'] as const).map(status => {
          const isActive = filterStatus === status;
          const count =
            status === 'ALL'
              ? candidates.length
              : statusCounts[status as Exclude<typeof status, 'ALL'>];

          return (
            <Button
              key={status}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status as CandidateStatus | 'ALL')}
              className={isActive ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {status === 'ALL' ? 'Tous' : getStatusLabel(status as CandidateStatus)} ({count})
            </Button>
          );
        })}
      </div>

      {/* Search Bar */}
      <Input
        placeholder="Rechercher par nom, email..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      {/* Candidates Table */}
      <Card className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Nom
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Compétences
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Candidatures
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map(candidate => (
                <tr key={candidate.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {candidate.firstName} {candidate.lastName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(candidate.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {candidate.email}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {(candidate.skills || []).slice(0, 2).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {(candidate.skills || []).length > 2 && (
                        <span className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400">
                          +{(candidate.skills || []).length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                      {getStatusLabel(candidate.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {candidate.applicationsCount || 0}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCandidateModal({ isOpen: true, candidate })}
                        className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400"
                        title="Éditer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, candidate })}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  Aucun candidat trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Statistics Footer */}
      <Card className="p-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Total</span>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{candidates.length}</p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Actifs</span>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {statusCounts.ACTIVE}
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">En révision</span>
            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
              {statusCounts.REVIEWING}
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Rejetés</span>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">
              {statusCounts.REJECTED}
            </p>
          </div>
        </div>
      </Card>

      {/* Modals */}
      {candidateModal.isOpen && (
        <CandidateForm
          candidate={candidateModal.candidate}
          onSave={handleSave}
          onCancel={() => setCandidateModal({ isOpen: false })}
        />
      )}

      {deleteModal.isOpen && deleteModal.candidate && (
        <DeleteCandidateModal
          candidate={deleteModal.candidate}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal({ isOpen: false })}
        />
      )}
    </div>
  );
}
