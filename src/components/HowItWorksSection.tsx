import { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { 
  FiFolderPlus, FiEye, FiCpu, FiShare2, 
  FiDatabase, FiUsers, FiBarChart2, FiLock 
} from 'react-icons/fi';
import { CpuChipIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import MotionSection from './MotionSection';
import { motion } from 'framer-motion'; // Added this import


const HowItWorksSection = () => {
  const steps = [
    { 
      id: 1, 
      name: 'Importer & Organiser', 
      description: 'Téléversez vos images DICOM ou connectez votre PACS. Anonymisez et structurez vos datasets.', 
      icon: FiFolderPlus,
      details: [
        'Supporte DICOM, NIfTI, NRRD et formats standards',
        'Anonymisation automatique ou manuelle',
        'Organisation par patient, étude ou projet'
      ]
    },
    { 
      id: 2, 
      name: 'Explorer & Annoter', 
      description: 'Utilisez nos viewers avancés pour analyser les images et collaborer sur les annotations.', 
      icon: FiEye,
      details: [
        'Visualisation 2D/3D/MPR',
        'Outils de mesure intégrés',
        'Annotations collaboratives en temps réel'
      ]
    },
    { 
      id: 3, 
      name: 'Analyser & Entraîner', 
      description: 'Lancez des notebooks, utilisez des modèles pré-entraînés ou développez les vôtres sur GPU.', 
      icon: CpuChipIcon,
      details: [
        'Environnements Jupyter pré-configurés',
        'Librairies médicales pré-installées',
        'Accès à des modèles de référence'
      ]
    },
    { 
      id: 4, 
      name: 'Partager & Publier', 
      description: 'Partagez vos résultats de manière sécurisée ou contribuez à la communauté scientifique.', 
      icon: FiShare2,
      details: [
        'Export vers formats standards',
        'Gestion fine des permissions',
        'Intégration avec les revues scientifiques'
      ]
    },
  ];

  return (
    <MotionSection className="bg-white py-20 sm:py-24" delay={0.3} id="how-it-works">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-cyan-600 tracking-wide uppercase">Processus Simplifié</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Comment fonctionne Orthanc ?
          </p>
          <p className="mt-5 max-w-3xl text-xl text-gray-500 mx-auto">
            Quatre étapes simples pour transformer vos données en connaissances.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2" aria-hidden="true"></div>

          <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.15, ease: "backOut" }}
                className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-sm border border-gray-200 relative z-10 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white mb-5 shadow-lg">
                  <span className="text-2xl font-bold">{step.id}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.name}</h3>
                <p className="text-base text-gray-600 mb-4">{step.description}</p>
                
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                        {open ? (
                          <>
                            <span>Moins de détails</span>
                            <MinusIcon className="ml-1 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <span>Plus de détails</span>
                            <PlusIcon className="ml-1 h-4 w-4" />
                          </>
                        )}
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-3 text-sm text-gray-500 text-left">
                        <ul className="space-y-2">
                          {step.details.map((detail, i) => (
                            <li key={i} className="flex items-start">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                <div className="mt-4 text-cyan-500">
                  <step.icon className="h-8 w-8" aria-hidden="true" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MotionSection>
  );
};

export default HowItWorksSection;