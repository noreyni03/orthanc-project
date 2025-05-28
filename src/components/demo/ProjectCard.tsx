'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiActivity, FiCalendar, FiTag, FiMoreVertical, FiEdit2, FiArchive, FiTrash2 } from 'react-icons/fi';

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

interface ProjectCardProps {
  project: Project;
  onStatusChange: (status: Project['status']) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onStatusChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'update':
        return <FiEdit2 className="w-4 h-4" />;
      case 'comment':
        return <FiActivity className="w-4 h-4" />;
      case 'member':
        return <FiUsers className="w-4 h-4" />;
      default:
        return <FiActivity className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-6">
        {/* En-tête du projet */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {project.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {project.description}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
            >
              <FiMoreVertical />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-lg shadow-lg py-1 z-10">
                <button
                  onClick={() => {
                    onStatusChange('completed');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600"
                >
                  Marquer comme terminé
                </button>
                <button
                  onClick={() => {
                    onStatusChange('archived');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600"
                >
                  Archiver
                </button>
                <button
                  onClick={() => {
                    // Gérer la suppression
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-600"
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Statut et tags */}
        <div className="flex items-center space-x-2 mb-4">
          <span className={`px-2 py-1 text-xs rounded ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
          {project.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Membres */}
        <div className="flex items-center space-x-2 mb-4">
          <FiUsers className="text-gray-400" />
          <div className="flex -space-x-2">
            {project.members.map(member => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800"
                title={`${member.name} (${member.role})`}
              />
            ))}
          </div>
        </div>

        {/* Dernière activité */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          {getActivityIcon(project.lastActivity.type)}
          <span>
            {project.lastActivity.user} - {project.lastActivity.description}
          </span>
        </div>

        {/* Date de création */}
        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <FiCalendar className="w-4 h-4" />
          <span>Créé le {project.createdAt}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard; 