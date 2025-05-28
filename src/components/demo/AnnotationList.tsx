'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiDownload, FiUsers, FiTag, FiClock } from 'react-icons/fi';

interface Annotation {
  id: string;
  title: string;
  type: 'dicom' | 'model' | 'notebook';
  status: 'draft' | 'in_progress' | 'completed';
  collaborators: {
    id: string;
    name: string;
    avatar: string;
    role: 'owner' | 'editor' | 'viewer';
  }[];
  lastModified: string;
  createdBy: {
    id: string;
    name: string;
    avatar: string;
  };
  tags: string[];
}

interface AnnotationListProps {
  annotations: Annotation[];
  onEdit: (annotation: Annotation) => void;
  onExport: (annotation: Annotation) => void;
}

const AnnotationList: React.FC<AnnotationListProps> = ({
  annotations,
  onEdit,
  onExport
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dicom':
        return '🖼️';
      case 'model':
        return '🤖';
      case 'notebook':
        return '📓';
      default:
        return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {annotations.map((annotation, index) => (
        <motion.div
          key={annotation.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <span className="text-2xl">{getTypeIcon(annotation.type)}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {annotation.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs rounded ${getStatusColor(annotation.status)}`}>
                    {getStatusText(annotation.status)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Dernière modification : {annotation.lastModified}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(annotation)}
                className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onExport(annotation)}
                className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
              >
                <FiDownload className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {annotation.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Collaborateurs */}
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <FiUsers className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Collaborateurs :
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {annotation.collaborators.map(collaborator => (
                <div
                  key={collaborator.id}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg"
                >
                  <img
                    src={collaborator.avatar}
                    alt={collaborator.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {collaborator.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {collaborator.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Créé par */}
          <div className="mt-4 flex items-center space-x-2">
            <FiClock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Créé par {annotation.createdBy.name}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AnnotationList; 