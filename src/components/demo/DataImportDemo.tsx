'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiFile, FiCheck, FiAlertCircle } from 'react-icons/fi';

const DataImportDemo = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; type: string }>>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    simulateFileUpload();
  };

  const simulateFileUpload = () => {
    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simuler la progression de l'upload
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          setUploadStatus('success');
          setUploadedFiles([
            {
              name: 'exemple_scan.dcm',
              size: '2.5 MB',
              type: 'DICOM'
            }
          ]);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Import de Fichiers DICOM
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Glissez-déposez vos fichiers DICOM ou cliquez pour sélectionner
        </p>
      </div>

      {/* Zone de dépôt */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center
          ${isDragging 
            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' 
            : 'border-gray-300 dark:border-gray-700'
          }
          transition-colors duration-200
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-gray-600 dark:text-gray-400">
            <p className="font-medium">Glissez vos fichiers ici</p>
            <p className="text-sm">ou</p>
            <button
              onClick={simulateFileUpload}
              className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Sélectionner des fichiers
            </button>
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      {uploadStatus === 'uploading' && uploadProgress !== null && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Progression</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-cyan-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Statut de l'upload */}
      {uploadStatus === 'success' && (
        <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiCheck className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Upload réussi
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>Les fichiers ont été importés avec succès.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des fichiers uploadés */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Fichiers importés
          </h3>
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FiFile className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {file.size} • {file.type}
                    </p>
                  </div>
                </div>
                <FiCheck className="h-5 w-5 text-green-500" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataImportDemo; 