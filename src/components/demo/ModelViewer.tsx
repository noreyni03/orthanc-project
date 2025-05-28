'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiPlay, FiDownload, FiBarChart2, FiPieChart, FiLineChart } from 'react-icons/fi';

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

interface ModelViewerProps {
  model: Model;
}

interface PredictionResult {
  id: string;
  timestamp: string;
  input: string;
  output: string;
  confidence: number;
}

const mockResults: PredictionResult[] = [
  {
    id: '1',
    timestamp: '2024-03-15 14:30',
    input: 'IRM_001.dcm',
    output: 'Tumeur bénigne',
    confidence: 0.92
  },
  {
    id: '2',
    timestamp: '2024-03-15 14:25',
    input: 'IRM_002.dcm',
    output: 'Tumeur maligne',
    confidence: 0.88
  }
];

const ModelViewer: React.FC<ModelViewerProps> = ({ model }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<PredictionResult[]>(mockResults);
  const [activeTab, setActiveTab] = useState<'predict' | 'metrics' | 'history'>('predict');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePredict = () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    // Simulation de prédiction
    setTimeout(() => {
      const newResult: PredictionResult = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        input: selectedFile.name,
        output: 'Résultat simulé',
        confidence: Math.random() * 0.3 + 0.7 // Simulation d'une confiance entre 0.7 et 1.0
      };
      setResults([newResult, ...results]);
      setIsProcessing(false);
    }, 2000);
  };

  const renderMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Précision</h3>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
            {(model.metrics.precision * 100).toFixed(1)}%
          </span>
          <FiBarChart2 className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
      <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rappel</h3>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
            {(model.metrics.recall * 100).toFixed(1)}%
          </span>
          <FiPieChart className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
      <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Score F1</h3>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
            {(model.metrics.f1Score * 100).toFixed(1)}%
          </span>
          <FiLineChart className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
    </div>
  );

  const renderPrediction = () => (
    <div className="p-6">
      <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Nouvelle prédiction
        </h3>
        <div className="flex items-center space-x-4">
          <label className="flex-1">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-cyan-500 dark:hover:border-cyan-400">
              <FiUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <span className="text-gray-600 dark:text-gray-400">
                {selectedFile ? selectedFile.name : 'Cliquez pour sélectionner un fichier'}
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".dcm,.nii,.nii.gz"
              />
            </div>
          </label>
          <button
            onClick={handlePredict}
            disabled={!selectedFile || isProcessing}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 ${
              !selectedFile || isProcessing
                ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-cyan-600 hover:bg-cyan-700'
            } text-white`}
          >
            <FiPlay />
            <span>{isProcessing ? 'Traitement...' : 'Prédire'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-700 rounded-lg shadow-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Historique des prédictions
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-600">
          {results.map(result => (
            <div key={result.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {result.timestamp}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Confiance : {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {result.input}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {result.output}
                  </p>
                </div>
                <button
                  className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
                  title="Télécharger le résultat"
                >
                  <FiDownload />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Onglets */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('predict')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'predict'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Prédiction
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'metrics'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Métriques
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Historique
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'predict' && renderPrediction()}
      {activeTab === 'metrics' && renderMetrics()}
      {activeTab === 'history' && renderPrediction()} {/* Réutilisation du même composant pour l'historique */}
    </div>
  );
};

export default ModelViewer; 