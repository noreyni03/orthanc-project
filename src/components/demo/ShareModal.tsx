'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUserPlus, FiLock, FiUnlock, FiClock, FiCalendar } from 'react-icons/fi';

interface SharedItem {
  id: string;
  name: string;
  type: 'dicom' | 'model' | 'notebook' | 'project';
  sharedWith: {
    id: string;
    name: string;
    email: string;
    role: 'viewer' | 'editor' | 'admin';
    avatar: string;
  }[];
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canShare: boolean;
    canDelete: boolean;
  };
  sharedBy: {
    id: string;
    name: string;
    avatar: string;
  };
  sharedAt: string;
  expiresAt?: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: SharedItem | null;
  onShare: (shareData: {
    users: string[];
    permissions: {
      canView: boolean;
      canEdit: boolean;
      canShare: boolean;
      canDelete: boolean;
    };
    expiresAt?: string;
  }) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  item,
  onShare
}) => {
  const [userInput, setUserInput] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [permissions, setPermissions] = useState({
    canView: true,
    canEdit: false,
    canShare: false,
    canDelete: false
  });
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [role, setRole] = useState<'viewer' | 'editor' | 'admin'>('viewer');

  const handleAddUser = () => {
    if (userInput.trim() && !selectedUsers.includes(userInput.trim())) {
      setSelectedUsers([...selectedUsers, userInput.trim()]);
      setUserInput('');
    }
  };

  const handleRemoveUser = (userToRemove: string) => {
    setSelectedUsers(selectedUsers.filter(user => user !== userToRemove));
  };

  const handleRoleChange = (newRole: 'viewer' | 'editor' | 'admin') => {
    setRole(newRole);
    switch (newRole) {
      case 'viewer':
        setPermissions({
          canView: true,
          canEdit: false,
          canShare: false,
          canDelete: false
        });
        break;
      case 'editor':
        setPermissions({
          canView: true,
          canEdit: true,
          canShare: false,
          canDelete: false
        });
        break;
      case 'admin':
        setPermissions({
          canView: true,
          canEdit: true,
          canShare: true,
          canDelete: true
        });
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShare({
      users: selectedUsers,
      permissions,
      expiresAt: expiresAt || undefined
    });
    // Réinitialiser le formulaire
    setSelectedUsers([]);
    setPermissions({
      canView: true,
      canEdit: false,
      canShare: false,
      canDelete: false
    });
    setExpiresAt('');
    setRole('viewer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-slate-900 dark:bg-opacity-75"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-xl rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {item ? 'Modifier le partage' : 'Nouveau partage'}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Utilisateurs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Utilisateurs
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      <input
                        type="email"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUser())}
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        placeholder="email@exemple.com"
                      />
                      <button
                        type="button"
                        onClick={handleAddUser}
                        className="p-2 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                      >
                        <FiUserPlus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedUsers.map(user => (
                        <span
                          key={user}
                          className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400"
                        >
                          {user}
                          <button
                            type="button"
                            onClick={() => handleRemoveUser(user)}
                            className="ml-1 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rôle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rôle
                    </label>
                    <div className="mt-1 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleRoleChange('viewer')}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          role === 'viewer'
                            ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}
                      >
                        <FiUnlock className="w-4 h-4 inline-block mr-1" />
                        Lecteur
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleChange('editor')}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          role === 'editor'
                            ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}
                      >
                        <FiEdit2 className="w-4 h-4 inline-block mr-1" />
                        Éditeur
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleChange('admin')}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          role === 'admin'
                            ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}
                      >
                        <FiLock className="w-4 h-4 inline-block mr-1" />
                        Admin
                      </button>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Permissions
                    </label>
                    <div className="mt-1 space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permissions.canView}
                          onChange={(e) => setPermissions({ ...permissions, canView: e.target.checked })}
                          className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Lecture
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permissions.canEdit}
                          onChange={(e) => setPermissions({ ...permissions, canEdit: e.target.checked })}
                          className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Édition
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permissions.canShare}
                          onChange={(e) => setPermissions({ ...permissions, canShare: e.target.checked })}
                          className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Partage
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permissions.canDelete}
                          onChange={(e) => setPermissions({ ...permissions, canDelete: e.target.checked })}
                          className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Suppression
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Date d'expiration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date d'expiration (optionnel)
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-md"
                  >
                    {item ? 'Mettre à jour' : 'Partager'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal; 