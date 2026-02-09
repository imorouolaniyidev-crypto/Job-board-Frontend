# 📋 Plan d'Implémentation - Dashboard Candidat (Frontend Uniquement)

**Date:** 9 Février 2026  
**Version:** 2.0 - Simplifiée  
**Statut:** 🟢 Frontend Only

---

## 🎯 Objectif Global

Créer un dashboard candidat avec:
- ✅ Page **Profil** (formulaire simple avec champs texte)
- ✅ Page **Mes Candidatures** (affichage liste)
- ✅ Upload CV via **Cloudinary** (PDF)
- ❌ Sans authentification (frontend uniquement)

---

## 📐 Architecture Simplifiée

```
Frontend (Next.js 14)
├── Pages Publiques (pas de protection)
│   ├── /profile (formulaire profil)
│   └── /applications (suivi candidatures)
└── Intégrations Externes
    ├── Cloudinary (Upload CV)
    └── Mock Data (données d'affichage)
```

---

## 🔧 Phase 1: Configuration Cloudinary

### 1.1 Installation
```bash
npm install next-cloudinary
```

### 1.2 Variables d'Environnement (`.env.local`)
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=unsigned_upload_preset
```

**Récupérer:**
- Cloud Name: Dashboard Cloudinary
- Upload Preset: Settings → Upload → Presets (créer preset non-signé pour PDF)

---

## 📁 Phase 2: Structure des Fichiers

### 2.1 Arborescence
```
src/
├── components/
│   └── profile/
│       ├── ProfileForm.tsx          (formulaire principal)
│       └── CVUploadSection.tsx      (upload Cloudinary)
├── lib/
│   ├── cloudinary.ts                (utils upload)
│   ├── mockData.ts                  (données test)
│   └── types.ts                     (types TypeScript)
└── app/
    ├── profile/
    │   └── page.tsx                 (page profil)
    └── applications/
        └── page.tsx                 (page candidatures)
```

### 2.2 Types TypeScript (`src/lib/types.ts`)

```typescript
export interface UserProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  experiences: string;      // Texte libre
  formations: string;       // Texte libre
  competences: string;      // Texte libre (séparées par virgules)
  cv_url?: string;
  cv_filename?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Application {
  id: string;
  job_title: string;
  company_name: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'ACCEPTED' | 'REJECTED';
  applied_at: string;
  updated_at: string;
}
```

---

## 🔌 Phase 3: Intégration Cloudinary

### 3.1 Utils Cloudinary (`src/lib/cloudinary.ts`)

```typescript
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
};

export async function validatePDFFile(file: File): Promise<boolean> {
  // Vérifier type
  if (file.type !== 'application/pdf') {
    return false;
  }
  
  // Vérifier taille (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return false;
  }
  
  return true;
}
```

### 3.2 Composant Upload CV (`src/components/profile/CVUploadSection.tsx`)

```typescript
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';

interface CVUploadSectionProps {
  onUpload: (url: string, filename: string) => void;
  currentCV?: { url: string; filename: string };
}

