# 📋 Job Board Platform - Frontend Task List

**Stack Tech** : Next.js 14+ | Tailwind CSS | Shadcn/ui | Zustand | TanStack Query | Jest

**Équipe** : 6 développeurs | 6 phases de développement

---

## 🎯 Attribution des Développeurs

```
Dev 1 (LEAD): Initialisation + Auth           [Architecture, Setup, JWT]
Dev 2 (PAGES): Listing & Détail Offres        [Pages jobs, recherche, filtres]
Dev 3 (PROFIL): Candidat & Candidatures       [Profil, CV upload, candidatures]
Dev 4 (FORMS): Formulaires & Validation       [Inscription, Login, Admin forms]
Dev 5 (ADMIN): Dashboard & Gestion            [Dashboard admin, gestion candidats]
Dev 6 (UI/UX): Design System & Tests          [Components, Responsiv, Tests]
```

---

## 📦 PHASE 0 : Initialisation & Structure (Week 1)

### Phase 0.1 : Setup Initial Projet (Dev 1 - LEAD)

**Objectif** : Environment de travail propre et prêt pour l'équipe

- [ ] **0.1.1** - Créer le projet Next.js 14
  ```bash
  npx create-next-app@latest job-board-frontend --typescript --tailwind --eslint
  ```

- [ ] **0.1.2** - Installer dépendances critiques
  ```bash
  npm install zustand @tanstack/react-query @tanstack/react-query-devtools
  npm install -D shadcn-ui
  npm install axios dotenv
  ```

- [ ] **0.1.3** - Configurer structure de dossiers
  ```
  app/
  ├── (auth)/
  │   ├── login/
  │   └── register/
  ├── (main)/
  │   ├── jobs/
  │   ├── profile/
  │   └── applications/
  ├── (admin)/
  │   └── dashboard/
  ├── api/
  │   └── (API client routes)
  └── layout.tsx

  src/
  ├── components/
  │   ├── ui/           # Shadcn components
  │   ├── forms/        # Formulaires personnalisés
  │   ├── layout/       # Header, Footer, Sidebar
  │   └── common/       # Composants réutilisables
  ├── lib/
  │   ├── api.ts        # Client Axios
  │   ├── store.ts      # Zustand stores
  │   ├── types.ts      # Types TypeScript
  │   └── utils.ts      # Fonctions utilitaires
  ├── hooks/            # Custom hooks
  └── styles/           # CSS global
  ```

- [ ] **0.1.4** - Configurer `.env.local`
  ```
  NEXT_PUBLIC_API_URL=http://localhost:3000/api
  JWT_SECRET_KEY=[à définir localement]
  ```

- [ ] **0.1.5** - Configurer Next.js (next.config.js)
  - Image optimization (Cloudinary)
  - SEO essentials
  - API routes configuration

- [ ] **0.1.6** - Initialiser Tailwind CSS & Shadcn/ui
  ```bash
  npx shadcn-ui@latest init
  ```

- [ ] **0.1.7** - Setup ESLint + Prettier pour cohérence code
  - Configuration `.eslintrc.json`
  - Configuration `.prettierrc`
  - Pre-commit hooks (husky)

- [ ] **0.1.8** - Créer `README.md` frontend
  - Instructions de démarrage
  - Architecture
  - Conventions de code

**Responsables** : Dev 1 (Lead)
**Durée estimée** : 1-2 jours

---

### Phase 0.2 : API Client & Configuration Globale (Dev 1 + Dev 4)

**Objectif** : Centraliser l'intégration API et la gestion d'état

- [ ] **0.2.1** - Créer client API Axios (`lib/api.ts`)
  - Instance Axios avec intercepteurs
  - Gestion automatique des JWT tokens
  - Error handling centralisé
  - Base URL de l'API backend

- [ ] **0.2.2** - Créer Zustand stores (`lib/store.ts`)
  ```typescript
  // userStore.ts - Gestion utilisateur connecté
  // authStore.ts - État auth (tokens, etc)
  // uiStore.ts - État UI global (toasts, modals)
  ```

- [ ] **0.2.3** - Créer custom hooks réutilisables
  - `useAuth()` - Infos utilisateur + logout
  - `useUser()` - Profil courant
  - `useFetchJobs()` - Fetch jobs avec caching
  - `useApplyJob()` - Mutation candidature

