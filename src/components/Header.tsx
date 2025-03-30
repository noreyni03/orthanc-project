// src/components/Header.tsx
'use client'; // Nécessaire pour utiliser useSession

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();
  const user = session?.user;

  // Fonction pour déterminer la classe de la bordure/badge en fonction du rôle
  const getRoleStyle = (roles: string[] | undefined): string => {
    if (!roles || roles.length === 0) return 'border-gray-500'; // Défaut
    if (roles.includes('ADMIN')) return 'border-red-500 shadow-red-500/50'; // Exemple Admin
    if (roles.includes('RADIOLOGIST')) return 'border-blue-500 shadow-blue-500/50'; // Exemple Radio
    if (roles.includes('TECHNICIAN')) return 'border-green-500 shadow-green-500/50'; // Exemple Tech
    // Ajouter d'autres rôles
    return 'border-gray-500';
  };

  const roleBorderStyle = getRoleStyle(user?.roles);

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--background)]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo avec animation de lueur */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* Placeholder pour le logo SVG ou Image */}
          <svg /* Votre SVG logo ici */ width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-cyan-500 group-hover:animate-pulse-medical-glow">
             {/* ... chemins svg ... */}
          </svg>
          <span className="font-bold text-lg text-[var(--foreground)]">Orthanc Project</span>
        </Link>

        {/* Authentification / Utilisateur */}
        <div className="flex items-center gap-4">
          {status === 'loading' && (
            // Animation "pulsation cardiaque" minimaliste
            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse-heartbeat"></div>
          )}

          {status === 'unauthenticated' && (
            <button
              onClick={() => signIn('google')}
              className="px-4 py-2 border border-cyan-500 text-cyan-500 rounded-full text-sm font-medium hover:bg-cyan-500 hover:text-white transition-all duration-300 animate-fade-in" // Animation d'apparition
            >
              Se connecter avec Google
            </button>
          )}

          {status === 'authenticated' && user && (
            <div className="flex items-center gap-3 animate-fade-in">
              {/* Badge/Nom Utilisateur */}
              <span className={`text-sm font-medium px-3 py-1 rounded-full text-white ${roleBorderStyle.replace('border-', 'bg-').split(' ')[0]}`}> {/* Badge coloré */}
                 {user.name || user.email}
              </span>
              {/* Image Profil */}
              {user.image ? (
                 <Image
                   src={user.image}
                   alt={user.name || 'Avatar'}
                   width={32}
                   height={32}
                   className={`rounded-full border-2 ${roleBorderStyle} shadow-md`} // Bordure liée au rôle
                 />
               ) : (
                 <div className={`w-8 h-8 rounded-full border-2 ${roleBorderStyle} bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-300`}>
                   {/* Initiales si pas d'image */}
                   {user.name?.substring(0, 1).toUpperCase() || user.email?.substring(0, 1).toUpperCase()}
                 </div>
              )}
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
                title="Déconnexion"
              >
                 {/* Icône de déconnexion (ex: SVG) */}
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                 </svg>
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

// Ajouter les keyframes pour les animations dans globals.css:
// @keyframes pulse-medical-glow { ... }
// @keyframes pulse-heartbeat { ... }
// @keyframes fade-in { ... }