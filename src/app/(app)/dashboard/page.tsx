// src/app/(app)/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import withAuth from '@/components/withAuth'; // Assurez-vous que withAuth est correctement configuré

function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || session?.user?.email || 'Utilisateur';

  return (
    <div className="animate-fade-in"> {/* Animation d'apparition */}
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        Tableau de bord
      </h1>
      <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
        Bienvenue, <span className="font-semibold text-cyan-600 dark:text-cyan-400">{userName}</span> !
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder Card 1 */}
        <div className="rounded-xl bg-white dark:bg-slate-800 p-6 shadow-lg border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Statistiques Récentes</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Vos activités récentes et indicateurs clés seront affichés ici.
          </p>
          <div className="mt-4 h-32 rounded-md bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-400 dark:text-gray-500 italic">
            Graphique à venir
          </div>
        </div>

        {/* Placeholder Card 2 */}
        <div className="rounded-xl bg-white dark:bg-slate-800 p-6 shadow-lg border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Accès Rapides</h2>
          <ul className="mt-2 space-y-1 text-sm text-cyan-600 dark:text-cyan-400">
            <li><a href="/search" className="hover:underline">Nouvelle Recherche DICOM</a></li>
            <li><a href="/upload" className="hover:underline">Uploader des Images</a></li>
            <li><a href="/projects/new" className="hover:underline">Créer un Projet</a></li>
          </ul>
        </div>

        {/* Placeholder Card 3 */}
        <div className="rounded-xl bg-white dark:bg-slate-800 p-6 shadow-lg border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Aucune nouvelle notification.
          </p>
        </div>
      </div>

      <div className="mt-12 rounded-xl bg-white dark:bg-slate-800 p-6 shadow-lg border border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Plus de fonctionnalités à venir...</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Nous travaillons activement pour enrichir votre expérience sur Orthanc Project. Bientôt, vous pourrez accéder à des outils d'analyse avancés, des visualisations de données personnalisées, et bien plus encore.
        </p>
      </div>
    </div>
  );
}

// Protéger la page pour s'assurer que seuls les utilisateurs authentifiés peuvent y accéder.
// Vous pouvez spécifier des rôles si nécessaire, mais pour un dashboard général, tous les authentifiés sont OK.
export default withAuth(DashboardPage, { 
  allowedRoles: ['ADMIN', 'RADIOLOGIST', 'TECHNICIAN', 'MEDECIN', 'SECRETARY'] // Ajustez selon les rôles réellement utilisés
});