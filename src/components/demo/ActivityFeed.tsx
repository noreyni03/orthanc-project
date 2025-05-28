'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiUpload, FiDownload, FiEdit2, FiTrash2 } from 'react-icons/fi';

const activities = [
  {
    id: 1,
    type: 'user',
    user: {
      name: 'Dr. Sophie Martin',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    action: 'a créé un nouveau projet',
    target: 'Analyse IRM Cérébrale',
    timestamp: 'Il y a 5 minutes',
    icon: FiUser,
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 2,
    type: 'upload',
    user: {
      name: 'Dr. Jean Dupont',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    action: 'a téléchargé',
    target: 'Dataset IRM-2024-03',
    timestamp: 'Il y a 15 minutes',
    icon: FiUpload,
    color: 'text-green-600 dark:text-green-400'
  },
  {
    id: 3,
    type: 'edit',
    user: {
      name: 'Dr. Marie Laurent',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    action: 'a modifié',
    target: 'Modèle de segmentation',
    timestamp: 'Il y a 30 minutes',
    icon: FiEdit2,
    color: 'text-yellow-600 dark:text-yellow-400'
  },
  {
    id: 4,
    type: 'delete',
    user: {
      name: 'Dr. Pierre Dubois',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    action: 'a supprimé',
    target: 'Ancien dataset',
    timestamp: 'Il y a 1 heure',
    icon: FiTrash2,
    color: 'text-red-600 dark:text-red-400'
  }
];

const ActivityFeed = () => {
  return (
    <div className="space-y-6">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start space-x-4"
        >
          <div className="flex-shrink-0">
            <img
              src={activity.user.avatar}
              alt={activity.user.name}
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.user.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {activity.action}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.target}
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <activity.icon className={`w-4 h-4 ${activity.color}`} />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {activity.timestamp}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ActivityFeed; 