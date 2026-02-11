import { Job, JobType } from './types';

export const mockJobs: Job[] = [
	{
		id: '1',
		title: 'Développeur React Senior',
		company_name: 'TechNova',
		company_logo: 'https://via.placeholder.com/50?text=TechNova',
		description: 'Nous recherchons un développeur React expérimenté pour rejoindre notre équipe produit. Vous travaillerez sur des features complexes et des optimisations de performance.',
		location: 'Paris, France',
		type: 'CDI',
		source: 'INTERNAL',
		is_active: true,
		createdAt: '2026-01-15T10:00:00Z',
		updatedAt: '2026-02-08T14:30:00Z',
		applicationsCount: 12,
	},
	{
		id: '2',
		title: 'Développeur TypeScript Backend',
		company_name: 'DevHub',
		company_logo: 'https://via.placeholder.com/50?text=DevHub',
		description: 'Rejoignez notre équipe backend pour développer des APIs performantes et scalables avec Node.js et TypeScript.',
		location: 'Lyon, France',
		type: 'CDI',
		source: 'INTERNAL',
		is_active: true,
		createdAt: '2026-01-20T09:00:00Z',
		updatedAt: '2026-02-07T11:15:00Z',
		applicationsCount: 8,
	},
	{
		id: '3',
		title: 'Designer UX/UI Junior',
		company_name: 'CreativeStudio',
		company_logo: 'https://via.placeholder.com/50?text=Creative',
		description: 'Cadre apprentissage - Rejoignez notre équipe design pour créer des interfaces utilisateur magnifiques et intuitives.',
		location: 'Toulouse, France',
		type: 'CDD',
		source: 'INTERNAL',
		is_active: true,
		createdAt: '2026-02-01T08:30:00Z',
		updatedAt: '2026-02-05T16:45:00Z',
		applicationsCount: 5,
	},
	{
		id: '4',
		title: 'Full Stack Developer',
		company_name: 'WebScale',
		company_logo: 'https://via.placeholder.com/50?text=WebScale',
		description: 'Nous recherchons un développeur polyvalent pour travailler sur l\'ensemble de la stack (React + Node.js). Vous serez responsable du développement de features end-to-end.',
		location: 'Bordeaux, France',
		type: 'CDI',
		source: 'INTERNAL',
		is_active: true,
		createdAt: '2026-01-28T13:20:00Z',
		updatedAt: '2026-02-06T10:00:00Z',
		applicationsCount: 15,
	},
	{
		id: '5',
		title: 'DevOps Engineer',
		company_name: 'CloudOps',
		company_logo: 'https://via.placeholder.com/50?text=CloudOps',
		description: 'Rejoignez notre équipe infrastructure pour gérer et optimiser notre environnement cloud. Expérience AWS/GCP requise.',
		location: 'Télétravail',
		type: 'CDI',
		source: 'INTERNAL',
		is_active: false,
		createdAt: '2026-02-08T15:00:00Z',
		updatedAt: '2026-02-08T15:00:00Z',
		applicationsCount: 0,
	},
	{
		id: '6',
		title: 'Product Manager',
		company_name: 'InnovateCorp',
		company_logo: 'https://via.placeholder.com/50?text=Innovate',
		description: 'Pilotez la stratégie produit de notre plateforme. Vous travaillerez avec les équipes design, engineering et marketing.',
		location: 'Montpellier, France',
		type: 'CDI',
		source: 'INTERNAL',
		is_active: false,
		createdAt: '2025-12-15T10:00:00Z',
		updatedAt: '2026-02-03T09:30:00Z',
		applicationsCount: 25,
	},
	{
		id: '7',
		title: 'Développeur Python Data',
		company_name: 'DataMasters',
		company_logo: 'https://via.placeholder.com/50?text=DataMasters',
		description: 'Contrat court-terme pour développer des scripts de traitement de données. Mission 2-3 mois.',
		location: 'Télétravail',
		type: 'CDD',
		source: 'EXTERNAL',
		source_url: 'https://www.linkedin.com/jobs/view/123456789',
		is_active: true,
		createdAt: '2026-02-04T11:00:00Z',
		updatedAt: '2026-02-07T14:45:00Z',
		applicationsCount: 3,
	},
	{
		id: '8',
		title: 'QA Engineer',
		company_name: 'QualityFirst',
		company_logo: 'https://via.placeholder.com/50?text=Quality',
		description: 'Testeur automation - Développez et maintenez notre suite de tests automation Cypress et Playwright.',
		location: 'Nantes, France',
		type: 'CDI',
		source: 'INTERNAL',
		is_active: false,
		createdAt: '2025-11-01T09:00:00Z',
		updatedAt: '2026-02-01T12:00:00Z',
		applicationsCount: 18,
	},
];

export function getJobsByActive(active: boolean): Job[] {
	return mockJobs.filter(job => job.is_active === active);
}

export function getJobById(id: string): Job | undefined {
	return mockJobs.find(job => job.id === id);
}

export function countJobsByType(type: JobType): number {
	return mockJobs.filter(job => job.type === type).length;
}

export default mockJobs;
