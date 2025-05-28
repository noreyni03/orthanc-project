'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiUsers, FiDownload, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import AnnotationEditor from '@/components/demo/AnnotationEditor';
import AnnotationList from '@/components/demo/AnnotationList';

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

const mockAnnotations: Annotation[] = [
  {
    id: '1',
    title: 'Annotations IRM Cérébrale',
    type: 'dicom',
    status: 'in_progress',
    collaborators: [
      {
        id: '1',
        name: 'Dr. Sophie',
        avatar: 'https://i.pravatar.cc/150?img=2',
        role: 'owner'
      },
      {
        id: '2',
        name: 'Dr. Martin',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'editor'
      }
    ],
    lastModified: '2024-03-15 14:30',
    createdBy: {
      id: '1',
      name: 'Dr. Sophie',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    tags: ['IRM', 'Cerveau', 'Tumeur']
  },
  {
    id: '2',
    title: 'Annotations Segmentation Tumeur',
    type: 'model',
    status: 'completed',
    collaborators: [
      {
        id: '1',
        name: 'Dr. Sophie',
        avatar: 'https://i.pravatar.cc/150?img=2',
        role: 'owner'
      }
    ],
    lastModified: '2024-03-14 10:15',
    createdBy: {
      id: '1',
      name: 'Dr. Sophie',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    tags: ['Segmentation', 'Tumeur', 'Validation']
  }
];

const AnnotationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);

  const filteredAnnotations = mockAnnotations.filter(annotation => {
    const matchesSearch = annotation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         annotation.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || annotation.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || annotation.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Annotations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez et collaborez sur vos annotations médicales
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des annotations..."
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
              <option value="dicom">DICOM</option>
              <option value="model">Modèles</option>
              <option value="notebook">Notebooks</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
            </select>
            <button
              onClick={() => {
                setSelectedAnnotation(null);
                setIsEditorOpen(true);
              }}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center space-x-2"
            >
              <FiPlus />
              <span>Nouvelle annotation</span>
            </button>
          </div>
        </div>

        {/* Liste des annotations */}
        <div className="grid grid-cols-1 gap-6">
          {filteredAnnotations.map(annotation => (
            <motion.div
              key={annotation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FiEdit2 className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
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
                    onClick={() => {
                      setSelectedAnnotation(annotation);
                      setIsEditorOpen(true);
                    }}
                    className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {/* TODO: Implémenter l'export */}}
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
            </motion.div>
          ))}
        </div>

        {/* Éditeur d'annotations */}
        <AnnotationEditor
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setSelectedAnnotation(null);
          }}
          annotation={selectedAnnotation}
          onSave={(annotationData) => {
            console.log('Annotation sauvegardée:', annotationData);
            setIsEditorOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default AnnotationsPage; 