export default function CVUploadSection({ 
  onUpload, 
  currentCV 
}: CVUploadSectionProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-4">
      {/* CV Actuel */}
      {currentCV && (
        <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="font-medium">CV actuel</p>
            <p className="text-sm text-gray-600">{currentCV.filename}</p>
          </div>
          <a 
            href={currentCV.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            Voir
          </a>
        </div>
      )}

      {/* Upload Widget */}
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={(result: any) => {
          onUpload(
            result.info.secure_url,
            result.info.original_filename
          );
        }}
        options={{
          resourceType: 'auto',
          accept: 'application/pdf',
          maxFileSize: 10485760, // 10MB
        }}
      >
        {({ open }) => (
          <button
            onClick={() => open()}
            disabled={isLoading}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <p className="font-medium">Cliquez pour uploader un CV</p>
            <p className="text-sm text-gray-600">PDF uniquement, max 10MB</p>
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
```

---

## 📝 Phase 4: Page Profile

### 4.1 Formulaire Profil (`src/components/profile/ProfileForm.tsx`)

**Champs du formulaire:**

```
┌─────────────────────────────────────────┐
│       FORMULAIRE PROFIL CANDIDAT         │
├─────────────────────────────────────────┤
│                                          │
│  Section 1: Informations de Base        │
│  ├─ Prénom (texte)                      │
│  ├─ Nom (texte)                         │
│  ├─ Téléphone (texte)                   │
│  └─ Email (affichage seul)              │
│                                          │
│  Section 2: CV                          │
│  └─ Upload CV via Cloudinary            │
│                                          │
│  Section 3: Formations                  │
│  └─ Texte libre (multi-ligne)           │
│     ex: "Master Informatique 2023"      │
│                                          │
│  Section 4: Expériences                 │
│  └─ Texte libre (multi-ligne)           │
│     ex: "Dev Senior chez XYZ 2021-2024" │
│                                          │
│  Section 5: Compétences                 │
│  └─ Texte libre (séparées par virgules) │
│     ex: "JavaScript, React, Node.js"    │
│                                          │
│  [Sauvegarder]  [Annuler]               │
└─────────────────────────────────────────┘
```

### 4.2 État du Formulaire (useState)

```typescript
const [formData, setFormData] = useState<UserProfile>({
  user_id: 'user_123', // Statique pour frontend
  first_name: '',
  last_name: '',
  phone: '',
  experiences: '',
  formations: '',
  competences: '',
  cv_url: undefined,
  cv_filename: undefined,
});

const [isSaving, setIsSaving] = useState(false);
const [saveMessage, setSaveMessage] = useState('');
const [errors, setErrors] = useState<Record<string, string>>({});
```

### 4.3 Validation Basique

```typescript
const validateForm = (): boolean => {
  const errors: Record<string, string> = {};
  
  if (!formData.first_name.trim()) {
    errors.first_name = 'Prénom requis';
  }
  
  if (!formData.last_name.trim()) {
    errors.last_name = 'Nom requis';
  }
  
  if (formData.phone && !/^\d{10,}$/.test(formData.phone)) {
    errors.phone = 'Téléphone invalide';
  }
  
  setErrors(errors);
  return Object.keys(errors).length === 0;
};
```

---

## 📊 Phase 5: Page Candidatures

### 5.1 Fonctionnalités

- ✅ Afficher liste des candidatures (mock data)
- ✅ Filtrer par statut (EN_ATTENTE, EN_COURS, ACCEPTÉE, REFUSÉE)
- ✅ Afficher pour chaque candidature:
  - Titre du poste
  - Entreprise
  - Date de candidature
  - Statut avec couleur
- ✅ Stats résumé (total, par statut)
- ✅ État vide si aucune candidature

### 5.2 Mock Data (`src/lib/mockData.ts`)

```typescript
export const mockApplications: Application[] = [
  {
    id: '1',
    job_title: 'React Developer',
    company_name: 'TechCorp',
    status: 'IN_PROGRESS',
    applied_at: '2026-02-05',
    updated_at: '2026-02-08',
  },
  {
    id: '2',
    job_title: 'Senior JavaScript Developer',
    company_name: 'WebAgency',
    status: 'PENDING',
    applied_at: '2026-02-07',
    updated_at: '2026-02-07',
  },
  {
    id: '3',
    job_title: 'Full Stack Developer',
    company_name: 'StartupXYZ',
    status: 'ACCEPTED',
    applied_at: '2026-01-20',
    updated_at: '2026-02-03',
  },
];
```

### 5.3 Composant Applications

```typescript
interface ApplicationsPageProps {
  applications?: Application[];
}

export default function ApplicationsPage({ 
  applications = mockApplications 
}: ApplicationsPageProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | 'ALL'>('ALL');
  
  const filtered = applications.filter(app => 
    selectedStatus === 'ALL' || app.status === selectedStatus
  );
  
  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex gap-2">
        {['ALL', 'PENDING', 'IN_PROGRESS', 'ACCEPTED', 'REJECTED'].map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg ${
              selectedStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500">Aucune candidature</p>
        ) : (
          filtered.map(app => (
            <ApplicationCard key={app.id} application={app} />
          ))
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="Total" 
          value={applications.length} 
        />
        <StatCard 
          label="En attente" 
          value={applications.filter(a => a.status === 'PENDING').length}
        />
      </div>
    </div>
  );
}
```

---

## 🎨 Phase 6: Composants de Base

### 6.1 À Créer

1. **ProfileForm.tsx** - Formulaire principal
2. **CVUploadSection.tsx** - Upload Cloudinary
3. **ApplicationsList.tsx** - Liste candidatures
4. **ApplicationCard.tsx** - Carte candidature
5. **StatCard.tsx** - Stat résumé
6. **Input.tsx** - Champ texte réutilisable
7. **Textarea.tsx** - Zone texte réutilisable

### 6.2 Exemple Input Custom

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ 
  label, 
  error, 
  ...props 
}: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-3 py-2 border rounded-lg ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
```

---

## 📦 État Local avec useState

```typescript
// Profil
const [profile, setProfile] = useState<UserProfile>(initialProfile);
const [isSaving, setIsSaving] = useState(false);
const [saveMessage, setSaveMessage] = useState('');

// Candidatures
const [applications, setApplications] = useState<Application[]>(mockApplications);
const [selectedFilter, setSelectedFilter] = useState<'ALL' | ApplicationStatus>('ALL');
```

**Pas de Zustand nécessaire (pas d'état global complexe)**

---

## 🧪 Validation & Messages

### Validation Simple

```typescript
const validateForm = (): boolean => {
  const errors: Record<string, string> = {};
  
  if (!formData.first_name) errors.first_name = 'Prénom requis';
  if (!formData.last_name) errors.last_name = 'Nom requis';
  
  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return false;
  }
  
  return true;
};
```

### Messages Toast

```typescript
// Succès
setSaveMessage('✅ Profil sauvegardé');
setTimeout(() => setSaveMessage(''), 3000);

// Erreur
setSaveMessage('❌ Erreur lors de la sauvegarde');
```

---

## 🗂️ Stockage Local (Optionnel)

Si vous voulez persister les données côté frontend:

```typescript
// Sauvegarder
localStorage.setItem('userProfile', JSON.stringify(profile));

// Charger
const saved = localStorage.getItem('userProfile');
if (saved) setProfile(JSON.parse(saved));
```

---

## 🚀 Plan de Mise en Place

```
Phase 1: Setup Cloudinary (5-10 min)
    ✅ npm install next-cloudinary
    ✅ Variables .env.local
    ✅ Utils Cloudinary

Phase 2: Types & Structure (10-15 min)
    ✅ Types.ts
    ✅ Mock Data
    ✅ Dossiers composants

Phase 3: Composants Profil (1-2 h)
    ✅ ProfileForm.tsx
    ✅ CVUploadSection.tsx
    ✅ Validations
    ✅ Page /profile

Phase 4: Composants Candidatures (45-60 min)
    ✅ ApplicationsList.tsx
    ✅ ApplicationCard.tsx
    ✅ Filtres & Stats
    ✅ Page /applications

Phase 5: Polish & Détails (30-45 min)
    ✅ Styling
    ✅ Messages d'erreur
    ✅ States de chargement
    ✅ Responsive design

─────────────────────────────────────
TOTAL: 3-4 heures
```

---

## 📝 Structure Finale du Projet

```
src/
├── app/
│   ├── profile/
│   │   └── page.tsx              ← Page profil
│   ├── applications/
│   │   └── page.tsx              ← Page candidatures
│   └── layout.tsx
├── components/
│   ├── profile/
│   │   ├── ProfileForm.tsx
│   │   └── CVUploadSection.tsx
│   ├── applications/
│   │   ├── ApplicationsList.tsx
│   │   └── ApplicationCard.tsx
│   ├── ui/
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Button.tsx
│   │   └── StatCard.tsx
│   └── Providers.tsx
├── lib/
│   ├── types.ts
│   ├── cloudinary.ts
│   └── mockData.ts
└── styles/
    └── globals.css
```

---

## ⚙️ Variables d'Environnement Finales

```env
# .env.local
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=xxx
```

---

## 📞 Points Clés

✅ **Pas d'authentification** - Frontend uniquement  
✅ **Pas de API backend** - Mock data + Cloudinary uniquement  
✅ **Formulaires simples** - Champs texte, pas de CRUD  
✅ **Stockage local** - localStorage optionnel  
✅ **Cloudinary pour CVs** - Seule intégration externe  
✅ **React Hooks** - useState pour l'état local  

---

**Version:** 2.0 - Frontend Uniquement  
**Dernière mise à jour:** 9 Février 2026
