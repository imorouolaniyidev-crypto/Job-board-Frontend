# Resume - Gestion des photos de profil

## Objectif
Assurer l'affichage de la photo:
- dans la liste des candidats (`/candidats`)
- dans le profil de l'utilisateur connecte (`/profile`)

## Analyse de la cause initiale
- Le champ photo etait selectionne dans `ProfileForm`, mais n'etait pas toujours exploite dans tout le flux.
- Cote liste candidats, l'affichage depend de `candidate.photo` uniquement.
- Si l'API renvoyait un autre nom de champ (`avatar`, `profile_picture`, `image`) ou un simple nom de fichier (`photo.jpg`), l'image pouvait casser ou ne pas s'afficher.
- Cote profil connecte, le formulaire affichait surtout la photo "en attente" (fichier local), pas clairement la photo deja enregistree.

## Corrections appliquees

### 1) Envoi photo jusqu'au backend
- `src/app/(protected)/profile/page.tsx`
  - propagation de `photoFile` jusqu'a `profileApi.updateMyProfile(...)`.
- `src/lib/api.ts`
  - `updateMyProfile(payload, cvFile, photoFile)`
  - ajout de `formData.append('photo', photoFile)` si present.

### 2) Normalisation des champs photo retour API
- `src/lib/api.ts`
  - ajout d'une resolution d'URL robuste: `resolveApiAssetUrl(...)`
  - support des cles:
    - `photo`, `photo_url`, `photoUrl`
    - `profile_photo`, `profilePhoto`
    - `profile_picture`, `profilePicture`
    - `image`, `image_url`, `imageUrl`
    - `avatar`, `avatar_url`, `avatarUrl`
  - si la valeur est un nom de fichier seul (ex: `abc.jpg`), conversion en URL `.../uploads/abc.jpg`.

### 3) Affichage fiable dans la liste candidats
- `src/app/candidats/page.js`
  - affichage:
    - `src={candidate.photo || "/default-avatar.png"}`
    - fallback `onError` vers `"/default-avatar.png"`.

### 4) Affichage fiable dans le profil connecte
- `src/components/profile/ProfileForm.tsx`
  - ajout d'un apercu photo:
    - photo en attente (fichier local)
    - ou photo deja enregistree (`formData.photo_url`)
  - ajout fallback image (`/default-avatar.png`) en cas d'URL invalide.
  - bouton d'upload adapte:
    - "selectionner une photo" si vide
    - "remplacer la photo" si deja presente.

### 5) Types et donnees par defaut
- `src/lib/types.ts`
  - `UserProfile`: `photo_url`, `photo_filename`
  - `Candidate`: `photo`
- `src/lib/mockData.ts`
  - ajout `photo_url`, `photo_filename` dans le profil par defaut.

## Resultat attendu
- Si une photo est fournie et que le backend la persiste/expose correctement:
  - elle s'affiche sur `/profile` (utilisateur connecte)
  - elle s'affiche sur `/candidats`.
- Si la photo est absente ou URL invalide:
  - un avatar par defaut est affiche au lieu d'une image casse.

## Point de verification backend
- Le backend doit exposer la photo dans la reponse de `/public/profiles` (directement ou via un champ supporte par la normalisation).
- Le fichier doit etre servi publiquement (souvent sous `/uploads/...`).

## Analyse backend (Job-board-Backend)
- Dossier et upload verifies:
  - `src/config/multer.js` stocke bien les photos dans `uploads/photos`.
  - `src/controllers/profileController.js` enregistre bien `photo` avec un chemin de type `/uploads/photos/...`.
  - `src/controllers/profileController.js` expose bien `photo` dans `getPublicProfiles`.
- Cause backend principale identifiee:
  - `src/app.js` ne servait pas le dossier `uploads` en statique.
  - Resultat: URL photo presente en base, mais inaccessible en HTTP.
- Correction backend appliquee:
  - `src/app.js`: ajout `app.use("/uploads", express.static(...))`.
  - `src/app.js`: configuration Helmet ajustee pour autoriser le chargement cross-origin des ressources (`crossOriginResourcePolicy: "cross-origin"`), utile quand front et back tournent sur des ports differents.

## Action obligatoire apres correction backend
- Redemarrer le serveur backend pour appliquer la nouvelle config Express.
