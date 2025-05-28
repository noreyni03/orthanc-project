'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiUser, FiBook, FiGraduationCap } from 'react-icons/fi';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  icon: any;
  color: string;
  bgColor: string;
  userCount: number;
}

const roles: Role[] = [
  {
    id: 'admin',
    name: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités',
    permissions: [
      'Gestion des utilisateurs',
      'Configuration système',
      'Gestion des données',
      'Accès aux rapports'
    ],
    icon: FiShield,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    userCount: 2
  },
  {
    id: 'doctor',
    name: 'Médecin',
    description: 'Accès aux données médicales et aux outils d\'analyse',
    permissions: [
      'Visualisation des données',
      'Annotations médicales',
      'Rapports cliniques',
      'Collaboration'
    ],
    icon: FiUser,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    userCount: 15
  },
  {
    id: 'researcher',
    name: 'Chercheur',
    description: 'Accès aux données de recherche et aux outils d\'analyse avancés',
    permissions: [
      'Analyse de données',
      'Export de données',
      'Création de modèles',
      'Collaboration'
    ],
    icon: FiBook,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    userCount: 8
  },
  {
    id: 'student',
    name: 'Étudiant',
    description: 'Accès limité aux données et outils d\'apprentissage',
    permissions: [
      'Visualisation des données',
      'Accès aux tutoriels',
      'Exercices pratiques',
      'Collaboration limitée'
    ],
    icon: FiGraduationCap,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    userCount: 25
  }
];

const UserRoles = () => {
  return (
    <div className="space-y-4">
      {roles.map((role, index) => (
        <motion.div
          key={role.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-lg ${role.bgColor}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <role.icon className={`w-6 h-6 ${role.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-medium ${role.color}`}>
                  {role.name}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {role.userCount} utilisateurs
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {role.description}
              </p>
              <div className="mt-2">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Permissions :
                </h4>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  {role.permissions.map((permission, i) => (
                    <li key={i} className="flex items-center space-x-1">
                      <span className="w-1 h-1 rounded-full bg-gray-400" />
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UserRoles; 