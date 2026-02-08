export type Job = {
	id: string;
	title: string;
	companyName: string;
	location: string;
	type: string;
	createdAt: string;
	salary?: string;
	featured?: boolean;
	tags?: string[];
	description?: string;
};

const mockJobs: Job[] = [
	{
		id: '1',
		title: 'Développeur·se Frontend React',
		companyName: 'TechNova',
		location: 'Paris, France',
		type: 'CDI',
		createdAt: new Date().toISOString(),
		salary: '45k€ - 55k€',
		featured: true,
		tags: ['React', 'TypeScript', 'Tailwind'],
		description: 'Contribuez au développement de notre plateforme B2B en React et TypeScript.',
	},
	{
		id: '2',
		title: 'Data Analyst',
		companyName: 'DataCorp',
		location: 'Lyon, France',
		type: 'CDD',
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
		salary: '35k€ - 45k€',
		featured: false,
		tags: ['SQL', 'Python', 'BI'],
		description: 'Analysez et valorisez les données produit pour améliorer la prise de décision.',
	},
	{
		id: '3',
		title: 'Product Manager',
		companyName: 'BrightApps',
		location: 'Télétravail',
		type: 'CDI',
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
		salary: '60k€ - 75k€',
		featured: false,
		tags: ['Gestion produit', 'Agile'],
		description: 'Pilotez la roadmap produit et travaillez avec les équipes techniques et design.',
	},
];

export default mockJobs;
