'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const alerts = [
  {
    id: 1,
    type: 'error',
    title: 'Espace disque critique',
    message: 'L\'espace disque atteint 90% de sa capacité',
    timestamp: 'Il y a 5 minutes',
    icon: FiAlertCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Performance dégradée',
    message: 'Temps de réponse API supérieur à 2s',
    timestamp: 'Il y a 15 minutes',
    icon: FiAlertTriangle,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
  },
  {
    id: 3,
    type: 'info',
    title: 'Mise à jour disponible',
    message: 'Nouvelle version 2.1.0 disponible',
    timestamp: 'Il y a 1 heure',
    icon: FiInfo,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20'
  }
];

const SystemAlerts = () => {
  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-lg ${alert.bgColor}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <alert.icon className={`w-5 h-5 ${alert.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-medium ${alert.color}`}>
                {alert.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {alert.message}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {alert.timestamp}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SystemAlerts; 