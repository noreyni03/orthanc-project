'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiDatabase, FiAlertCircle, FiActivity } from 'react-icons/fi';

const stats = [
  {
    id: 1,
    name: 'Utilisateurs actifs',
    value: '1,234',
    change: '+12%',
    icon: FiUsers,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20'
  },
  {
    id: 2,
    name: 'Données stockées',
    value: '2.4 TB',
    change: '+8%',
    icon: FiDatabase,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20'
  },
  {
    id: 3,
    name: 'Alertes système',
    value: '3',
    change: '-2',
    icon: FiAlertCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20'
  },
  {
    id: 4,
    name: 'Requêtes API',
    value: '45.2K',
    change: '+23%',
    icon: FiActivity,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20'
  }
];

const AdminStats = () => {
  return (
    <>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.name}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
              <p className={`text-sm font-medium mt-1 ${
                stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.change}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default AdminStats; 