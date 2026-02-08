# 🧪 Guide de Test - Interface Frontend

## 🚀 Démarrage du Dev Server

```bash
npm run dev
```

Puis ouvre dans le navigateur :
```
http://localhost:3000
```

---

## 📌 Flux de Test Complet

### 1️⃣ Page Home (http://localhost:3000)
**Attendu** :
- Page d'accueil du Job Board
- Liens vers Login / Register
- Navigation générale

**À tester** :
- [ ] Page s'affiche correctement
- [ ] Cliquez sur "Connexion"

---

### 2️⃣ Page Login (http://localhost:3000/login)
**Attendu** :
- Formulaire de connexion
- Champs : Email, Mot de passe
- Bouton "Se connecter"

**Credentials de Test** :
```
Email : candidate@example.com
Mot de passe : password123
```

**À tester** :
- [ ] Remplissez le formulaire
- [ ] Cliquez "Se connecter"
- [ ] Cookie `token` doit être créé
- [ ] Redirection vers l'une des pages protégées

---

### 3️⃣ Page /profile (PROTÉGÉE)
**URL** : http://localhost:3000/profile

**Attendu** :

#### Header (Top)
```
┌─────────────────────────────────────────────────┐
│ Job Board                                    │
│ Espace candidat                              │
│                                              │
│ Bienvenue, candidate@example.com  [Déconnex]│
└─────────────────────────────────────────────────┘
```

#### Navigation Tabs
```
┌──────────────────────────────────┐
│  👤 Profil  │  💼 Candidatures  │
└──────────────────────────────────┘
```

#### Contenu Principal
```
📄 MON PROFIL
Gérez vos informations personnelles et professionnelles

┌─ INFORMATIONS PERSONNELLES ──────────────────────┐
│                                                 │
│ Prénom : [______________________]              │
│ Nom    : [______________________]              │
│                                                 │
│ Email  : [candidate@example.com]  (Non modif)  │
│ Tél    : [______________________]              │
│                                                 │
│ Compétences : [____________________]           │
│ (séparées par des virgules)                    │
│                                                 │
│ Expérience Professionnelle :                  │
│ [                                            ]│
│ [                                            ]│
│ [__________________________________________]│
│                                                 │
│ [ Enregistrer ] [ Annuler ]                    │
└─────────────────────────────────────────────────┘

┌─ VOTRE CV ───────────────────────────────────────┐
│ Gérez votre CV en format PDF                   │
│                                                 │
│ (Si CV existant)                               │
│ CV actuellement enregistré :                  │
│ https://cloudinary.com/...cv.pdf              │
│                                                 │
│ ┌─ UPLOAD CV ──────────────────────────────┐   │
│ │  📤                                      │   │
│ │  Cliquez pour sélectionner un fichier   │   │
│ │  ou glissez-déposez                     │   │
│ │  PDF uniquement, max 10MB               │   │
│ └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

**À tester** :

#### Test 1: Éditer le Profil
- [ ] Cliquez dans le champ "Prénom"
- [ ] Entrez : "Jean"
- [ ] Le bouton "Enregistrer" doit être activé ✅
- [ ] Le bouton "Annuler" doit être visible
- [ ] Cliquez "Enregistrer"
- [ ] Toast de succès : "Profil mis à jour avec succès" ✅
- [ ] Les données sont réaffichées

#### Test 2: Compétences
- [ ] Entrez dans le champ compétences : "React, TypeScript, Node.js"
- [ ] Cliquez "Enregistrer"
- [ ] Les compétences sont sauvegardées comme liste ✅

#### Test 3: Annuler les modifications
- [ ] Modifiez un champ
- [ ] Cliquez "Annuler"
- [ ] Les données reviennent à l'état original ✅

#### Test 4: Upload CV
- [ ] Cliquez sur la zone d'upload
- [ ] Sélectionnez un fichier PDF depuis votre ordinateur
- [ ] Le nom du fichier s'affiche avec la taille
- [ ] Cliquez "Télécharger le CV"
- [ ] Toast de succès : "CV uploadé avec succès" ✅
- [ ] L'URL du CV s'affiche dans la zone "CV actuellement enregistré"

#### Test 5: Valider le format du CV
- [ ] Essayez d'upload un fichier .docx
- [ ] Toast d'erreur : "Seuls les fichiers PDF sont acceptés" ⚠️
- [ ] Essayez un PDF > 10MB
- [ ] Toast d'erreur : "Le fichier dépasse 10MB" ⚠️

#### Test 6: États de chargement
- [ ] Pendant l'enregistrement : "Enregistrement..." 🔄
- [ ] Bouton désactivé pendant le traitement ✅

---

### 4️⃣ Page /applications (PROTÉGÉE)
**URL** : http://localhost:3000/applications

**Attendu** :

#### Header & Navigation
```
┌─────────────────────────────────────────────────┐
│ Job Board                                    │
│ Espace candidat                              │
│                                              │
│ Bienvenue, candidate@example.com  [Déconnex]│
└─────────────────────────────────────────────────┘

