# 🧪 Guide de Test du Dashboard Admin - Phases 1 & 2

## 📋 **État Actuel**

✅ **Phases 1 & 2 : COMPLÈTES**
- Dashboard avec statistiques
- AdminSidebar avec navigation
- Layout admin protégé
- Mock data intégrées
- Mode test + Backend real switchable

❌ **Phases 3, 4, 5 : NON IMPLÉMENTÉES** (à venir)
- CRUD Jobs
- Gestion Candidats

---

## 🚀 **ACCÈS RAPIDE AU DASHBOARD**

### **Route :**
```
/admin/dashboard              ← Dashboard complet
/admin                        ← Redirige vers dashboard
```

### **Prérequis :**
- ✅ Être connecté (avoir un token)
- ✅ Avoir le role `ADMIN` (défini en cookie `userRole`)
- ❌ Sinon → redirection `/login`

---

## 🎯 **DÉMARRER LES TESTS**

### **Étape 1 : Lancer le dev server**
```bash
npm run dev
```

### **Étape 2 : Se connecter en tant qu'admin**
- Créer un compte avec role `ADMIN`
- Ou récupérer des credentials admin existants

### **Étape 3 : Accéder au dashboard**
```
http://localhost:3000/admin/dashboard
```

### **Résultat :**
🎉 Vous verrez le dashboard avec :
- Sidebar de navigation (gauche)
- 8 cartes de statistiques
- Badge "Mode Test (Mock Data)" (haut droit)
- Bouton "Basculer" pour tester backend réel

---

## 📊 **DATA MOCK ACTUELLES**

**Fichier :** `src/lib/mockStats.ts`

```typescript
mockDashboardStats = {
  totalUsers: 125,
  totalCandidates: 98,
  totalAdmins: 27,
  totalJobs: 42,
  activeJobs: 35,
  totalApplications: 456,
  applicationsByStatus: {
    PENDING: 145,
    IN_PROGRESS: 189,
    ACCEPTED: 89,
    REJECTED: 33,
  },
  jobsPostedThisMonth: 12,
  applicationsThisMonth: 145,
  averageApplicationsPerJob: 10.8,
}
```

### **Modifier les données pour tester :**
1. Ouvrir `src/lib/mockStats.ts`
2. Changer les valeurs
3. Rafraîchir le navigateur (F5)

---

## 🎨 **COMPOSANTS DISPONIBLES**

### **StatisticsCard** (`src/components/admin/StatisticsCard.tsx`)
```typescript
<StatisticsCard
  label="Total Utilisateurs"
  value={125}
  icon={<Users size={24} />}
  color="blue"
  trend={+5}  // optionnel : tendance en %
/>
```

### **AdminSidebar** (`src/components/admin/AdminSidebar.tsx`)
- Navigation automatique
- Active state highlight
- Bouton déconnexion

---

## 🧪 **CHECKLIST DE TEST UI/UX**

- [ ] Accès : `/admin/dashboard` charge sans erreur
- [ ] Sidebar : Les 3 items sont visibles (Dashboard, Offres, Candidats)
- [ ] Cartes : 8 cartes de stats affichées
- [ ] Chiffres : Formatés en français (1 234 au lieu de 1234)
- [ ] Icônes : Lucide React icons visibles
- [ ] Couleurs : 6 couleurs différentes pour les cartes
- [ ] Badge : "Mode Test" affiche correctement
- [ ] Bouton : "Basculer" permet de switcher mock ↔ backend
- [ ] Dark mode : Cmd+K pour tester les thèmes
- [ ] Responsive : DevTools (F12) + redimensionner
  - 4 colonnes sur desktop
  - 2 colonnes sur tablet
  - 1 colonne sur mobile
- [ ] Loading : Skeleton loader apparaît pendant chargement
- [ ] Déconnexion : Bouton logout fonctionnel

---

## 🔐 **SÉCURITÉ & MIDDLEWARE**

**Fichier :** `middleware.ts`

**Fonctionnement :**
```typescript
GET /admin/* 
  → Vérifier token en cookie
  → Vérifier userRole === 'ADMIN'
  → Si OK → Continuer
  → Si KO → Redirection /login ou /
```

**Tester la sécurité :**
1. Accéder à `/admin/dashboard` SANS token
   → Redirection vers `/login` ✓
2. Accéder AVEC token mais role !== 'ADMIN'
   → Redirection vers `/` ✓
3. Accéder AVEC token + role ADMIN
   → Dashboard affichée ✓

---

## 🔄 **MODE TEST vs BACKEND RÉEL**

### **Mode Test (Actuellement actif)**
```typescript
// src/app/(admin)/dashboard/page.tsx - Ligne 17
const USE_MOCK_DATA = true;  // ✅ Données locales
```

**Avantages :**
- Aucun backend nécessaire
- Données instantanées
- Parfait pour UI/UX testing

**Désavantage :**
- Pas de vrai données serveur

### **Mode Backend Réel**
```typescript
const USE_MOCK_DATA = false;  // Appel API
```

**Nécessite :**
- Backend lancé
- Endpoint `GET /admin/dashboard/stats` implémenté
- Réponse JSON structurée comme `DashboardStats`

**Switcher avec le bouton :**
- Badge en haut à droit "Mode Test (Mock Data)"
- Bouton "Basculer" pour tester les 2 modes

---

## 🛠️ **DÉPANNAGE**

### ❌ "404 Not Found"
**Cause :** Pas connecté ou pas admin
**Solution :** 
- Vérifier que vous avez un token
- Vérifier le role `ADMIN`
- Se reconnecter

### ❌ "Carte vide / Pas de données"
**Cause :** Mock mode désactivé et backend inaccessible
**Solution :**
- Vérifier `USE_MOCK_DATA = true`
- Ou lancer le backend
- Cliquer "Basculer" entre les modes

### ❌ "Erreur de console"
**Solutions :**
- F12 → Console → Vérifier les erreurs
- Rafraîchir (Ctrl+Shift+R)
- Vérifier `src/lib/mockStats.ts` valide

---

## 📁 **STRUCTURE DE FICHIERS**

```
src/app/(admin)/
├── layout.tsx                   # Layout admin avec sidebar
├── page.tsx                     # Redirection vers dashboard
└── dashboard/
    └── page.tsx                 # Dashboard page

src/components/admin/
├── AdminSidebar.tsx             # Navigation sidebar
└── StatisticsCard.tsx           # Carte statistique réutilisable

src/lib/
├── mockStats.ts                 # Mock data dashboard
├── types.ts                     # Types Job, Dashboard, etc
├── api.ts                       # Client API (adminApi)
└── store.ts                     # Auth Zustand store

middleware.ts                    # Vérification token + role
```

---

## ✨ **PROCHAINES ÉTAPES POSSIBLES**

**Phase 3 (CRUD Jobs) :**
- [ ] Pages listing / create / edit / delete offres
- [ ] JobForm component
- [ ] Mock data jobs

**Phase 4 (Gestion Candidats) :**
- [ ] Pages listing / détail candidats
- [ ] Changement de statut
- [ ] Notes internes

**Phase 5 (Polish) :**
- [ ] Tests automatisés
- [ ] Performance optimization
- [ ] Exportation data (CSV)

---

## 📞 **SUPPORT**

Besoin d'aide ?
- Vérifier ce guide de test
- Consulter [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- Vérifier les logs console (F12)
