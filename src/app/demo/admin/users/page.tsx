'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiUserPlus, FiSearch, FiFilter } from 'react-icons/fi';
import UserList from '@/components/demo/UserList';
import UserRoles from '@/components/demo/UserRoles';
import LoginHistory from '@/components/demo/LoginHistory';

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez les utilisateurs et leurs accès
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Administrateur</option>
              <option value="doctor">Médecin</option>
              <option value="researcher">Chercheur</option>
              <option value="student">Étudiant</option>
            </select>
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center space-x-2"
            >
              <FiUserPlus />
              <span>Ajouter un utilisateur</span>
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des utilisateurs */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Liste des utilisateurs
                </h2>
                <FiUsers className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <UserList searchQuery={searchQuery} selectedRole={selectedRole} />
            </motion.div>
          </div>

          {/* Panneau de droite */}
          <div className="space-y-6">
            {/* Gestion des rôles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Gestion des rôles
              </h2>
              <UserRoles />
            </motion.div>

            {/* Historique des connexions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Historique des connexions
              </h2>
              <LoginHistory />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage; 