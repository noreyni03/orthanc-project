'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiUsers, FiActivity, FiCalendar, FiTag } from 'react-icons/fi';
import ProjectCard from '@/components/demo/ProjectCard';
import CreateProjectModal from '@/components/demo/CreateProjectModal';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  members: {
    id: string;
    name: string;
    role: 'owner' | 'admin' | 'member';
    avatar: string;
  }[];
  tags: string[];
  lastActivity: {
    type: 'update' | 'comment' | 'member';
    user: string;
    date: string;
    description: string;
  };
  createdAt: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Analyse de tumeurs cérébrales',
    description: 'Projet collaboratif pour l\'analyse et la classification des tumeurs cérébrales',
    status: 'active',
    members: [
      {
        id: '1',
        name: 'Dr. Martin',
        role: 'owner',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      {
        id: '2',
        name: 'Dr. Sophie',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?img=2'
      }
    ],
    tags: ['neuro', 'IRM', 'IA'],
    lastActivity: {
      type: 'update',
      user: 'Dr. Sophie',
      date: '2024-03-15 14:30',
      description: 'Mise à jour du modèle de détection'
    },
    createdAt: '2024-03-01'
  },
  {
    id: '2',
    name: 'Segmentation cardiaque',
    description: 'Développement d\'un modèle de segmentation des structures cardiaques',
    status: 'active',
    members: [
      {
        id: '3',
        name: 'Dr. Pierre',
        role: 'owner',
        avatar: 'https://i.pravatar.cc/150?img=3'
      }
    ],
    tags: ['cardio', 'échographie', 'segmentation'],
    lastActivity: {
      type: 'member',
      user: 'Dr. Pierre',
      date: '2024-03-14 10:15',
      description: 'Nouveau membre ajouté au projet'
    },
    createdAt: '2024-03-10'
  }
];

const CollaborationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
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
            Collaboration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos projets et collaborez avec votre équipe
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
                  placeholder="Rechercher un projet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="completed">Terminé</option>
              <option value="archived">Archivé</option>
            </select>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center space-x-2"
            >
              <FiPlus />
              <span>Nouveau projet</span>
            </button>
          </div>
        </div>

        {/* Liste des projets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onStatusChange={(newStatus) => {
                // Gérer le changement de statut
                console.log(`Changement de statut pour ${project.id}: ${newStatus}`);
              }}
            />
          ))}
        </div>

        {/* Modal de création de projet */}
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateProject={(projectData) => {
            // Gérer la création du projet
            console.log('Nouveau projet:', projectData);
            setIsCreateModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default CollaborationPage; 