┌──────────────────────────────────┐
│  👤 Profil  │  💼 Candidatures  │
└──────────────────────────────────┘
```

#### Contenu Principal (Cas : Avec candidatures)
```
📋 MES CANDIDATURES
Suivi de tous vos emplois en cours de candidature

┌───────────────────────────────────────────────────┐
│ 🏢 Développeur React                           │
│    Acme Corp                                   │
│    📅 8 février 2026                           │
│                                          [⚠️ En attente]│
│    • Candidature en attente de traitement   │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│ 🏢 Developer TypeScript Senior                 │
│    Tech Solutions                              │
│    📅 5 février 2026                           │
│                                          [🔵 En cours]│
│    • Votre candidature est en cours d'examen │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│ 🏢 Full Stack Developer                        │
│    StartUp XYZ                                 │
│    📅 3 février 2026                           │
│                                       [🟢 Acceptée]│
│    • Vous avez été accepté(e) !             │
└───────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┬──────────────┐
│   3          │      1       │      1       │      0       │
│   Total      │   En attente │   En cours   │  Acceptées   │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Code Couleur des Statuts** :
```
🟡 PENDING     → Jaune (#FEF08A) - En attente
🔵 IN_PROGRESS → Bleu (#BFDBFE) - En cours
🟢 ACCEPTED    → Vert (#DCFCE7) - Acceptée
🔴 REJECTED    → Rouge (#FECACA) - Refusée
```

#### Cas : Sans candidatures
```
📋 MES CANDIDATURES

┌───────────────────────────────────────────────────┐
│                                                 │
│              💼 Aucune candidature               │
│                                                 │
│  Vous n'avez pas encore soumis de candidatures.│
│  Explorez les offres d'emploi disponibles et   │
│  commencez à postuler !                        │
│                                                 │
└───────────────────────────────────────────────────┘
```

**À tester** :

#### Test 1: Affichage des candidatures
- [ ] La page s'affiche correctement
- [ ] Les candidatures sont listées
- [ ] Les statuts sont visibles avec les bonnes couleurs
- [ ] Les dates sont au format français (ex: "8 février 2026")

#### Test 2: Statistiques
- [ ] Les cartes de statistiques au bas de la page
- [ ] Total = somme de tous les statuts
- [ ] Les chiffres sont corrects par statut

#### Test 3: Couleurs des statuts
- Vérifiez visuellement :
- [ ] PENDING : jaune
- [ ] IN_PROGRESS : bleu
- [ ] ACCEPTED : vert
- [ ] REJECTED : rouge

#### Test 4: Indicateurs de statut
- [ ] Chaque candidature a un point coloré
- [ ] Le message explique le statut

---

### 5️⃣ Navigation entre les pages

**À tester** :

#### Test 1: Navigation par Tabs
- [ ] Sur /profile : Cliquez sur "Candidatures"
  - Redirection vers /applications ✅
- [ ] Sur /applications : Cliquez sur "Profil"
  - Redirection vers /profile ✅

#### Test 2: Navigation Active
- [ ] L'onglet actif est souligné/mis en évidence

#### Test 3: Bouton Déconnexion
- [ ] Cliquez sur "Déconnexion"
- [ ] Toast : "Vous êtes déconnecté"
- [ ] Redirection vers /login ✅
- [ ] Le cookie `token` est supprimé

---

### 6️⃣ Protection des Routes (SÉCURITÉ)

**À tester** :

#### Test 1: Accès sans authentification
- [ ] Ouvrez une nouvelle fenêtre privée
- [ ] Allez sur http://localhost:3000/profile
- [ ] Redirection automatique vers /login ✅

#### Test 2: Accès avec authentification
- [ ] Connectez-vous
- [ ] Accédez à /profile
- [ ] Chargement des données ✅

#### Test 3: Lien direct après déconnexion
- [ ] Mémorisez l'URL /profile
- [ ] Déconnectez-vous
- [ ] Essayez d'accéder à /profile
- [ ] Redirection vers /login ✅

---

### 7️⃣ Gestion des États

**À tester** :

#### Test 1: État Loading
- [ ] Ouvrez /profile pour la première fois
- [ ] Spinner doit s'afficher brièvement
- [ ] Message : "Chargement du profil..."

#### Test 2: État Erreur (simulé)
- [ ] Arrêtez le serveur backend
- [ ] Rechargez /profile
- [ ] Message d'erreur : "Erreur lors du chargement du profil..."

#### Test 3: Toast Notifications
- [ ] Modifiez le profil et enregistrez
- [ ] Toast vert en haut à droite ✅
- [ ] Message à disparaît après 3-4 secondes

---

### 8️⃣ Responsive Design

**À tester sur** :

#### Mobile (375px)
```bash
Chrome DevTools → Ctrl+Shift+M
```

