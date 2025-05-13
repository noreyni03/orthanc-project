// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiSearch,
  FiUploadCloud,
  FiUsers,
  FiLogOut,
  FiBriefcase,
  FiSettings, // Ajout pour Paramètres (exemple)
  FiHelpCircle, // Ajout pour Aide (exemple)
} from 'react-icons/fi';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { motion } from 'framer-motion'; // Pour d'éventuelles animations

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, exact = false }) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150
                  ${isActive ? 'bg-cyan-600/20 text-cyan-300 shadow-sm border border-cyan-500/30' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}
    >
      <Icon className={`h-5 w-5 mr-3 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-gray-200'}`} />
      <span className="truncate">{label}</span>
    </Link>
  );
};


export default function Sidebar() {
  const { data: session } = useSession();
  const user = session?.user;

  // Construction dynamique des items de navigation
  let navItems = [
    { href: '/dashboard', icon: FiHome, label: 'Tableau de bord', exact: true },
    { href: '/search', icon: FiSearch, label: 'Recherche DICOM' },
    { href: '/upload', icon: FiUploadCloud, label: 'Upload DICOM' },
    { href: '/projects', icon: FiBriefcase, label: 'Mes Projets' },
  ];

  // Logique pour ajouter le lien Admin si l'utilisateur a le rôle 'ADMIN'
  // Ceci est la manière correcte d'implémenter la conditionnalité
  if (user?.roles?.includes('ADMIN')) {
    navItems.push({ href: '/admin/users', icon: FiUsers, label: 'Administration' });
  }

  // Liens additionnels pour la configuration et l'aide (peuvent être placés différemment)
  const utilityNavItems = [
    { href: '/settings', icon: FiSettings, label: 'Paramètres' }, // Page à créer
    { href: '/help', icon: FiHelpCircle, label: 'Aide & Support' }, // Page à créer
  ];


  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r border-slate-700 bg-slate-800 shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0"> {/* z-40 pour être au-dessus du contenu principal mais potentiellement sous des modales */}
      {/* Logo/Header de la Sidebar */}
      <div className="flex h-16 flex-shrink-0 items-center justify-center border-b border-slate-700 px-4">
        <Link href="/dashboard" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-cyan-400 group-hover:animate-pulse-medical-glow"> {/* Logo un peu plus grand */}
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-5 4 5h-3v4H11z" />
          </svg>
          <span className="font-bold text-xl text-white">Orthanc Project</span> {/* Texte un peu plus grand */}
        </Link>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar"> {/* Ajout de custom-scrollbar */}
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>

      {/* Liens utilitaires séparés */}
      <div className="flex-shrink-0 border-t border-slate-700 p-4 space-y-1.5">
        {utilityNavItems.map((item) => (
            <NavItem key={item.label} {...item} />
        ))}
      </div>

      {/* Section Utilisateur en bas */}
      {user && (
        <div className="flex-shrink-0 border-t border-slate-700 p-4">
          <Link href="/profile" className="block group mb-3"> {/* Lien vers profil */}
            <div className="flex items-center p-2 rounded-md group-hover:bg-slate-700 transition-colors">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'Avatar'}
                  width={40} // Légèrement plus grand
                  height={40}
                  className="h-10 w-10 rounded-full ring-2 ring-offset-2 ring-offset-slate-800 ring-cyan-500" // Style d'anneau amélioré
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-md font-semibold text-cyan-300 ring-2 ring-offset-2 ring-offset-slate-800 ring-cyan-500">
                  {user.name?.substring(0, 1).toUpperCase() || user.email?.substring(0, 1).toUpperCase()}
                </div>
              )}
              <div className="ml-3 min-w-0">
                <p className="truncate text-sm font-semibold text-white group-hover:text-cyan-300">{user.name || 'Utilisateur'}</p>
                <p className="truncate text-xs text-gray-400 group-hover:text-gray-300">{user.email}</p>
              </div>
            </div>
          </Link>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signOut({ callbackUrl: '/' })}
            className="group flex w-full items-center justify-center rounded-md bg-red-600/20 border border-red-500/30 px-3 py-2.5 text-sm font-medium text-red-300 hover:bg-red-500/30 hover:text-red-200 transition-all duration-150"
          >
            <FiLogOut className="mr-2 h-5 w-5 text-red-400 group-hover:text-red-300" />
            Déconnexion
          </motion.button>
        </div>
      )}
    </aside>
  );
}

// Optionnel : Ajoutez ceci à votre globals.css pour une scrollbar personnalisée pour la sidebar si souhaité
/*
@layer utilities {
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: theme('colors.slate.700');
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: theme('colors.slate.500');
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: theme('colors.slate.400');
  }
}
*/