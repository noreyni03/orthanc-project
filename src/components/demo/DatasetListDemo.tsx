'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiInfo } from 'react-icons/fi';
import { mockDatasets, type Dataset } from '@/lib/mockData';

const DatasetListDemo: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedDataset, setExpandedDataset] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const modalities = ['all', 'CT', 'MR', 'US', 'X-Ray'];
  const statuses = ['all', 'active', 'processing', 'archived'];

  const filteredDatasets = useMemo(() => {
    return mockDatasets.filter(dataset => {
      const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesModality = selectedModality === 'all' || dataset.modality === selectedModality;
      const matchesStatus = selectedStatus === 'all' || dataset.status === selectedStatus;

      return matchesSearch && matchesModality && matchesStatus;
    });
  }, [searchQuery, selectedModality, selectedStatus]);

  const getStatusColor = (status: Dataset['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleModalityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedModality(e.target.value);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Barre de recherche et filtres */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un dataset..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            <FiFilter />
            <span>Filtres</span>
            {showFilters ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>

        {/* Filtres dépliables */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Modalité
                </label>
                <select
                  value={selectedModality}
                  onChange={handleModalityChange}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                >
                  {modalities.map(modality => (
                    <option key={modality} value={modality}>
                      {modality === 'all' ? 'Toutes les modalités' : modality}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Statut
                </label>
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'Tous les statuts' : status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Liste des datasets */}
      <div className="space-y-4">
        {filteredDatasets.map(dataset => (
          <motion.div
            key={dataset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {dataset.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {dataset.description}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dataset.status)}`}>
                    {dataset.status}
                  </span>
                  <button
                    onClick={() => setExpandedDataset(expandedDataset === dataset.id ? null : dataset.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    {expandedDataset === dataset.id ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>
              </div>

              {/* Détails du dataset */}
              {expandedDataset === dataset.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Patients</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {dataset.patientCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Études</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {dataset.studyCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Séries</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {dataset.seriesCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Taille</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {dataset.size}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {dataset.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-400 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <FiInfo className="mr-2" />
                      <span>Propriétaire: {dataset.owner}</span>
                    </div>
                    <span>Dernière mise à jour: {dataset.lastUpdated}</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DatasetListDemo; 