- [ ] Layout s'empile verticalement ✅
- [ ] Champs prennent la largeur complète
- [ ] Boutons cliquables (taille)
- [ ] Texte lisible (pas d'overflow)
- [ ] Navigation Tabs visible

#### Tablet (768px)
```bash
Chrome DevTools → iPad
```

- [ ] Grille à 2 colonnes pour les champs
- [ ] Layout optimisé
- [ ] Navigation fluide

#### Desktop (1920px)
- [ ] Maximum de 1200px de largeur (container)
- [ ] Marges confortables
- [ ] Lisibilité optimale

---

## 🔧 Points de Vérification Détaillés

### Formulaire Profil
```javascript
✅ Champs requis
  - Prénom : string, placeholder "Jean"
  - Nom : string, placeholder "Dupont"
  - Email : disabled, non modifiable
  - Téléphone : string, placeholder "+33 6 12 34 56 78"
  - Compétences : séparées par virgules
  - Expérience : textarea long

✅ Validation
  - Messages d'erreur clairs
  - Toast de succès à la sauvegarde
  - États disabled pendant le traitement

✅ Comportement
  - Bouton Enregistrer activé seulement si modification
  - Bouton Annuler réinitialise les données
  - Loading state pendant la requête API
```

### Composant CVUploader
```javascript
✅ Validation
  - Accepte seulement .pdf
  - Max 10MB
  - Messages d'erreur spécifiques

✅ Upload
  - Affiche nom + taille du fichier
  - Bouton Upload + Annuler disponibles
  - Loading pendant l'upload
  - Toast succès après upload

✅ Affichage
  - URL du CV actuel visible en haut
  - Lien cliquable vers le fichier
```

### Page Applications
```javascript
✅ Données
  - Liste complète des candidatures
  - Statuts affichés correctement
  - Dates formatées en français

✅ Statistiques
  - Total calculé
  - Compteurs par statut visibles
  - Chiffres corrects

✅ État vide
  - Message custom si 0 candidatures
  - Encouragement à postuler
```

---

## 📊 Données Mock pour Tester

Si vous avez besoin de données de test, voici la structure attendue :

### Profil Employé Test
```json
{
  "id": "candidate-123",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "candidate@example.com",
  "phone": "+33 6 12 34 56 78",
  "skills": ["React", "TypeScript", "Node.js"],
  "experience": "5 ans d'expérience...",
  "cvUrl": "https://cloudinary.com/...",
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-02-08T00:00:00Z"
}
```

### Applications de Test
```json
[
  {
    "id": "app-1",
    "jobTitle": "Développeur React",
    "companyName": "Acme Corp",
    "status": "PENDING",
    "applicationDate": "2026-02-08T10:00:00Z",
    "candidateId": "candidate-123"
  },
  {
    "id": "app-2",
    "jobTitle": "Developer TypeScript Senior",
    "companyName": "Tech Solutions",
    "status": "IN_PROGRESS",
    "applicationDate": "2026-02-05T14:30:00Z",
    "candidateId": "candidate-123"
  },
  {
    "id": "app-3",
    "jobTitle": "Full Stack Developer",
    "companyName": "StartUp XYZ",
    "status": "ACCEPTED",
    "applicationDate": "2026-02-03T09:15:00Z",
    "candidateId": "candidate-123"
  }
]
```

---

## ⚠️ Dépannage Courant

| Problème | Cause | Solution |
|----------|-------|----------|
| Redirection infinie vers /login | Token manquant | Vérifiez les cookies du navigateur |
| Formulaire ne se soumet pas | Pas de backend API | Mockez les réponses apiTest-ci |
| Dates en anglais | Locale mal configurée | Vérifiez date-fns import |
| Spinner infini | Load API timeoutant | Vérifiez les logs console |
| CV ne s'upload pas | Endpoint backend manquant | Créez l'endpoint POST /api/candidates/:id/cv |
| Page blanche | Erreur React | Ouvrez la console (F12) pour voir l'erreur |

---

## 🎯 Checklist de Test Finale

- [ ] Page /profile charge et affiche les données
- [ ] Peut éditer tous les champs sauf email
- [ ] Peut upload un PDF (valide le format/taille)
- [ ] Page /applications affiche la liste des candidatures
- [ ] Statuts sont colorés correctement
- [ ] Navigation entre les pages fonctionne
- [ ] Bouton déconnexion redirige vers login
- [ ] Protection des routes fonctionne (sans token → login)
- [ ] Responsive design OK (mobile/tablet/desktop)
- [ ] Toast notifications affichées correctement
- [ ] Pas d'erreurs en console (F12)

---

## 💡 Conseils pour Tester

1. **Ouvrez la Console** : F12 → Console
   - Vérifiez qu'il n'y a pas d'erreurs
   - Regardez les logs des appels API

2. **Vérifiez les Cookies** : F12 → Application → Cookies
   - Vérifiez que `token` existe après connexion
   - Vérifiez qu'il disparaît après déconnexion

3. **Vérifiez Network** : F12 → Network
   - Voyez les requêtes API qui sont faites
   - Vérifiez les réponses

4. **Testez en Mode Privé** : Ctrl+Shift+Del
   - Vérifie que la redirection vers login fonctionne

---

**Prêt à tester ? Lancez le dev server et commencez ! 🚀**