- [ ] **0.2.4** - Configurer React Query (`lib/queryClient.ts`)
  - Stale time, cache time
  - Retry logic
  - Devtools intégrés

- [ ] **0.2.5** - Créer types TypeScript (`lib/types.ts`)
  ```typescript
  type User = { id: string; email: string; role: 'ADMIN' | 'CANDIDATE'; ... }
  type Job = { id: string; title: string; company_name: string; ... }
  type Application = { id: string; user_id: string; job_id: string; status: string; ... }
  // etc...
  ```

**Responsables** : Dev 1 (Lead) + Dev 4
**Durée estimée** : 1-2 jours

---

## 🔐 PHASE 1 : Authentification & Layout Global (Week 1-2)

### Phase 1.1 : Pages Auth & Formulaires (Dev 1 + Dev 4)

**Objectif** : Permettre inscription/login sécurisés

- [ ] **1.1.1** - Créer composant `<LoginForm />`
  - Email + Password input
  - Validation côté client
  - Soumission API
  - Gestion erreurs
  - Redirection après succès

- [ ] **1.1.2** - Créer page `/login`
  - Layout simple (centré)
  - Lien vers register
  - Message d'erreur user-friendly

- [ ] **1.1.3** - Créer composant `<RegisterForm />`
  - Email + Password + Confirm Password
  - Validation (password strength)
  - Terms & Conditions checkbox
  - Soumission API
  - Auto-login après inscription

- [ ] **1.1.4** - Créer page `/register`
  - Layout simple
  - Lien vers login

- [ ] **1.1.5** - Middleware authentification
  - Vérifier JWT au démarrage
  - Rediriger utilisateurs non connectés
  - Protéger routes privées

- [ ] **1.1.6** - Ajouter logout functionality
  - Bouton logout dans header
  - Clear tokens + store
  - Redirection vers home

**Responsables** : Dev 1 + Dev 4
**Durée estimée** : 2-3 jours

---

### Phase 1.2 : Layout Global & Navigation (Dev 1 + Dev 6)

**Objectif** : Structure commune à tout le site

- [ ] **1.2.1** - Créer composant `<Header />`
  - Logo + Brand
  - Menu de navigation (responsive)
  - User menu (profil, logout) si connecté
  - Mobile hamburger menu

- [ ] **1.2.2** - Créer composant `<Footer />`
  - Links utiles
  - Copyright
  - Contact info

- [ ] **1.2.3** - Créer layout principal (`app/(main)/layout.tsx`)
  - Header + Footer
  - Sidebar pour mobile/desktop

- [ ] **1.2.4** - Créer layout admin (`app/(admin)/layout.tsx`)
  - Sidebar navigation admin
  - Top bar

- [ ] **1.2.5** - Créer layout auth (`app/(auth)/layout.tsx`)
  - Minimal (juste contenu)

- [ ] **1.2.6** - Responsive design pour tous les layouts
  - Mobile first approach
  - Breakpoints Tailwind

**Responsables** : Dev 1 + Dev 6
**Durée estimée** : 2 jours

---

## 📄 PHASE 2 : Pages Job Listing & Détail (Week 2-3)

### Phase 2.1 : Page Listing Offres (Dev 2)

**Objectif** : Afficher toutes les offres en format lisible

- [ ] **2.1.1** - Créer composant `<JobCard />`
  - Titre offre
  - Company name + logo
  - Location
  - Job type (CDI/CDD)
  - Snippet description
  - "Apply" button (si connecté)
  - Link vers détail

- [ ] **2.1.2** - Créer page `/jobs`
  - Grid/List de JobCards
  - Pagination
  - Loading state
  - Empty state

- [ ] **2.1.3** - Intégrer avec API
  - GET `/api/jobs` (avec pagination)
  - Caching React Query
  - Error handling

- [ ] **2.1.4** - Améliorer UX
  - Skeleton loaders
  - Smooth transitions
  - Responsive design

**Responsables** : Dev 2
**Durée estimée** : 2 jours

---

### Phase 2.2 : Recherche & Filtres (Dev 2 + Dev 6)

**Objectif** : Permettre aux utilisateurs de trouver les offres pertinentes

- [ ] **2.2.1** - Créer composant `<SearchBar />`
  - Input recherche (titre, entreprise, localité)
  - Submit button
  - Clear button

- [ ] **2.2.2** - Créer composant `<FilterPanel />`
  - Filter par job type (CDI/CDD)
  - Filter par localité
  - Filter par date
  - Reset filters button

