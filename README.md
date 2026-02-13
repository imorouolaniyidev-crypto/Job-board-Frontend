This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
## En local créer un fichier .env.local   a jouter NEXT_PUBLIC_API_URL=http://localhost:3000/api    Le choix de ne pas exposer le token dans le frontend et de l’envoyer plutôt en cookie httpOnly vient de la sécurité :

1️⃣ Pourquoi pas stocker le token dans le frontend (localStorage/sessionStorage) ?

Si tu mets le token dans localStorage ou sessionStorage, tout script côté client peut y accéder.

Si une faille XSS se produit, un attaquant peut le voler et se connecter à la place de l’utilisateur. ⚠️

2️⃣ Pourquoi utiliser cookie httpOnly ?

Le cookie httpOnly est inaccessible au JS côté client

Le navigateur l’envoie automatiquement avec chaque requête vers ton API

Tu peux donc authentifier l’utilisateur côté serveur sans exposer le token

3️⃣ Comment le frontend sait si l’utilisateur est connecté ?

Le backend a une route comme /auth/me qui lit le cookie httpOnly et renvoie les infos de l’utilisateur (id, email, role)

Le frontend ne touche jamais au token, il stocke seulement les infos renvoyées (user) dans un state comme Zustand

Ensuite, la navbar peut vérifier if (user) pour afficher les liens conditionnels