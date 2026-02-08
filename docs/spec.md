Spécifications – Frontend Job Board
Module : Espace Personnel Candidat
🎯 Objectif général

Mettre en place un espace personnel candidat permettant :

la gestion des informations personnelles,

l’upload et la gestion du CV,

le suivi des candidatures envoyées.

Ces fonctionnalités doivent être accessibles uniquement aux utilisateurs authentifiés.

1️⃣ Page /profile – Informations personnelles
🎯 Objectif

Permettre au candidat de consulter et de mettre à jour son profil professionnel depuis une interface dédiée.

👤 Utilisateur concerné

Candidat connecté

📌 Fonctionnalités attendues

Affichage des informations personnelles du candidat

Modification des données du profil

Enregistrement des modifications

Affichage d’un message de succès ou d’erreur

Gestion des états de chargement

🧾 Informations à afficher / modifier

Nom et prénom

Adresse email (lecture seule ou modifiable selon choix backend)

Numéro de téléphone

Compétences

Expérience professionnelle

CV associé (si existant)

🔐 Règles d’accès

Page accessible uniquement après authentification

Redirection vers la page de connexion si l’utilisateur n’est pas connecté

✅ Résultats attendus

Les informations du candidat sont correctement affichées

Les modifications sont prises en compte et persistées via l’API

L’interface reste claire, responsive et intuitive

Aucun accès non autorisé à la page

2️⃣ Gestion du CV – Upload PDF avec Cloudinary
🎯 Objectif

Permettre au candidat d’ajouter ou de remplacer son CV au format PDF.

📂 Contraintes fonctionnelles

Format accepté : PDF uniquement

Taille maximale définie par le projet

Un seul CV actif par candidat

Le nouveau CV remplace automatiquement l’ancien

📌 Fonctionnalités attendues

Sélection d’un fichier depuis l’appareil

Vérification du format du fichier avant envoi

Upload du CV via l’API backend

Association automatique du CV au profil du candidat

Affichage d’un lien permettant de consulter le CV

👀 Comportement attendu

Affichage du nom du fichier sélectionné

Message clair en cas d’erreur (format invalide, échec upload)

Message de confirmation après upload réussi

✅ Résultats attendus

Le CV est correctement uploadé sur Cloudinary

L’URL du CV est enregistrée et accessible depuis le profil

Le candidat peut consulter son CV à tout moment

Aucun autre format que PDF n’est accepté

3️⃣ Page /applications – Historique des candidatures
🎯 Objectif

Permettre au candidat de suivre l’état de ses candidatures envoyées.

👤 Utilisateur concerné

Candidat connecté

📌 Fonctionnalités attendues

Récupération de la liste des candidatures depuis l’API

Affichage clair et structuré des candidatures

Mise en évidence du statut de chaque candidature

Gestion des états vide, chargement et erreur

🧾 Informations à afficher pour chaque candidature

Intitulé du poste

Nom de l’entreprise

Date de candidature

Statut de la candidature

🏷️ Statuts possibles

En attente

En cours

Acceptée

Refusée

Les statuts doivent être visuellement différenciés.

✅ Résultats attendus

Le candidat voit l’ensemble de ses candidatures

Les statuts sont compréhensibles et lisibles

Un message est affiché si aucune candidature n’existe

La page est accessible uniquement aux utilisateurs connectés

4️⃣ Contraintes globales
🔐 Sécurité

Toutes les pages de l’espace personnel sont protégées

Les requêtes API sont authentifiées

🎨 UX / UI

Interface simple, moderne et responsive

Feedback utilisateur systématique (succès / erreur)

Navigation fluide entre les pages

5️⃣ Livrables attendus

Page /profile fonctionnelle

Système d’upload de CV opérationnel

Page /applications fonctionnelle

Intégration complète avec l’API backend

Comportement conforme aux règles définies

🎯 Critère de validation finale

👉 Un candidat peut :

gérer son profil,

uploader et consulter son CV,

suivre ses candidatures,
sans bug, sans accès non autorisé, et avec une expérience fluide.