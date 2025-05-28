'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiLogIn, FiLogOut, FiAlertCircle } from 'react-icons/fi';

interface LoginEvent {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  type: 'login' | 'logout' | 'failed';
  timestamp: string;
  ip: string;
  device: string;
  location: string;
}

const loginEvents: LoginEvent[] = [
  {
    id: '1',
    user: {
      name: 'Dr. Sophie Martin',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    type: 'login',
    timestamp: '2024-03-15 14:30',
    ip: '192.168.1.100',
    device: 'Chrome sur Windows',
    location: 'Paris, France'
  },
  {
    id: '2',
    user: {
      name: 'Dr. Jean Dupont',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    type: 'failed',
    timestamp: '2024-03-15 14:25',
    ip: '192.168.1.101',
    device: 'Safari sur MacOS',
    location: 'Lyon, France'
  },
  {
    id: '3',
    user: {
      name: 'Marie Laurent',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    type: 'logout',
    timestamp: '2024-03-15 14:20',
    ip: '192.168.1.102',
    device: 'Firefox sur Linux',
    location: 'Marseille, France'
  }
];

const LoginHistory = () => {
  const getEventColor = (type: string) => {
    switch (type) {
      case 'login':
        return 'text-green-600 dark:text-green-400';
      case 'logout':
        return 'text-blue-600 dark:text-blue-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login':
        return FiLogIn;
      case 'logout':
        return FiLogOut;
      case 'failed':
        return FiAlertCircle;
      default:
        return FiLogIn;
    }
  };

  const getEventText = (type: string) => {
    switch (type) {
      case 'login':
        return 'Connexion réussie';
      case 'logout':
        return 'Déconnexion';
      case 'failed':
        return 'Échec de connexion';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-4">
      {loginEvents.map((event, index) => {
        const EventIcon = getEventIcon(event.type);
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow p-4"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <img
                  src={event.user.avatar}
                  alt={event.user.name}
                  className="w-8 h-8 rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {event.user.name}
                  </h3>
                  <span className={`text-xs ${getEventColor(event.type)}`}>
                    {getEventText(event.type)}
                  </span>
                </div>
                <div className="mt-1 flex items-center space-x-2">
                  <EventIcon className={`w-4 h-4 ${getEventColor(event.type)}`} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {event.timestamp}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div>
                    <span className="font-medium">IP :</span> {event.ip}
                  </div>
                  <div>
                    <span className="font-medium">Appareil :</span> {event.device}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Localisation :</span> {event.location}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LoginHistory; 