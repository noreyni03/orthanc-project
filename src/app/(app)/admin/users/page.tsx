// src/app/(app)/admin/users/page.tsx
'use client';

// import withAuth from '@/components/withAuth';
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Image component

// Define interfaces for the data structures
interface Role {
  id: number;
  name: string;
}

interface UserAdminView {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  roles: Role[];
  enabled: boolean;
  provider: string;
  createdAt: string;
}

function AdminUsersPage() {
  const [users, setUsers] = useState<UserAdminView[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  // --- State for Editing Roles ---
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Record<number, boolean>>({});
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  // Fetch initial data (users and roles)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usersResponse, rolesResponse] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/roles') // Fetch all roles
        ]);

        if (!usersResponse.ok) {
          throw new Error(`Erreur lors de la récupération des utilisateurs (${usersResponse.status})`);
        }
        if (!rolesResponse.ok) {
           throw new Error(`Erreur lors de la récupération des rôles (${rolesResponse.status})`);
         }

        const usersData: UserAdminView[] = await usersResponse.json();
        const rolesData: Role[] = await rolesResponse.json();

        setUsers(usersData);
        setAllRoles(rolesData);

      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue');
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter users based on input
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(filter.toLowerCase()) ||
    user.name?.toLowerCase().includes(filter.toLowerCase())
  );

  // --- Role Editing Handlers ---

  const handleEditClick = (user: UserAdminView) => {
    setEditingUserId(user.id);
    // Initialize selectedRoles based on the user's current roles
    const initialSelected: Record<number, boolean> = {};
    allRoles.forEach(role => {
      initialSelected[role.id] = user.roles.some(userRole => userRole.id === role.id);
    });
    setSelectedRoles(initialSelected);
  };

  const handleCancelClick = () => {
    setEditingUserId(null);
    setSelectedRoles({});
  };

  const handleRoleCheckboxChange = (roleId: number, isChecked: boolean) => {
    setSelectedRoles(prev => ({
      ...prev,
      [roleId]: isChecked,
    }));
  };

  const handleSaveRoles = async () => {
     if (!editingUserId) return;

     setSavingUserId(editingUserId); // Show saving indicator for this user
     setError(null); // Clear previous errors

     const selectedRoleIds = Object.entries(selectedRoles)
       .filter(([_, isSelected]) => isSelected)
       .map(([roleId]) => parseInt(roleId, 10)); // Get array of selected role IDs (as numbers)

     try {
       const response = await fetch(`/api/admin/users/${editingUserId}`, {
         method: 'PUT',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ roleIds: selectedRoleIds }), // Send the array of IDs
       });

       if (!response.ok) {
         let errorMsg = `Erreur lors de la mise à jour (${response.status})`;
         try {
             const errData = await response.json();
             errorMsg = errData.message || errorMsg;
         } catch(e) { /* ignore */ }
         throw new Error(errorMsg);
       }

       const updatedUser: UserAdminView = await response.json();

       // Update the user list locally for immediate feedback
       setUsers(prevUsers => prevUsers.map(user =>
         user.id === updatedUser.id ? updatedUser : user
       ));

       setEditingUserId(null); // Exit editing mode
       setSelectedRoles({});

     } catch (err: any) {
       setError(err.message || 'Erreur serveur lors de la sauvegarde.');
       console.error("Save roles error:", err);
     } finally {
       setSavingUserId(null); // Hide saving indicator
     }
   };

  // --- Render Logic ---

  if (loading) return <div className="p-8 text-center text-gray-400">Chargement des données...</div>;
  if (error && users.length === 0) return <div className="p-8 text-center text-red-500">Erreur: {error}</div>; // Show error prominently if loading failed

  return (
    <div className="container mx-auto p-4 md:p-8 text-[var(--foreground)]">
      <h1 className="text-3xl font-semibold mb-6 text-white">Gestion des Utilisateurs</h1>

      {/* Filter Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Filtrer par nom ou email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/2 lg:w-1/3 px-4 py-2 border rounded-lg bg-slate-700/50 border-slate-600 focus:border-cyan-500 focus:ring-cyan-500 focus:outline-none text-white placeholder-gray-400"
        />
      </div>

      {/* Display general error messages here */}
      {error && !savingUserId && (
          <div className="mb-4 rounded-md border border-red-500/50 bg-red-900/20 p-3 text-center text-sm text-red-400">
              {error}
          </div>
       )}

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length === 0 && !loading && (
            <p className="text-gray-400 md:col-span-2 lg:col-span-3 text-center">Aucun utilisateur trouvé.</p>
        )}
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-lg p-5 border border-slate-700 transition-all duration-300 ${editingUserId === user.id ? 'ring-2 ring-cyan-500' : 'hover:shadow-cyan-500/20'}`}
          >
            {/* User Info Section */}
            <div className="flex items-center mb-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'Avatar'}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-4 border-2 border-slate-600"
                />
              ) : (
                <div className="w-12 h-12 rounded-full mr-4 bg-slate-700 flex items-center justify-center text-xl font-semibold text-cyan-400 border-2 border-slate-600">
                  {user.name?.substring(0, 1).toUpperCase() || user.email?.substring(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-white truncate" title={user.name || user.email || ''}>
                  {user.name || <span className='italic text-gray-400'>Sans nom</span>}
                </p>
                <p className="text-sm text-gray-400 truncate" title={user.email || ''}>{user.email}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${user.enabled ? 'bg-green-800/50 text-green-300' : 'bg-red-800/50 text-red-300'}`}>
                    {user.enabled ? 'Activé' : 'Désactivé'}
                </span>
                 <span className="text-xs px-2 py-0.5 rounded-full mt-1 ml-1 inline-block bg-slate-700 text-gray-300 capitalize">
                    {user.provider}
                 </span>
              </div>
            </div>

            {/* Roles Section (Display or Edit) */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Rôles :</h4>
              {editingUserId === user.id ? (
                // --- EDITING MODE ---
                <div className="space-y-2">
                  {allRoles.map(role => (
                    <label key={role.id} className="flex items-center space-x-2 cursor-pointer text-sm text-gray-300 hover:text-white">
                      <input
                        type="checkbox"
                        className="rounded border-gray-500 text-cyan-600 focus:ring-cyan-500 bg-slate-600"
                        checked={selectedRoles[role.id] || false}
                        onChange={(e) => handleRoleCheckboxChange(role.id, e.target.checked)}
                        disabled={savingUserId === user.id}
                      />
                      <span>{role.name}</span>
                    </label>
                  ))}
                   {/* Display specific saving error here */}
                   {error && savingUserId === user.id && (
                       <p className="mt-2 text-xs text-red-400">{error}</p>
                    )}
                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-700">
                    <button
                      onClick={handleCancelClick}
                      disabled={savingUserId === user.id}
                      className="px-3 py-1 rounded-md text-xs bg-slate-600 hover:bg-slate-500 text-gray-200 transition disabled:opacity-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveRoles}
                      disabled={savingUserId === user.id}
                      className="px-3 py-1 rounded-md text-xs bg-cyan-600 hover:bg-cyan-700 text-white transition disabled:opacity-50 flex items-center"
                    >
                      {savingUserId === user.id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sauv...
                          </>
                      ) : (
                          'Sauvegarder'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                // --- DISPLAY MODE ---
                <div className="flex flex-wrap gap-1 min-h-[40px] items-center"> {/* Min height to prevent layout shifts */}
                  {user.roles.length > 0 ? (
                    user.roles.map(role => (
                      <span key={role.id} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-cyan-900/70 text-cyan-200 whitespace-nowrap">
                        {role.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs italic text-gray-500">Aucun rôle</span>
                  )}
                  {/* Edit Button (only shown if not editing) */}
                   <button
                     onClick={() => handleEditClick(user)}
                     className="ml-auto text-xs text-cyan-400 hover:text-cyan-300 transition"
                     title="Modifier les rôles"
                   >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Protéger la page avec le HOC
export default AdminUsersPage;