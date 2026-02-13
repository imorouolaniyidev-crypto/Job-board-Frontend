'use client';

import { useState } from 'react';
import { Job, JobType, JobSource } from '@/lib/types';
import { X } from 'lucide-react';

interface JobFormProps {
	job?: Job;
	onSave: (formData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
	onCancel: () => void;
}

export default function JobForm({ job, onSave, onCancel }: JobFormProps) {
	const isEdit = !!job;

	const [title, setTitle] = useState(job?.title || '');
	const [companyName, setCompanyName] = useState(job?.company_name || '');
	const [companyLogo, setCompanyLogo] = useState(job?.company_logo || '');
	const [description, setDescription] = useState(job?.description || '');
	const [location, setLocation] = useState(job?.location || '');
	const [jobType, setJobType] = useState<JobType>(job?.type || 'CDI');
	const [source, setSource] = useState<JobSource>(job?.source || 'INTERNAL');
	const [sourceUrl, setSourceUrl] = useState(job?.source_url || '');
	const [isActive, setIsActive] = useState(job?.is_active ?? true);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!title.trim()) newErrors.title = 'Le titre est requis';
		if (!companyName.trim()) newErrors.company_name = 'L\'entreprise est requise';
		if (!description.trim()) newErrors.description = 'La description est requise';
		if (!location.trim()) newErrors.location = 'Le lieu est requis';
		if (source === 'EXTERNAL' && !sourceUrl.trim()) newErrors.source_url = 'L\'URL est requise pour les offres externes';
		if (source === 'EXTERNAL' && sourceUrl && !isValidUrl(sourceUrl)) newErrors.source_url = 'L\'URL n\'est pas valide';
		if (title.length < 3) newErrors.title = 'Le titre doit contenir au moins 3 caractères';
		if (description.length < 10) newErrors.description = 'La description doit contenir au moins 10 caractères';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const isValidUrl = (url: string): boolean => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			await onSave({
				title,
				company_name: companyName,
				company_logo: companyLogo || undefined,
				description,
				location,
				type: jobType,
				source,
				source_url: source === 'EXTERNAL' ? sourceUrl : undefined,
				is_active: isActive,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-[90vh] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6 flex-shrink-0">
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

				{/* Form Content - Scrollable */}
				<form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
					{/* Titre */}
					<div>
						<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
							Titre de l&apos;offre *
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

					{/* Company Name & Location */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
								Entreprise *
							</label>
							<input
								type="text"
								value={companyName}
								onChange={e => setCompanyName(e.target.value)}
								placeholder="ex: TechNova"
								className={`w-full px-4 py-2 rounded-lg border ${
									errors.company_name
										? 'border-red-500 dark:border-red-400'
										: 'border-gray-300 dark:border-gray-600'
								} bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
							{errors.company_name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.company_name}</p>}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
								Lieu *
							</label>
							<input
								type="text"
								value={location}
								onChange={e => setLocation(e.target.value)}
								placeholder="ex: Paris, France"
								className={`w-full px-4 py-2 rounded-lg border ${
									errors.location
										? 'border-red-500 dark:border-red-400'
										: 'border-gray-300 dark:border-gray-600'
								} bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
							{errors.location && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>}
						</div>
					</div>

					{/* Company Logo URL */}
					<div>
						<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
							URL du logo de l&apos;entreprise (optionnel)
						</label>
						<input
							type="url"
							value={companyLogo}
							onChange={e => setCompanyLogo(e.target.value)}
							placeholder="ex: https://example.com/logo.png"
							className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
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
							rows={4}
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

					{/* Type & Source */}
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
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
								Source *
							</label>
							<select
								value={source}
								onChange={e => setSource(e.target.value as JobSource)}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="INTERNAL">Interne</option>
								<option value="EXTERNAL">Externe</option>
							</select>
						</div>
					</div>

					{/* URL de l'offre externe (conditionnel) */}
					{source === 'EXTERNAL' && (
						<div>
							<label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
								URL de l&apos;offre externe *
							</label>
							<input
								type="url"
								value={sourceUrl}
								onChange={e => setSourceUrl(e.target.value)}
								placeholder="ex: https://www.linkedin.com/jobs/view/..."
								className={`w-full px-4 py-2 rounded-lg border ${
									errors.source_url
										? 'border-red-500 dark:border-red-400'
										: 'border-gray-300 dark:border-gray-600'
								} bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
							/>
							{errors.source_url && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.source_url}</p>}
						</div>
					)}

					{/* Active Status */}
					<div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
						<input
							type="checkbox"
							id="isActive"
							checked={isActive}
							onChange={e => setIsActive(e.target.checked)}
							className="w-4 h-4 rounded border-gray-300"
						/>
						<label htmlFor="isActive" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
							Offre active
						</label>
					</div>
				</form>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 p-6 flex-shrink-0">
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
