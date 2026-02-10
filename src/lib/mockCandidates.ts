import { Candidate } from './types';

export const mockCandidates: Candidate[] = [
	{
		id: 'cand-1',
		firstName: 'Jean',
		lastName: 'Dupont',
		email: 'jean.dupont@email.com',
		phone: '+33 6 12 34 56 78',
		skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
		experience: '5 ans d\'expérience en développement frontend. Spécialisé en React et TypeScript. Expérience avec des projets d\'envergure chez des startups et grandes entreprises.',
		cvUrl: 'https://storage.example.com/cv/jean-dupont-2026.pdf',
		status: 'ACTIVE',
		createdAt: '2026-01-10T08:30:00Z',
		updatedAt: '2026-02-08T14:15:00Z',
		applicationsCount: 3,
	},
	{
		id: 'cand-2',
		firstName: 'Marie',
		lastName: 'Martin',
		email: 'marie.martin@email.com',
		phone: '+33 6 98 76 54 32',
		skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'],
		experience: '7 ans en backend, expert Django. Expérience avec architectures microservices et déploiements AWS.',
		cvUrl: 'https://storage.example.com/cv/marie-martin-2026.pdf',
		status: 'ACTIVE',
		createdAt: '2025-12-15T10:00:00Z',
		updatedAt: '2026-02-07T09:45:00Z',
		applicationsCount: 5,
	},
	{
		id: 'cand-3',
		firstName: 'Sophie',
		lastName: 'Bernard',
		email: 'sophie.bernard@email.com',
		phone: '+33 7 45 67 89 01',
		skills: ['Figma', 'UI/UX Design', 'Design System', 'Prototyping', 'Adobe XD'],
		experience: 'Designer UX/UI junior, 2 ans d\'expérience. Passionnée par la création d\'interfaces intuitives et belles.',
		cvUrl: 'https://storage.example.com/cv/sophie-bernard-2026.pdf',
		status: 'ACTIVE',
		createdAt: '2026-01-25T14:20:00Z',
		updatedAt: '2026-02-06T16:30:00Z',
		applicationsCount: 2,
	},
	{
		id: 'cand-4',
		firstName: 'Marc',
		lastName: 'Leclerc',
		email: 'marc.leclerc@email.com',
		phone: '+33 6 11 22 33 44',
		skills: ['Full Stack', 'React', 'Node.js', 'MongoDB', 'Git'],
		experience: 'Développeur Full Stack avec 4 ans d\'expérience. Confortable sur tout type de projet du frontend au backend.',
		cvUrl: 'https://storage.example.com/cv/marc-leclerc-2026.pdf',
		status: 'REVIEWING',
		createdAt: '2026-01-30T11:15:00Z',
		updatedAt: '2026-02-08T10:00:00Z',
		applicationsCount: 1,
	},
	{
		id: 'cand-5',
		firstName: 'Claire',
		lastName: 'Moreau',
		email: 'claire.moreau@email.com',
		phone: '+33 7 89 01 23 45',
		skills: ['Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'AWS', 'GCP'],
		experience: '6 ans en DevOps/Infrastructure. Expert Kubernetes et orchestration de conteneurs.',
		cvUrl: 'https://storage.example.com/cv/claire-moreau-2026.pdf',
		status: 'ACTIVE',
		createdAt: '2026-02-01T09:00:00Z',
		updatedAt: '2026-02-08T13:45:00Z',
		applicationsCount: 4,
	},
	{
		id: 'cand-6',
		firstName: 'Thomas',
		lastName: 'Fournier',
		email: 'thomas.fournier@email.com',
		phone: '+33 6 55 66 77 88',
		skills: ['Product Management', 'Analytics', 'Agile', 'Data Analysis', 'Leadership'],
		experience: 'Product Manager avec 5 ans d\'expérience. Expérience dans le SaaS et la gestion de produits complexes.',
		cvUrl: 'https://storage.example.com/cv/thomas-fournier-2026.pdf',
		status: 'REJECTED',
		createdAt: '2025-11-20T15:30:00Z',
		updatedAt: '2026-02-03T11:20:00Z',
		applicationsCount: 0,
	},
	{
		id: 'cand-7',
		firstName: 'Nathalie',
		lastName: 'Dubois',
		email: 'nathalie.dubois@email.com',
		phone: '+33 7 12 34 56 78',
		skills: ['Quality Assurance', 'Cypress', 'Playwright', 'Test Automation', 'Selenium'],
		experience: 'QA Engineer en Test Automation depuis 4 ans. Expérience complète des tests E2E et API.',
		cvUrl: 'https://storage.example.com/cv/nathalie-dubois-2026.pdf',
		status: 'ACTIVE',
		createdAt: '2026-02-02T08:45:00Z',
		updatedAt: '2026-02-08T12:00:00Z',
		applicationsCount: 2,
	},
	{
		id: 'cand-8',
		firstName: 'Vincent',
		lastName: 'Blanc',
		email: 'vincent.blanc@email.com',
		phone: '+33 6 99 88 77 66',
		skills: ['Data Science', 'Python', 'Machine Learning', 'TensorFlow', 'Pandas'],
		experience: 'Data Scientist passionné par ML et AI. 3 ans d\'expérience dans l\'analyse de données et modélisation.',
		cvUrl: 'https://storage.example.com/cv/vincent-blanc-2026.pdf',
		status: 'REVIEWING',
		createdAt: '2026-02-04T13:20:00Z',
		updatedAt: '2026-02-08T15:10:00Z',
		applicationsCount: 1,
	},
];

export function getCandidatesByStatus(status: string): Candidate[] {
	return mockCandidates.filter(c => c.status === status);
}

export function getCandidateById(id: string): Candidate | undefined {
	return mockCandidates.find(c => c.id === id);
}

export function countCandidatesByStatus(status: string): number {
	return mockCandidates.filter(c => c.status === status).length;
}

export default mockCandidates;
