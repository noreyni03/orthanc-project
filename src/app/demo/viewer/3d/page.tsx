'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMaximize2, FiMinimize2, FiSettings, FiSave, FiShare2 } from 'react-icons/fi';
import Viewer3D from '@/components/demo/Viewer3D';

const Viewer3DPage = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Visualiseur 3D
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualisez et analysez vos reconstructions 3D
          </p>
        </div>

        {/* Barre d'outils principale */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
                title={isFullscreen ? "Quitter le mode plein écran" : "Mode plein écran"}
              >
                {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
              </button>
              <button
                className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
                title="Paramètres"
              >
                <FiSettings />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
                title="Sauvegarder"
              >
                <FiSave />
              </button>
              <button
                className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
                title="Partager"
              >
                <FiShare2 />
              </button>
            </div>
          </div>
        </div>

        {/* Zone de visualisation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden ${
            isFullscreen ? 'fixed inset-0 z-50 m-0 rounded-none' : ''
          }`}
        >
          <Viewer3D />
        </motion.div>
      </div>
    </div>
  );
};

export default Viewer3DPage; 