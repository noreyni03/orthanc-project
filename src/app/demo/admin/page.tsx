'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiDatabase, FiAlertCircle, FiActivity, FiTrendingUp, FiClock } from 'react-icons/fi';
import AdminStats from '@/components/demo/AdminStats';
import ActivityFeed from '@/components/demo/ActivityFeed';
import SystemAlerts from '@/components/demo/SystemAlerts';

const AdminPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Administration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez votre application et surveillez son activité
          </p>
        </div>

        {/* Filtre de période */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="day">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStats />
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activité récente */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Activité récente
                </h2>
                <FiActivity className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <ActivityFeed />
            </motion.div>
          </div>

          {/* Alertes système */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Alertes système
                </h2>
                <FiAlertCircle className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <SystemAlerts />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 