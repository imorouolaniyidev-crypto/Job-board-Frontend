'use client';

import { useState } from 'react';
import { Job, JobType, WorkMode, JobStatus } from '@/lib/types';
import { X } from 'lucide-react';

interface JobFormProps {
	job?: Job;
	onSave: (formData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void;
	onCancel: () => void;
}

export default function JobForm({ job, onSave, onCancel }: JobFormProps) {
	const isEdit = !!job;

	const [title, setTitle] = useState(job?.title || '');
	const [company, setCompany] = useState(job?.company || '');
	const [description, setDescription] = useState(job?.description || '');
	const [requirements, setRequirements] = useState(job?.requirements?.join(', ') || '');
	const [salary, setSalary] = useState(job?.salary || '');
	const [location, setLocation] = useState(job?.location || '');
	const [jobType, setJobType] = useState<JobType>(job?.jobType || 'CDI');
	const [workMode, setWorkMode] = useState<WorkMode>(job?.workMode || 'REMOTE');
	const [status, setStatus] = useState<JobStatus>(job?.status || 'DRAFT');
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!title.trim()) newErrors.title = 'Le titre est requis';
		if (!company.trim()) newErrors.company = 'L\'entreprise est requise';
		if (!description.trim()) newErrors.description = 'La description est requise';
		if (!location.trim()) newErrors.location = 'Le lieu est requis';
		if (title.length < 3) newErrors.title = 'Le titre doit contenir au moins 3 caractères';
		if (description.length < 10) newErrors.description = 'La description doit contenir au moins 10 caractères';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

			onSave({
				title,
				company,
				description,
				requirements: requirements
					.split(',')
					.map(r => r.trim())
					.filter(r => r),
				salary: salary || undefined,
				location,
				jobType,
				workMode,
				status,
				createdBy: 'admin@platform.com',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white">
						{isEdit ? '✏️ Éditer l\'offre' : '➕ Créer une nouvelle offre'}
					</h2>
					<button
						onClick={onCancel}
						className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
					>
						<X size={24} />
					</button>
				</div>

				{/* Form Content */}
				<form onSubmit={handleSubmit} className="p-6 space-y-5">
					{/* Titre */}
					<div>
						<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
							Titre de l'offre *
						</label>
						<input
							type="text"
							value={title}
							onChange={e => setTitle(e.target.value)}
							placeholder="ex: Développeur React Senior"
							className={`w-full px-4 py-2 rounded-lg border ${
								errors.title
									? 'border-red-500 dark:border-red-400'
									: 'border-gray-300 dark:border-gray-600'
							} bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
						/>
						{errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
					</div>

					{/* Company & Location */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
								Entreprise *
							</label>
							<input
								type="text"
								value={company}
								onChange={e => setCompany(e.target.value)}
								placeholder="ex: TechNova"
								className={`w-full px-4 py-2 rounded-lg border ${
									errors.company
										? 'border-red-500 dark:border-red-400'
										: 'border-gray-300 dark:border-gray-600'
								} bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
							{errors.company && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.company}</p>}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
								Lieu *
							</label>
							<input
								type="text"
								value={location}
								onChange={e => setLocation(e.target.value)}
								placeholder="ex: Paris, France ou Télétravail"
								className={`w-full px-4 py-2 rounded-lg border ${
									errors.location
										? 'border-red-500 dark:border-red-400'
										: 'border-gray-300 dark:border-gray-600'
								} bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
							{errors.location && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>}
						</div>
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
							Description *
						</label>
						<textarea
							value={description}
							onChange={e => setDescription(e.target.value)}
							placeholder="Décrivez le poste, les responsabilités et les compétences requises..."
							rows={5}
							className={`w-full px-4 py-2 rounded-lg border ${
								errors.description
									? 'border-red-500 dark:border-red-400'
									: 'border-gray-300 dark:border-gray-600'
							} bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
						/>
						{errors.description && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
						)}
					</div>

					{/* Requirements */}
					<div>
						<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
							Compétences requises
						</label>
						<input
							type="text"
							value={requirements}
							onChange={e => setRequirements(e.target.value)}
							placeholder="ex: React, TypeScript, Tailwind (séparées par des virgules)"
							className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Salary */}
					<div>
						<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
							Salaire (optionnel)
						</label>
						<input
							type="text"
							value={salary}
							onChange={e => setSalary(e.target.value)}
							placeholder="ex: 45k€ - 55k€"
							className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Type & Work Mode */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
								Type de contrat *
							</label>
							<select
								value={jobType}
								onChange={e => setJobType(e.target.value as JobType)}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="CDI">CDI</option>
								<option value="CDD">CDD</option>
								<option value="STAGE">Stage</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
								Mode de travail *
							</label>
							<select
								value={workMode}
								onChange={e => setWorkMode(e.target.value as WorkMode)}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="REMOTE">Télétravail</option>
								<option value="ON_SITE">Sur site</option>
								<option value="HYBRID">Hybride</option>
							</select>
						</div>
					</div>

					{/* Statut */}
					<div>
						<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
							Statut *
						</label>
						<select
							value={status}
							onChange={e => setStatus(e.target.value as JobStatus)}
							className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="DRAFT">Brouillon</option>
							<option value="PUBLISHED">Publiée</option>
							<option value="CLOSED">Fermée</option>
							<option value="ARCHIVED">Archivée</option>
						</select>
						<p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
							💡 Choisissez "Brouillon" pour revoir la fiche avant de publier
						</p>
					</div>
				</form>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 p-6">
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						Annuler
					</button>
					<button
						onClick={handleSubmit}
						disabled={isSubmitting}
						className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isSubmitting ? '⏳ Enregistrement...' : isEdit ? '💾 Mettre à jour' : '➕ Créer'}
					</button>
				</div>
			</div>
		</div>
	);
}
