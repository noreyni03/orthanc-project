'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShare2, FiSearch, FiFilter, FiUserPlus, FiClock, FiLock, FiUnlock } from 'react-icons/fi';
import ShareModal from '@/components/demo/ShareModal';
import ShareHistory from '@/components/demo/ShareHistory';

interface SharedItem {
  id: string;
  name: string;
  type: 'dicom' | 'model' | 'notebook' | 'project';
  sharedWith: {
    id: string;
    name: string;
    email: string;
    role: 'viewer' | 'editor' | 'admin';
    avatar: string;
  }[];
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canShare: boolean;
    canDelete: boolean;
  };
  sharedBy: {
    id: string;
    name: string;
    avatar: string;
  };
  sharedAt: string;
  expiresAt?: string;
}

const mockSharedItems: SharedItem[] = [
  {
    id: '1',
    name: 'Dataset IRM Cérébrale',
    type: 'dicom',
    sharedWith: [
      {
        id: '1',
        name: 'Dr. Martin',
        email: 'martin@example.com',
        role: 'editor',
        avatar: 'https://i.pravatar.cc/150?img=1'
      }
    ],
    permissions: {
      canView: true,
      canEdit: true,
      canShare: false,
      canDelete: false
    },
    sharedBy: {
      id: '2',
      name: 'Dr. Sophie',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    sharedAt: '2024-03-15 14:30',
    expiresAt: '2024-04-15'
  },
  {
    id: '2',
    name: 'Modèle de Segmentation',
    type: 'model',
    sharedWith: [
      {
        id: '3',
        name: 'Dr. Pierre',
        email: 'pierre@example.com',
        role: 'viewer',
        avatar: 'https://i.pravatar.cc/150?img=3'
      }
    ],
    permissions: {
      canView: true,
      canEdit: false,
      canShare: false,
      canDelete: false
    },
    sharedBy: {
      id: '2',
      name: 'Dr. Sophie',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    sharedAt: '2024-03-14 10:15'
  }
];

const SharePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SharedItem | null>(null);

  const filteredItems = mockSharedItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sharedWith.some(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'editor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'viewer':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Partage
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez les partages et les permissions de vos ressources
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
                  placeholder="Rechercher un partage..."
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
              <option value="project">Projets</option>
            </select>
            <button
              onClick={() => {
                setSelectedItem(null);
                setIsShareModalOpen(true);
              }}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center space-x-2"
            >
              <FiShare2 />
              <span>Partager</span>
            </button>
          </div>
        </div>

        {/* Liste des partages */}
        <div className="grid grid-cols-1 gap-6">
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">{getTypeIcon(item.type)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Partagé par {item.sharedBy.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {item.sharedAt}
                      </span>
                      {item.expiresAt && (
                        <>
                          <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Expire le {item.expiresAt}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setIsShareModalOpen(true);
                  }}
                  className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>

              {/* Permissions */}
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {item.permissions.canView && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded">
                      Lecture
                    </span>
                  )}
                  {item.permissions.canEdit && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded">
                      Édition
                    </span>
                  )}
                  {item.permissions.canShare && (
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded">
                      Partage
                    </span>
                  )}
                  {item.permissions.canDelete && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded">
                      Suppression
                    </span>
                  )}
                </div>
              </div>

              {/* Utilisateurs partagés */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Partagé avec
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.sharedWith.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal de partage */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          onShare={(shareData) => {
            console.log('Nouveau partage:', shareData);
            setIsShareModalOpen(false);
          }}
        />

        {/* Historique des partages */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Historique des partages
          </h2>
          <ShareHistory />
        </div>
      </div>
    </div>
  );
};

export default SharePage; 