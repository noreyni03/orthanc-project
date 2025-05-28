'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DataImportDemo from '@/components/demo/DataImportDemo';
import DatasetListDemo from '@/components/demo/DatasetListDemo';
import CohortManagementDemo from '@/components/demo/CohortManagementDemo';

const DataManagementDemo = () => {
  const [activeTab, setActiveTab] = useState('import');

  const tabs = [
    { id: 'import', label: 'Import de Données' },
    { id: 'datasets', label: 'Gestion des Datasets' },
    { id: 'cohorts', label: 'Gestion des Cohortes' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gestion des Données
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Importez, gérez et organisez vos données médicales
        </p>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'import' && <DataImportDemo />}
        {activeTab === 'datasets' && <DatasetListDemo />}
        {activeTab === 'cohorts' && <CohortManagementDemo />}
      </motion.div>
    </div>
  );
};

export default DataManagementDemo;
