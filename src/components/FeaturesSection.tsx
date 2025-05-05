import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { 
  FiDatabase, FiCpu, FiUsers, FiEye, FiLock, FiBarChart2, FiMessageSquare, 
  FiFolderPlus, FiShare2, FiSettings, FiLifeBuoy 
} from 'react-icons/fi';
import { 
  AcademicCapIcon, CheckBadgeIcon, ChartBarIcon, BookOpenIcon, 
  CodeBracketIcon, VideoCameraIcon, ShieldCheckIcon 
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import MotionSection from './MotionSection';
import { motion } from 'framer-motion'; // Added this import

const FeaturesSection = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const featureGroups = [
    {
      name: 'Gestion des Données',
      icon: FiDatabase,
      features: [
        { name: 'Visualisation DICOM Interactive', description: 'Outils avancés (MPR, 3D, mesures) et annotations collaboratives en temps réel.', icon: FiEye },
        { name: 'Gestion Sécurisée des Cohortes', description: 'Importez, anonymisez (conforme RGPD/HIPAA) et gérez des datasets complexes.', icon: ShieldCheckIcon },
        { name: 'API Complète', description: 'Connectez Orthanc à vos systèmes existants (PACS, EMR) via notre API complète.', icon: CodeBracketIcon },
      ]
    },
    {
      name: 'Analyse & IA',
      icon: FiCpu,
      features: [
        { name: 'Environnement de Notebooks Intégré', description: 'Codez en Python/R avec accès direct aux données et GPU. Partagez et versionnez.', icon: BookOpenIcon },
        { name: 'Catalogue de Modèles IA', description: 'Explorez, testez et déployez des modèles validés pour l\'aide au diagnostic ou la segmentation.', icon: AcademicCapIcon },
        { name: 'Benchmarking Automatisé', description: 'Comparez les performances de vos modèles avec des benchmarks standardisés.', icon: ChartBarIcon },
      ]
    },
    {
      name: 'Collaboration',
      icon: FiUsers,
      features: [
        { name: 'Partage Contrôlé & Audit', description: 'Permissions fines par utilisateur/groupe. Logs d\'accès détaillés pour la traçabilité.', icon: FiLock },
        { name: 'Tableaux de Bord Analytiques', description: 'Suivez l\'utilisation des données, les performances des modèles et l\'activité collaborative.', icon: FiBarChart2 },
        { name: 'Support Expert & Communauté', description: 'Accès à notre équipe de support et à une communauté active pour l\'entraide.', icon: FiMessageSquare },
      ]
    },
  ];

  return (
    <MotionSection className="bg-gradient-to-b from-gray-50 to-white py-20 sm:py-24" delay={0.2} id="features">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Capacités Clés</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Une suite d'outils pensée pour l'innovation médicale
          </p>
          <p className="mt-5 max-w-3xl text-xl text-gray-500 mx-auto">
            De la donnée brute à la découverte scientifique, Orthanc vous accompagne à chaque étape.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              {featureGroups.map((group) => (
                <Tab
                  key={group.name}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                     ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                     ${selected ? 'bg-white shadow' : 'text-blue-600 hover:bg-white/[0.12] hover:text-white'}`
                  }
                >
                  <div className="flex items-center justify-center">
                    <group.icon className="h-5 w-5 mr-2" />
                    {group.name}
                  </div>
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-6">
              {featureGroups.map((group, idx) => (
                <Tab.Panel
                  key={idx}
                  className={`rounded-xl bg-white p-6 shadow-lg border border-gray-200 ${
                    selectedTab === idx ? 'block' : 'hidden'
                  }`}
                >
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {group.features.map((feature, index) => (
                      <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex flex-col p-4 bg-gray-50 rounded-lg hover:bg-white hover:shadow-md transition-all"
                      >
                        <div className="flex-shrink-0 mb-4">
                          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600">
                            <feature.icon className="h-6 w-6" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                          <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
          >
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                <FiDatabase className="h-6 w-6" />
              </div>
              <h3 className="ml-4 text-xl font-bold text-gray-900">Stockage Sécurisé</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Toutes vos données médicales stockées de manière sécurisée et conforme aux réglementations (RGPD, HIPAA).
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">Chiffrement AES-256</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">Anonymisation automatique</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">Sauvegardes quotidiennes</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
          >
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                <FiCpu className="h-6 w-6" />
              </div>
              <h3 className="ml-4 text-xl font-bold text-gray-900">Puissance de Calcul</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Accélérez vos analyses avec notre infrastructure GPU haute performance dédiée au traitement d'images médicales.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">NVIDIA A100 Tensor Core GPUs</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">Jupyter Notebooks pré-configurés</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">Environnements reproductibles</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
          >
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                <FiUsers className="h-6 w-6" />
              </div>
              <h3 className="ml-4 text-xl font-bold text-gray-900">Collaboration</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Travaillez en équipe avec des outils conçus pour la recherche collaborative en imagerie médicale.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">Annotations partagées</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">Gestion des accès granulaires</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">Versioning des données</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </MotionSection>
  );
};

export default FeaturesSection;