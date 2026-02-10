'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Job, JobStatus } from '@/lib/types';
import mockJobs from '@/lib/mockJobs';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import JobForm from '@/components/admin/JobForm';
import DeleteJobModal from '@/components/admin/DeleteJobModal';

type JobModalState = { type: 'create' } | { type: 'edit'; job: Job } | null;

export default function JobsPage() {
	const [jobs, setJobs] = useState<Job[]>(mockJobs);
	const [jobModal, setJobModal] = useState<JobModalState>(null);
	const [deleteModal, setDeleteModal] = useState<Job | null>(null);
	const [filter, setFilter] = useState<JobStatus | 'ALL'>('ALL');

	// Filter jobs based on status
	const filteredJobs = filter === 'ALL' ? jobs : jobs.filter(job => job.status === filter);

	// Handle create/edit submit
	const handleSaveJob = (formData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
		if (jobModal?.type === 'create') {
			const newJob: Job = {
				...formData,
				id: `${Date.now()}`,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			setJobs([newJob, ...jobs]);
		} else if (jobModal?.type === 'edit') {
			const updatedJobs = jobs.map(job =>
				job.id === jobModal.job.id
					? {
							...job,
							...formData,
							updatedAt: new Date().toISOString(),
					  }
					: job
			);
			setJobs(updatedJobs);
		}
		setJobModal(null);
	};;

	// Handle delete
	const handleDeleteJob = (jobId: string) => {
		setJobs(jobs.filter(job => job.id !== jobId));
		setDeleteModal(null);
	};

	return (
		<div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-8">
			{/* Header */}
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Offres d'emploi</h1>
					<p className="text-gray-600 dark:text-gray-400">Gérez toutes vos offres d'emploi</p>
				</div>

				{/* Create Button */}
				<button
					onClick={() => setJobModal({ type: 'create' })}
					className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Plus size={20} />
					Créer une offre
				</button>
			</div>

			{/* Filters */}
			<div className="mb-6 flex gap-2 overflow-x-auto pb-2">
				{(['ALL', 'PUBLISHED', 'DRAFT', 'CLOSED', 'ARCHIVED'] as const).map(status => (
					<button
						key={status}
						onClick={() => setFilter(status)}
						className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
							filter === status
								? 'bg-blue-600 text-white'
								: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
						}`}
					>
						{status === 'ALL' ? 'Toutes' : getStatusLabel(status)}{' '}
						<span className="text-xs">
							({jobs.filter(j => status === 'ALL' || j.status === status).length})
						</span>
					</button>
				))}
			</div>

			{/* Jobs Table */}
			<div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
									Titre
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
									Type
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
									Mode
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
									Statut
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
									Créée
								</th>
								<th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{filteredJobs.length === 0 ? (
								<tr>
									<td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
										Aucune offre trouvée
									</td>
								</tr>
							) : (
								filteredJobs.map(job => (
									<tr
										key={job.id}
										className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
									>
										<td className="px-6 py-4">
											<div>
												<p className="font-medium text-gray-900 dark:text-white">{job.title}</p>
												<p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
											</div>
										</td>
										<td className="px-6 py-4">
											<span className="text-sm font-medium text-gray-900 dark:text-white">
												{getTypeLabel(job.jobType)}
											</span>
										</td>
										<td className="px-6 py-4">
											<span className="text-sm text-gray-600 dark:text-gray-400">
												{getWorkModeLabel(job.workMode)}
											</span>
										</td>
										<td className="px-6 py-4">
											<span
												className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
													job.status
												)}`}
											>
												{getStatusLabel(job.status)}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
											{new Date(job.createdAt).toLocaleDateString('fr-FR')}
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center justify-center gap-2">
												<button
													onClick={() => setJobModal({ type: 'edit', job })}
													className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
													title="Éditer"
												>
													<Edit2 size={18} />
												</button>
												<button
													onClick={() => setDeleteModal(job)}
													className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
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

			{/* Stats Footer */}
			<div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
					<p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.length}</p>
				</div>
				<div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<p className="text-sm text-gray-600 dark:text-gray-400">Publiées</p>
					<p className="text-2xl font-bold text-green-600">{jobs.filter(j => j.status === 'PUBLISHED').length}</p>
				</div>
				<div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<p className="text-sm text-gray-600 dark:text-gray-400">Brouillons</p>
					<p className="text-2xl font-bold text-yellow-600">{jobs.filter(j => j.status === 'DRAFT').length}</p>
				</div>
				<div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<p className="text-sm text-gray-600 dark:text-gray-400">Fermées</p>
					<p className="text-2xl font-bold text-red-600">
						{jobs.filter(j => j.status === 'CLOSED' || j.status === 'ARCHIVED').length}
					</p>
				</div>
			</div>

			{/* Job Form Modal */}
			{jobModal && (
				<JobForm
					job={jobModal.type === 'edit' ? jobModal.job : undefined}
					onSave={handleSaveJob}
					onCancel={() => setJobModal(null)}
				/>
			)}

			{/* Delete Modal */}
			{deleteModal && (
				<DeleteJobModal
					job={deleteModal}
					onConfirm={() => handleDeleteJob(deleteModal.id)}
					onCancel={() => setDeleteModal(null)}
				/>
			)}
		</div>
	);
}

// Utility functions
function getTypeLabel(type: string): string {
	const labels: Record<string, string> = {
		CDI: 'CDI',
		CDD: 'CDD',
		STAGE: 'Stage',
	};
	return labels[type] || type;
}

function getWorkModeLabel(mode: string): string {
	const labels: Record<string, string> = {
		REMOTE: 'Télétravail',
		ON_SITE: 'Sur site',
		HYBRID: 'Hybride',
	};
	return labels[mode] || mode;
}

function getStatusLabel(status: string): string {
	const labels: Record<string, string> = {
		PUBLISHED: 'Publiée',
		DRAFT: 'Brouillon',
		CLOSED: 'Fermée',
		ARCHIVED: 'Archivée',
	};
	return labels[status] || status;
}

function getStatusColor(status: string): string {
	const colors: Record<string, string> = {
		PUBLISHED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
		DRAFT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
		CLOSED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
		ARCHIVED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
	};
	return colors[status] || 'bg-gray-100 text-gray-800';
}