- [ ] **2.2.3** - Intégrer recherche à la page `/jobs`
  - URL params pour partager recherches
  - Mettre à jour listing en temps réel
  - Préserver les filtres au scroll

- [ ] **2.2.4** - Optimiser performances
  - Debounce search
  - React Query refetch intelligent
  - URL-based filtering

**Responsables** : Dev 2 + Dev 6
**Durée estimée** : 1-2 jours

---

### Phase 2.3 : Page Détail Offre (Dev 2)

**Objectif** : Afficher les informations complètes d'une offre

- [ ] **2.3.1** - Créer page `/jobs/[id]`
  - Titre + Company branding
  - Description complète (richtext)
  - Requirements
  - Location + Remote option
  - Salary (si fourni)
  - Apply button

- [ ] **2.3.2** - Créer composant `<JobDetails />`
  - Affichage formaté métadonnées
  - Professional styling

- [ ] **2.3.3** - Intégrer API
  - GET `/api/jobs/:id`
  - Cache par React Query
  - 404 handling

- [ ] **2.3.4** - SEO optimisation
  - Dynamic metadata (title, description)
  - Open Graph tags
  - Structured data (schema.org)

**Responsables** : Dev 2
**Durée estimée** : 2 jours

---

## 👤 PHASE 3 : Profil Candidat & CV Upload (Week 3)

### Phase 3.1 : Page Profil Candidat (Dev 3)

**Objectif** : Permettre aux candidats de gérer leurs infos

- [ ] **3.1.1** - Créer page `/profile`
  - Infos personnelles (first_name, last_name, phone)
  - Bio/Description
  - Localité
  - Avatar upload

- [ ] **3.1.2** - Créer formulaire `<ProfileForm />`
  - Text inputs + validation
  - Textarea pour description
  - Image upload preview
  - Submit button

- [ ] **3.1.3** - Intégrer avec API
  - GET `/api/users/profile`
  - PUT `/api/users/profile`
  - Optimistic UI updates

- [ ] **3.1.4** - Gestion d'état
  - Zustand pour user data
  - Sync avec backend
  - Erreurs user-friendly

**Responsables** : Dev 3
**Durée estimée** : 1-2 jours

---

### Phase 3.2 : Upload CV (Dev 3)

**Objectif** : Permettre aux candidats d'uploader un CV

- [ ] **3.2.1** - Créer composant `<CVUpload />`
  - Drag & drop
  - File validation (PDF uniquement)
  - Progress bar
  - Preview du fichier
  - Delete/Replace option

- [ ] **3.2.2** - Intégrer dans `/profile`
  - Section CV dédiée
  - Afficher CV courant téléchargé
  - Display du nom + date

- [ ] **3.2.3** - Intégrer Cloudinary
  - API key dans `.env.local`
  - Upload sécurisé
  - URL stockée en DB

- [ ] **3.2.4** - Gestion erreurs
  - File size limit
  - Format validation
  - Network errors

**Responsables** : Dev 3
**Durée estimée** : 1-2 jours

---

## 🎯 PHASE 4 : Système de Candidatures (Week 3-4)

### Phase 4.1 : Bouton Postuler (Dev 3 + Dev 4)

**Objectif** : Permettre candidatures en 1 clic

- [ ] **4.1.1** - Créer composant `<ApplyButton />`
  - Disabled si non connecté
  - Afficher tooltip ("Connectez-vous pour postuler")
  - Loading state
  - Success/error toast

- [ ] **4.1.2** - Implémenter logique candidature
  - Vérifier si déjà candidat pour ce poste
  - POST `/api/jobs/:id/apply`
  - Optimistic UI update
  - Prevent duplicate submissions

- [ ] **4.1.3** - Intégrer dans pages jobs
  - Job listing (ApplyButton dans JobCard)
  - Job detail (ApplyButton prominent)

- [ ] **4.1.4** - Modal confirmation candidature
  - Show message de confirmation
  - Close button
  - Professional design

**Responsables** : Dev 3 + Dev 4
**Durée estimée** : 1-2 jours

---

### Phase 4.2 : Historique Candidatures (Dev 3)

**Objectif** : Montrer à l'utilisateur ses candidatures

- [ ] **4.2.1** - Créer page `/applications`
  - Liste des candidatures user
  - Status de chaque candidature (PENDING, REVIEWED, REJECTED)
  - Date candidature
  - Link vers offre

