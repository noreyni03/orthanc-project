'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiUser, FiShare2, FiLock, FiUnlock, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface ShareHistoryItem {
  id: string;
  itemName: string;
  itemType: 'dicom' | 'model' | 'notebook' | 'project';
  action: 'share' | 'unshare' | 'update' | 'delete';
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  targetUser?: {
    id: string;
    name: string;
    avatar: string;
  };
  changes?: {
    permissions?: {
      canView?: boolean;
      canEdit?: boolean;
      canShare?: boolean;
      canDelete?: boolean;
    };
    role?: 'viewer' | 'editor' | 'admin';
    expiresAt?: string;
  };
  timestamp: string;
}

const mockHistory: ShareHistoryItem[] = [
  {
    id: '1',
    itemName: 'Dataset IRM Cérébrale',
    itemType: 'dicom',
    action: 'share',
    user: {
      id: '1',
      name: 'Dr. Sophie',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    targetUser: {
      id: '2',
      name: 'Dr. Martin',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    changes: {
      permissions: {
        canView: true,
        canEdit: true,
        canShare: false,
        canDelete: false
      },
      role: 'editor',
      expiresAt: '2024-04-15'
    },
    timestamp: '2024-03-15 14:30'
  },
  {
    id: '2',
    itemName: 'Modèle de Segmentation',
    itemType: 'model',
    action: 'update',
    user: {
      id: '1',
      name: 'Dr. Sophie',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    targetUser: {
      id: '3',
      name: 'Dr. Pierre',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    changes: {
      permissions: {
        canView: true,
        canEdit: true,
        canShare: false,
        canDelete: false
      },
      role: 'editor'
    },
    timestamp: '2024-03-14 10:15'
  },
  {
    id: '3',
    itemName: 'Notebook d\'analyse',
    itemType: 'notebook',
    action: 'unshare',
    user: {
      id: '1',
      name: 'Dr. Sophie',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    targetUser: {
      id: '4',
      name: 'Dr. Marie',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    timestamp: '2024-03-13 16:45'
  }
];

const ShareHistory: React.FC = () => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'share':
        return <FiShare2 className="w-5 h-5 text-green-500" />;
      case 'unshare':
        return <FiShare2 className="w-5 h-5 text-red-500" />;
      case 'update':
        return <FiEdit2 className="w-5 h-5 text-blue-500" />;
      case 'delete':
        return <FiTrash2 className="w-5 h-5 text-red-500" />;
      default:
        return <FiClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'share':
        return 'a partagé';
      case 'unshare':
        return 'a retiré l\'accès';
      case 'update':
        return 'a modifié les permissions';
      case 'delete':
        return 'a supprimé';
      default:
        return 'a effectué une action';
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
      case 'project':
        return '📁';
      default:
        return '📄';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {mockHistory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getActionIcon(item.action)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <img
                    src={item.user.avatar}
                    alt={item.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.user.name} {getActionText(item.action)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.timestamp}
                    </p>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTypeIcon(item.itemType)}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.itemName}
                    </span>
                  </div>

                  {item.targetUser && (
                    <div className="mt-2 flex items-center space-x-2">
                      <FiUser className="w-4 h-4 text-gray-400" />
                      <img
                        src={item.targetUser.avatar}
                        alt={item.targetUser.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        avec {item.targetUser.name}
                      </span>
                    </div>
                  )}

                  {item.changes && (
                    <div className="mt-2 space-y-1">
                      {item.changes.role && (
                        <div className="flex items-center space-x-2">
                          <FiLock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Rôle : {item.changes.role}
                          </span>
                        </div>
                      )}
                      {item.changes.permissions && (
                        <div className="flex items-center space-x-2">
                          <FiUnlock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Permissions :{' '}
                            {Object.entries(item.changes.permissions)
                              .filter(([_, value]) => value)
                              .map(([key]) => key)
                              .join(', ')}
                          </span>
                        </div>
                      )}
                      {item.changes.expiresAt && (
                        <div className="flex items-center space-x-2">
                          <FiClock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Expire le {item.changes.expiresAt}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ShareHistory; 