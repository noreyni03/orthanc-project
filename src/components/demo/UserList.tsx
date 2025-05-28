'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiMail, FiPhone } from 'react-icons/fi';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'doctor' | 'researcher' | 'student';
  status: 'active' | 'inactive';
  avatar: string;
  lastLogin: string;
}

interface UserListProps {
  searchQuery: string;
  selectedRole: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sophie Martin',
    email: 'sophie.martin@example.com',
    phone: '+33 6 12 34 56 78',
    role: 'doctor',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastLogin: '2024-03-15 14:30'
  },
  {
    id: '2',
    name: 'Dr. Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 6 23 45 67 89',
    role: 'researcher',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastLogin: '2024-03-15 13:45'
  },
  {
    id: '3',
    name: 'Marie Laurent',
    email: 'marie.laurent@example.com',
    phone: '+33 6 34 56 78 90',
    role: 'student',
    status: 'inactive',
    avatar: 'https://i.pravatar.cc/150?img=3',
    lastLogin: '2024-03-14 09:15'
  }
];

const UserList: React.FC<UserListProps> = ({ searchQuery, selectedRole }) => {
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'doctor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'researcher':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'student':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'doctor':
        return 'Médecin';
      case 'researcher':
        return 'Chercheur';
      case 'student':
        return 'Étudiant';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-4">
      {filteredUsers.map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {user.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs rounded ${getRoleColor(user.role)}`}>
                    {getRoleText(user.role)}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
                title="Modifier"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                title="Supprimer"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <FiMail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FiPhone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.phone}
              </span>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Dernière connexion : {user.lastLogin}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UserList; 