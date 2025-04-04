// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Option activée par défaut
  images: {
    // Configuration pour autoriser les images externes
    remotePatterns: [
      {
        protocol: 'https', // Protocol utilisé par les images Google
        hostname: 'lh3.googleusercontent.com', // Nom d'hôte pour les images de profil Google
        // port: '', // Le port par défaut (443 pour https) est implicite
        // pathname: '/a/**', // Optionnel: Pour restreindre les chemins si nécessaire
      },
      // Ajoutez ici d'autres objets si vous utilisez d'autres sources d'images externes
      // Exemple:
      // {
      //   protocol: 'https',
      //   hostname: 'autre-domaine.com',
      // },
    ],
  },
  // Ajoutez d'autres options de configuration Next.js ici si nécessaire
  // Exemple:
  // env: {
  //   MY_VAR: process.env.MY_VAR,
  // },
};

// Utiliser export default car c'est un module ES (.mjs)
export default nextConfig;