- [ ] **4.2.2** - Créer composant `<ApplicationCard />`
  - Titre offre + company
  - Date candidature
  - Status badge (couleurs)
  - View job button

- [ ] **4.2.3** - Intégrer avec API
  - GET `/api/users/applications`
  - Caching React Query
  - Pagination

- [ ] **4.2.4** - Filtrer par status
  - Tabs/Buttons (All, Pending, Reviewed, Rejected)
  - Filter dynamique

**Responsables** : Dev 3
**Durée estimée** : 1-2 jours

---

## ⚙️ PHASE 5 : Dashboard Admin (Week 4)

### Phase 5.1 : Page Dashboard Admin (Dev 5)

**Objectif** : Permettre aux admins de gérer la plateforme

- [ ] **5.1.1** - Créer page `/admin/dashboard`
  - Stats cards (nombre users, offres, candidatures)
  - Recent applications list
  - Navigation vers gestion offres/candidats

- [ ] **5.1.2** - Protéger pages admin
  - Middleware check role = ADMIN
  - Redirect si non-admin
  - Not found page

**Responsables** : Dev 5
**Durée estimée** : 1 jour

---

### Phase 5.2 : Gestion Offres (Admin) (Dev 5)

**Objectif** : Permettre aux admins de créer/éditer/supprimer offres

- [ ] **5.2.1** - Créer page `/admin/jobs`
  - Liste toutes les offres
  - Statut (active/inactive)
  - Edit button pour chaque offre
  - Delete button

- [ ] **5.2.2** - Créer page `/admin/jobs/create`
  - Formulaire création offre complet
  - Titre, description, company, lieu, type, etc.
  - Submit button
  - Success message

- [ ] **5.2.3** - Créer page `/admin/jobs/[id]/edit`
  - Pre-fill form avec data offre
  - Modification
  - Submit changes
  - Success message

- [ ] **5.2.4** - Intégrer avec API
  - POST `/api/jobs` (create)
  - PUT `/api/jobs/:id` (update)
  - DELETE `/api/jobs/:id` (delete)
  - Optimistic updates

**Responsables** : Dev 5
**Durée estimée** : 2-3 jours

---

### Phase 5.3 : Gestion Candidatures par Offre (Dev 5)

**Objectif** : Permettre aux admins de voir candidatures par offre

- [ ] **5.3.1** - Créer page `/admin/jobs/[id]/applications`
  - List candidats pour cette offre
  - Nom candidat, email, CV link
  - Status candidature
  - Update status (PENDING → REVIEWED → REJECTED)

- [ ] **5.3.2** - Créer composant `<ApplicationRow />`
  - Infos candidat cliquables
  - Status badge + dropdown to change
  - CV preview link
  - Email click-to-open

- [ ] **5.3.3** - Intégrer avec API
  - GET `/api/jobs/:id/applications`
  - PUT `/api/applications/:id` (update status)
  - Caching intelligent

**Responsables** : Dev 5
**Durée estimée** : 1-2 jours

---

## 🎨 PHASE 6 : Design System, Testing & Optimisations (Week 4-5)

### Phase 6.1 : Design System & Components (Dev 6)

**Objectif** : Créer une librairie cohérente de composants

- [ ] **6.1.1** - Installer & configurer Shadcn/ui
  - Ajouter composants essentiels :
    - Button
    - Input
    - Textarea
    - Select
    - Dialog/Modal
    - Toast/Alert
    - Tabs
    - Pagination
    - Badge
    - Skeleton

- [ ] **6.1.2** - Créer componens custom reusables
  - `<FormInput />` - Input avec label + error
  - `<FormSelect />` - Select avec label + error
  - `<FormTextarea />` - Textarea avec label + error
  - `<LoadingSpinner />`
  - `<EmptyState />`
  - `<ErrorBoundary />`

- [ ] **6.1.3** - Créer style guide (`COMPONENT_GUIDE.md`)
  - Documentation des composants
  - Exemples d'utilisation
  - Best practices

**Responsables** : Dev 6
**Durée estimée** : 2 jours

---

### Phase 6.2 : Responsive Design (Dev 6)

**Objectif** : S'assurer que tout fonctionne sur mobile/tablet/desktop

- [ ] **6.2.1** - Audit responsive design
  - Tester toutes les pages (mobile 375px, tablet 768px, desktop 1024px+)
  - Breakpoints Tailwind : sm, md, lg, xl

