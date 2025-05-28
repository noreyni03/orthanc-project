'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiCpu, FiActivity, FiTrendingUp } from 'react-icons/fi';
import ModelViewer from '@/components/demo/ModelViewer';

interface Model {
  id: string;
  name: string;
  description: string;
  type: 'classification' | 'segmentation' | 'detection';
  status: 'active' | 'training' | 'archived';
  accuracy: number;
  lastUpdated: string;
  tags: string[];
  metrics: {
    precision: number;
    recall: number;
    f1Score: number;
  };
}

const mockModels: Model[] = [
  {
    id: '1',
    name: 'Détection de tumeurs cérébrales',
    description: 'Modèle de détection et classification des tumeurs cérébrales à partir d\'IRM',
    type: 'detection',
    status: 'active',
    accuracy: 0.92,
    lastUpdated: '2024-03-15',
    tags: ['neuro', 'IRM', 'tumeur'],
    metrics: {
      precision: 0.91,
      recall: 0.93,
      f1Score: 0.92
    }
  },
  {
    id: '2',
    name: 'Segmentation cardiaque',
    description: 'Segmentation automatique des structures cardiaques en échographie',
    type: 'segmentation',
    status: 'training',
    accuracy: 0.88,
    lastUpdated: '2024-03-14',
    tags: ['cardio', 'échographie', 'segmentation'],
    metrics: {
      precision: 0.87,
      recall: 0.89,
      f1Score: 0.88
    }
  },
  {
    id: '3',
    name: 'Classification des pathologies pulmonaires',
    description: 'Classification des pathologies pulmonaires à partir de radiographies',
    type: 'classification',
    status: 'active',
    accuracy: 0.95,
    lastUpdated: '2024-03-13',
    tags: ['pulmonaire', 'radiographie', 'classification'],
    metrics: {
      precision: 0.94,
      recall: 0.96,
      f1Score: 0.95
    }
  }
];

const ModelsPage = () => {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredModels = mockModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || model.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || model.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'classification':
        return <FiActivity className="w-5 h-5" />;
      case 'segmentation':
        return <FiTrendingUp className="w-5 h-5" />;
      case 'detection':
        return <FiCpu className="w-5 h-5" />;
      default:
        return <FiCpu className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'training':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Modèles d'Intelligence Artificielle
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Catalogue et interface de prédiction des modèles IA
          </p>
        </div>

        {selectedModel ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedModel(null)}
                  className="text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
                >
                  ← Retour
                </button>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedModel.name}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(selectedModel.status)}`}>
                  {selectedModel.status}
                </span>
                {selectedModel.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <ModelViewer model={selectedModel} />
          </motion.div>
        ) : (
          <>
            {/* Barre de recherche et filtres */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un modèle..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="all">Tous les types</option>
                  <option value="classification">Classification</option>
                  <option value="segmentation">Segmentation</option>
                  <option value="detection">Détection</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="training">En entraînement</option>
                  <option value="archived">Archivé</option>
                </select>
                <button
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center space-x-2"
                >
                  <FiPlus />
                  <span>Nouveau modèle</span>
                </button>
              </div>
            </div>

            {/* Liste des modèles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map(model => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => setSelectedModel(model)}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-2 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg text-cyan-600 dark:text-cyan-400">
                        {getTypeIcon(model.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {model.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Précision : {(model.accuracy * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {model.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {model.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(model.status)}`}>
                        {model.status}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Mis à jour le {model.lastUpdated}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModelsPage; 