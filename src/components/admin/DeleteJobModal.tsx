'use client';

import { useState } from 'react';
import { Job } from '@/lib/types';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteJobModalProps {
	job: Job;
	onConfirm: () => void;
	onCancel: () => void;
}

export default function DeleteJobModal({ job, onConfirm, onCancel }: DeleteJobModalProps) {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleConfirm = async () => {
		setIsDeleting(true);

		try {
			await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
			onConfirm();
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
							<AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
						</div>
						<h2 className="text-lg font-bold text-gray-900 dark:text-white">Supprimer l'offre</h2>
					</div>
					<button
						onClick={onCancel}
						className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
					>
						<X size={24} />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-4">
					<p className="text-gray-600 dark:text-gray-400">
						Êtes-vous sûr de vouloir supprimer cette offre ?{' '}
						<span className="font-semibold text-gray-900 dark:text-white">Cette action est irréversible.</span>
					</p>

					{/* Job Info */}
					<div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
						<p className="text-sm text-gray-600 dark:text-gray-400">Offre à supprimer :</p>
						<p className="font-semibold text-gray-900 dark:text-white">{job.title}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
							Créée le {new Date(job.createdAt).toLocaleDateString('fr-FR')}
						</p>
					</div>

					{/* Warning */}
					<div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
						<p className="text-sm text-red-800 dark:text-red-400">
							⚠️ Les candidatures associées à cette offre pourraient être affectées.
						</p>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 p-6">
					<button
						type="button"
						onClick={onCancel}
						disabled={isDeleting}
						className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						Annuler
					</button>
					<button
						onClick={handleConfirm}
						disabled={isDeleting}
						className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
					>
						{isDeleting ? (
							<>
								<span className="animate-spin">⏳</span>
								Suppression...
							</>
						) : (
							<>
								<AlertTriangle size={18} />
								Supprimer définitivement
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
