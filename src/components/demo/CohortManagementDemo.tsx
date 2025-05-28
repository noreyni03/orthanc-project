'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiInfo, FiPlus, FiDownload, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { mockCohorts, mockDatasets, type Cohort } from '@/lib/mockData';

const CohortManagementDemo: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedCohort, setExpandedCohort] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const statuses = ['all', 'active', 'draft', 'archived'];

  const filteredCohorts = useMemo(() => {
    return mockCohorts.filter(cohort => {
      const matchesSearch = cohort.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cohort.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cohort.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = selectedStatus === 'all' || cohort.metadata.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  const getStatusColor = (status: Cohort['metadata']['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft':
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

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const handleExport = (cohortId: string) => {
    // Simulation d'export
    console.log(`Exporting cohort ${cohortId}`);
    alert('Export démarré...');
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec barre de recherche et boutons d'action */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une cohorte..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            <FiFilter />
            <span>Filtres</span>
            {showFilters ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            <FiPlus />
            <span>Nouvelle Cohorte</span>
          </button>
        </div>
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

      {/* Liste des cohortes */}
      <div className="space-y-4">
        {filteredCohorts.map(cohort => (
          <motion.div
            key={cohort.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {cohort.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {cohort.description}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cohort.metadata.status)}`}>
                    {cohort.metadata.status}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleExport(cohort.id)}
                      className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
                      title="Exporter"
                    >
                      <FiDownload />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
                      title="Modifier"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      title="Supprimer"
                    >
                      <FiTrash2 />
                    </button>
                    <button
                      onClick={() => setExpandedCohort(expandedCohort === cohort.id ? null : cohort.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                    >
                      {expandedCohort === cohort.id ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Détails de la cohorte */}
              {expandedCohort === cohort.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Patients</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {cohort.patientCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Datasets</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {cohort.datasets.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Créée le</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {cohort.metadata.createdAt}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Dernière mise à jour</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {cohort.metadata.lastUpdated}
                      </p>
                    </div>
                  </div>

                  {/* Critères de sélection */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Critères de sélection</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {cohort.criteria.ageRange && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Âge</p>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {cohort.criteria.ageRange[0]} - {cohort.criteria.ageRange[1]} ans
                          </p>
                        </div>
                      )}
                      {cohort.criteria.gender && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Genre</p>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {cohort.criteria.gender === 'all' ? 'Tous' : cohort.criteria.gender}
                          </p>
                        </div>
                      )}
                      {cohort.criteria.modalities && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Modalités</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {cohort.criteria.modalities.map(modality => (
                              <span
                                key={modality}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-xs"
                              >
                                {modality}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {cohort.criteria.pathologies && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Pathologies</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {cohort.criteria.pathologies.map(pathology => (
                              <span
                                key={pathology}
                                className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 rounded-full text-xs"
                              >
                                {pathology}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Datasets inclus */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Datasets inclus</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cohort.datasets.map(datasetId => {
                        const dataset = mockDatasets.find(d => d.id === datasetId);
                        if (!dataset) return null;
                        return (
                          <div
                            key={datasetId}
                            className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
                          >
                            <p className="font-medium text-gray-900 dark:text-white">{dataset.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{dataset.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {cohort.metadata.tags.map(tag => (
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
                      <span>Créée par: {cohort.metadata.createdBy}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal de création de cohorte (à implémenter) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Créer une nouvelle cohorte
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Cette fonctionnalité sera implémentée dans la prochaine étape.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CohortManagementDemo; 