'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiFolder, FiFile, FiCode, FiBarChart2, FiPieChart, FiLineChart } from 'react-icons/fi';
import NotebookViewer from '@/components/demo/NotebookViewer';

interface Notebook {
  id: string;
  title: string;
  description: string;
  type: 'analysis' | 'visualization' | 'report';
  lastModified: string;
  tags: string[];
}

const mockNotebooks: Notebook[] = [
  {
    id: '1',
    title: 'Analyse statistique des cohortes',
    description: 'Analyse comparative des caractéristiques démographiques et cliniques',
    type: 'analysis',
    lastModified: '2024-03-15',
    tags: ['statistiques', 'cohortes', 'démographie']
  },
  {
    id: '2',
    title: 'Visualisation des tendances temporelles',
    description: 'Analyse des évolutions temporelles des paramètres cliniques',
    type: 'visualization',
    lastModified: '2024-03-14',
    tags: ['tendances', 'temporel', 'graphiques']
  },
  {
    id: '3',
    title: 'Rapport de validation des modèles',
    description: 'Évaluation des performances des modèles prédictifs',
    type: 'report',
    lastModified: '2024-03-13',
    tags: ['validation', 'modèles', 'performance']
  }
];

const AnalysisPage = () => {
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredNotebooks = mockNotebooks.filter(notebook => {
    const matchesSearch = notebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notebook.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notebook.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || notebook.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'analysis':
        return <FiBarChart2 className="w-5 h-5" />;
      case 'visualization':
        return <FiLineChart className="w-5 h-5" />;
      case 'report':
        return <FiPieChart className="w-5 h-5" />;
      default:
        return <FiFile className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Environnement d'Analyse
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Notebooks et visualisations pour l'analyse des données
          </p>
        </div>

        {selectedNotebook ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedNotebook(null)}
                  className="text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
                >
                  ← Retour
                </button>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedNotebook.title}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                {selectedNotebook.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <NotebookViewer notebook={selectedNotebook} />
          </motion.div>
        ) : (
          <>
            {/* Barre de recherche et filtres */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Rechercher un notebook..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="all">Tous les types</option>
                  <option value="analysis">Analyses</option>
                  <option value="visualization">Visualisations</option>
                  <option value="report">Rapports</option>
                </select>
                <button
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center space-x-2"
                >
                  <FiPlus />
                  <span>Nouveau Notebook</span>
                </button>
              </div>
            </div>

            {/* Liste des notebooks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotebooks.map(notebook => (
                <motion.div
                  key={notebook.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => setSelectedNotebook(notebook)}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-2 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg text-cyan-600 dark:text-cyan-400">
                        {getTypeIcon(notebook.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {notebook.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Modifié le {notebook.lastModified}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {notebook.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {notebook.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded"
                        >
                          {tag}
                        </span>
                      ))}
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

export default AnalysisPage; 