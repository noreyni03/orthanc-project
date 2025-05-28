'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiPieChart, FiLineChart, FiFilter, FiDownload } from 'react-icons/fi';
import BenchmarkChart from '@/components/demo/BenchmarkChart';

interface BenchmarkResult {
  id: string;
  modelName: string;
  type: 'classification' | 'segmentation' | 'detection';
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    inferenceTime: number;
  };
  dataset: string;
  date: string;
}

const mockResults: BenchmarkResult[] = [
  {
    id: '1',
    modelName: 'Détection de tumeurs v1',
    type: 'detection',
    metrics: {
      accuracy: 0.92,
      precision: 0.91,
      recall: 0.93,
      f1Score: 0.92,
      inferenceTime: 0.15
    },
    dataset: 'IRM cérébrales',
    date: '2024-03-15'
  },
  {
    id: '2',
    modelName: 'Détection de tumeurs v2',
    type: 'detection',
    metrics: {
      accuracy: 0.94,
      precision: 0.93,
      recall: 0.95,
      f1Score: 0.94,
      inferenceTime: 0.12
    },
    dataset: 'IRM cérébrales',
    date: '2024-03-16'
  },
  {
    id: '3',
    modelName: 'Segmentation cardiaque v1',
    type: 'segmentation',
    metrics: {
      accuracy: 0.88,
      precision: 0.87,
      recall: 0.89,
      f1Score: 0.88,
      inferenceTime: 0.25
    },
    dataset: 'Échographies cardiaques',
    date: '2024-03-14'
  }
];

const BenchmarkPage = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<string>('accuracy');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const filteredResults = mockResults.filter(result => {
    const matchesType = selectedType === 'all' || result.type === selectedType;
    const matchesSelection = selectedModels.length === 0 || selectedModels.includes(result.id);
    return matchesType && matchesSelection;
  });

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'accuracy':
        return 'Précision globale';
      case 'precision':
        return 'Précision';
      case 'recall':
        return 'Rappel';
      case 'f1Score':
        return 'Score F1';
      case 'inferenceTime':
        return 'Temps d\'inférence (s)';
      default:
        return metric;
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'accuracy':
        return <FiBarChart2 className="w-5 h-5" />;
      case 'precision':
        return <FiPieChart className="w-5 h-5" />;
      case 'recall':
        return <FiLineChart className="w-5 h-5" />;
      default:
        return <FiBarChart2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Benchmarking des Modèles
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comparaison des performances des modèles d'IA
          </p>
        </div>

        {/* Filtres et contrôles */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center space-x-4">
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
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="accuracy">Précision globale</option>
              <option value="precision">Précision</option>
              <option value="recall">Rappel</option>
              <option value="f1Score">Score F1</option>
              <option value="inferenceTime">Temps d'inférence</option>
            </select>
            <button
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center space-x-2"
            >
              <FiDownload />
              <span>Exporter les résultats</span>
            </button>
          </div>
        </div>

        {/* Graphique de comparaison */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Comparaison des performances
          </h2>
          <BenchmarkChart
            results={filteredResults}
            metric={selectedMetric}
            selectedModels={selectedModels}
            onModelSelect={setSelectedModels}
          />
        </div>

        {/* Tableau des résultats détaillés */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Résultats détaillés
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Modèle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Dataset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Précision
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rappel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Score F1
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Temps (s)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredResults.map(result => (
                  <tr
                    key={result.id}
                    className={`hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer ${
                      selectedModels.includes(result.id) ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''
                    }`}
                    onClick={() => {
                      setSelectedModels(prev =>
                        prev.includes(result.id)
                          ? prev.filter(id => id !== result.id)
                          : [...prev, result.id]
                      );
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {result.modelName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {result.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {result.dataset}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {(result.metrics.precision * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {(result.metrics.recall * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {(result.metrics.f1Score * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {result.metrics.inferenceTime.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkPage; 