- [ ] **6.2.2** - Fixes responsive
  - Grid/flex adaptées par breakpoint
  - Images responsive
  - Navigation mobile (hamburger)
  - Font sizes responsive

- [ ] **6.2.3** - Performance optimisation
  - Image optimization (Next.js Image)
  - Code splitting par route
  - eliminer CSS inutilisé

**Responsables** : Dev 6
**Durée estimée** : 2 jours

---

### Phase 6.3 : Tests Unitaires & E2E (Dev 6 + All)

**Objectif** : Assurer la qualité du code

- [ ] **6.3.1** - Setup Jest + React Testing Library
  ```bash
  npm install --save-dev jest @testing-library/react @testing-library/jest-dom
  ```

- [ ] **6.3.2** - Créer fichier config
  - `jest.config.js`
  - `jest.setup.js`

- [ ] **6.3.3** - Tests composants critiques
  - LoginForm tests
  - RegisterForm tests
  - JobCard tests
  - ApplyButton tests

- [ ] **6.3.4** - Tests utilitaires
  - API client tests
  - Store tests
  - Hook tests

- [ ] **6.3.5** - E2E tests (Cypress optionnel)
  - User flow login → search → apply
  - Admin flow create job

**Responsables** : Dev 6 + equipe
**Durée estimée** : 2-3 jours

---

### Phase 6.4 : Accessibility & SEO (Dev 6)

**Objectif** : S'assurer du confort d'utilisation et visibilité web

- [ ] **6.4.1** - Audit accessibilité
  - Alt text sur images
  - ARIA labels
  - Keyboard navigation
  - Focus visible
  - Color contrast

- [ ] **6.4.2** - SEO optimisation
  - Meta tags globaux
  - Sitemap
  - Robots.txt
  - Open Graph
  - Structured data (Jobs schema)

- [ ] **6.4.3** - Performance metrics
  - Lighthouse audit
  - Core Web Vitals
  - Bundle size

**Responsables** : Dev 6
**Durée estimée** : 1-2 jours

---

## 📋 CHECKLIST FINALE

### Avant Déploiement

- [ ] Tous les tests passent (`npm test`)
- [ ] Build succède (`npm run build`)
- [ ] Pas d'avertissements Console
- [ ] Lighthouse > 90 sur performance
- [ ] Responsive sur mobile/tablet/desktop
- [ ] Variables d'env correctement configurées
- [ ] JWT validation fonctionne
- [ ] Fichiers sensibles gitignorés (.env.local)
- [ ] README complet avec instructions

### Production Checklist

- [ ] NEXT_PUBLIC_API_URL pointe vers prod backend
- [ ] Error logging intégré (Sentry optionnel)
- [ ] Analytics intégré (optionnel)
- [ ] Backup + disaster recovery plan

---

## 📅 Timeline Estimée

| Phase | Durée | Responsables |
|-------|-------|--------------|
| Phase 0 (Setup) | 2-3 jours | Dev 1, Dev 4, Dev 6 |
| Phase 1 (Auth + Layout) | 3-4 jours | Dev 1, Dev 4, Dev 6 |
| Phase 2 (Jobs) | 3-4 jours | Dev 2, Dev 6 |
| Phase 3 (Profile + CV) | 2-3 jours | Dev 3 |
| Phase 4 (Applications) | 2-3 jours | Dev 3, Dev 4 |
| Phase 5 (Admin) | 3-4 jours | Dev 5 |
| Phase 6 (Design + Tests) | 4-5 jours | Dev 6, All |
| **TOTAL** | **~3-4 semaines** | 6 devs en parallèle |

---

## 🚀 Next Steps

1. **Valider la stack** : Next.js, Tailwind, Shadcn, Zustand ✅
2. **Créer le repo frontend** : `Job-board-Frontend` (séparé du backend)
3. **Dev 1 lancent Phase 0** : Setup initial
4. **Daily standups** : 15 min pour sync équipe
5. **PRs avec code review** : Avant de merger dans `main`

---

## 📞 Points de Contact

- **Dev 1 (Lead)** : Architecture, blockers
- **Dev 2-5** : Leurs phases respectives
- **Dev 6** : UX/UI, performance, tests

**Slack Channel** : #job-board-frontend

---

*Document créé le 07/02/2026*
*Status : À valider par l'équipe*
