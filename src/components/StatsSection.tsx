import { motion } from 'framer-motion';
import { FiDatabase, FiUsers, FiEdit, FiCpu, FiBarChart2, FiTrendingUp } from 'react-icons/fi';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import MotionSection from './MotionSection';

const StatsSection = () => {
  const stats = [
    { name: 'Datasets Médicaux', value: '15,000+', icon: FiDatabase, description: "Images annotées et rapports.", change: "+12% ce mois" },
    { name: 'Collaborateurs Actifs', value: '75,000+', icon: FiUsers, description: "Médecins, chercheurs, ingénieurs.", change: "+23% cette année" },
    { name: 'Projets de Recherche', value: '10,000+', icon: FiEdit, description: "Études publiées et en cours.", change: "+45% cette année" },
    { name: 'Modèles Pré-entraînés', value: '500+', icon: FiCpu, description: "Pour diverses spécialités.", change: "+18% ce trimestre" },
    { name: 'Analyses/Mois', value: '3M+', icon: FiBarChart2, description: "Calculs et visualisations.", change: "+62% cette année" },
    { name: 'Partenaires Cliniques', value: '80+', icon: FiTrendingUp, description: "Hôpitaux et centres de recherche.", change: "+15% ce semestre" },
  ];

  return (
    <MotionSection className="bg-white py-20 sm:py-24" delay={0.1}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-6 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.1, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 mb-4 shadow-inner">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-3xl md:text-4xl font-extrabold text-gray-900">{stat.value}</p>
              <p className="mt-1 text-sm font-semibold text-gray-700">{stat.name}</p>
              <p className="mt-1 text-xs text-gray-500 px-2">{stat.description}</p>
              <p className="mt-2 text-xs font-medium text-green-600 flex items-center">
                <ArrowUpIcon className="h-3 w-3 mr-1" />
                {stat.change}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </MotionSection>
  );
};

export default StatsSection;