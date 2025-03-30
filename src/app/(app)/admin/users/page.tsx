// src/app/(app)/admin/users/page.tsx
'use client'; // Cette page aura besoin d'état et d'interactions client

import withAuth from '@/components/withAuth';
import React, { useState, useEffect } from 'react';
// Importer les types User (potentiellement un DTO sans le mot de passe)
// import { UserAdminView } from '@/types'; // Créez ce type

// Placeholder pour le type User retourné par l'API
interface UserAdminView {
  id: string;
  name?: string | null;
  email?: string | null;
  roles: { name: string }[]; // Inclure les rôles
  enabled: boolean;
}


function AdminUsersPage() {
  const [users, setUsers] = useState<UserAdminView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Appeler l'API Route créée précédemment
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des utilisateurs');
        }
        const data: UserAdminView[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Logique de filtrage (simple exemple côté client)
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(filter.toLowerCase()) ||
    user.name?.toLowerCase().includes(filter.toLowerCase())
  );

  // --- Fonctions pour gérer la modification des rôles (à implémenter) ---
  const handleRoleChange = async (userId: string, newRoles: string[]) => {
    console.log(`Changement des rôles pour ${userId} vers ${newRoles}`);
    // TODO: Appeler l'API Route PUT/POST /api/admin/users/[userId]/roles
    // Mettre à jour l'état local des utilisateurs après succès (ou refetch)
    // Ajouter un feedback visuel (micro-animation)
  };
  // --------------------------------------------------------------------

  if (loading) return <div className="p-8 text-center">Chargement des utilisateurs...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Erreur: {error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-semibold mb-6">Gestion des Utilisateurs</h1>

      {/* Barre de filtre dynamique */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Filtrer par nom ou email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Placeholder pour le tableau/cartes utilisateurs */}
      {/* Remplacer ceci par les cartes 3D ou le tableau animé */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg">
            <p className="font-semibold">{user.name || 'N/A'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {user.roles.map(role => (
                <span key={role.name} className="text-xs font-medium px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                  {/* Ajouter icône de rôle ici */}
                  {role.name}
                </span>
              ))}
            </div>
            {/* Placeholder pour le bouton/mécanisme de modification des rôles */}
            <div className="mt-4 text-right">
               <button className="text-sm text-blue-600 hover:underline">Modifier Rôles</button>
               {/* Intégrer ici le dial circulaire ou le drag-and-drop */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Protéger la page avec le HOC en spécifiant le rôle requis
export default withAuth(AdminUsersPage, { allowedRoles: ['ADMIN'] });