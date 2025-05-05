import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { FiDatabase, FiUsers, FiCpu } from 'react-icons/fi';
import { StarIcon } from '@heroicons/react/24/solid';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const MEDICAL_SPECIALTIES = [
  'Radiologie', 'Cardiologie', 'Neurologie', 'Oncologie', 'Pédiatrie',
  'Orthopédie', 'Ophtalmologie', 'Dermatologie', 'Pneumologie', 'Gynécologie',
  'Urologie', 'Endocrinologie', 'Gastroentérologie', 'Néphrologie', 'Hématologie',
  'Rhumatologie', 'Oto-rhino-laryngologie', 'Psychiatrie', 'Anesthésiologie', 'Médecine interne'
];

const DatasetShowcase = ({ updatedDates }: { updatedDates: string[] }) => {
  const datasets = [
    { 
      id: 1, 
      title: 'IRM Cérébrales (Tumeurs Gliome)', 
      description: 'Dataset multi-modalité (T1, T2, FLAIR) pour la segmentation de gliomes.', 
      category: 'Neuro-oncologie', 
      stats: '5.8k Utilisations', 
      image: '/images/image_2.jpg', 
      tags: ['IRM', 'Cerveau', 'Gliome'],
      size: '1.2TB',
      cases: '1,200',
      modalities: ['T1', 'T2', 'FLAIR'],
      license: 'CC-BY-NC 4.0',
      updated: updatedDates[0]
    },
    { 
      id: 2, 
      title: 'COVID-19 Radios Thorax', 
      description: 'Large collection de rayons X pulmonaires pour l\'étude et la détection de COVID-19.', 
      category: 'Pneumologie', 
      stats: '12.1k Utilisations', 
      image: '/images/image_3.jpg', 
      tags: ['Rayon X', 'Poumon', 'COVID-19'],
      size: '850GB',
      cases: '3,450',
      modalities: ['Rayons X'],
      license: 'CC-BY 4.0',
      updated: updatedDates[1]
    },
    { 
      id: 3, 
      title: 'OCT Rétiniennes (DMLA)', 
      description: 'Images de tomographie par cohérence optique pour la dégénérescence maculaire liée à l\'âge.', 
      category: 'Ophtalmologie', 
      stats: '3.2k Utilisations', 
      image: '/images/image_4.jpg', 
      tags: ['OCT', 'Rétine', 'DMLA'],
      size: '420GB',
      cases: '780',
      modalities: ['OCT'],
      license: 'CC-BY-NC-SA 4.0',
      updated: updatedDates[2]
    },
    { 
      id: 4, 
      title: 'Échographies Fœtales Biométrie', 
      description: 'Dataset pour l\'estimation automatique de la biométrie fœtale (PC, PA, LF).', 
      category: 'Obstétrique', 
      stats: '1.9k Utilisations', 
      image: '/images/image_5.jpg', 
      tags: ['Échographie', 'Fœtus', 'Biométrie'],
      size: '320GB',
      cases: '1,050',
      modalities: ['Ultrasons'],
      license: 'CC-BY 4.0',
      updated: updatedDates[3]
    },
    { 
      id: 5, 
      title: 'Scans CT Abdominaux (Organes)', 
      description: 'Collection de CT pour la segmentation multi-organes (Foie, Rate, Reins...).', 
      category: 'Radiologie Abdominale', 
      stats: '4.5k Utilisations', 
      image: '/images/image_6.jpg', 
      tags: ['CT', 'Abdomen', 'Segmentation'],
      size: '2.1TB',
      cases: '950',
      modalities: ['CT'],
      license: 'CC-BY-NC 4.0',
      updated: updatedDates[4]
    },
    { 
      id: 6, 
      title: 'Mammographies (Dépistage Cancer)', 
      description: 'Dataset de mammographies pour le développement d\'outils CAD pour le cancer du sein.', 
      category: 'Sénologie', 
      stats: '7.0k Utilisations', 
      image: '/images/image_7.jpg', 
      tags: ['Mammo', 'Sein', 'Cancer'],
      size: '1.5TB',
      cases: '2,300',
      modalities: ['Mammographie'],
      license: 'CC-BY-SA 4.0',
      updated: updatedDates[5]
    },
  ];

  return (
    <motion.section className="bg-gradient-to-b from-white to-gray-50 py-20 sm:py-24" id="datasets">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Bibliothèque de Données</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Datasets Médicaux Validés et Prêts à l'emploi
          </p>
          <p className="mt-5 max-w-3xl text-xl text-gray-500 mx-auto">
            Alimentez vos recherches et vos modèles avec des données de haute qualité issues de sources diverses.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium">
            Tous
          </button>
          {MEDICAL_SPECIALTIES.slice(0, 8).map((specialty) => (
            <button 
              key={specialty}
              className="px-4 py-2 rounded-full bg-white text-gray-700 text-sm font-medium border border-gray-300 hover:bg-gray-50"
            >
              {specialty}
            </button>
          ))}
          <button className="px-4 py-2 rounded-full bg-white text-blue-600 text-sm font-medium border border-blue-200 hover:bg-blue-50 flex items-center">
            Plus <ChevronDownIcon className="ml-1 h-4 w-4" />
          </button>
        </div>

        <div className="mb-16">
          <Carousel
            showArrows={true}
            showStatus={false}
            showIndicators={true}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            stopOnHover={true}
            swipeable={true}
            dynamicHeight={false}
            emulateTouch={true}
            className="rounded-xl overflow-hidden shadow-lg"
          >
            {datasets.slice(0, 3).map((dataset) => (
              <div key={`carousel-${dataset.id}`} className="relative h-96">
                <Image
                  src={dataset.image}
                  alt={dataset.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-600 text-white mb-3">
                    {dataset.category}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{dataset.title}</h3>
                  <p className="mb-4">{dataset.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dataset.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/datasets/${dataset.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50"
                  >
                    Explorer ce dataset
                  </Link>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {datasets.map((dataset, index) => (
            <motion.div
              key={dataset.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="group relative bg-white overflow-hidden rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col transform hover:scale-[1.03]"
            >
              <div className="h-56 w-full relative flex-shrink-0 overflow-hidden">
                <Image
                  src={dataset.image}
                  alt={`Aperçu ${dataset.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                <span className="absolute top-3 right-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800 shadow-sm z-10">
                  {dataset.category}
                </span>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
                  <Link href={`/datasets/${dataset.id}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {dataset.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-600 flex-grow mb-4">{dataset.description}</p>
                
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <FiDatabase className="mr-1 h-3 w-3" />
                    <span>{dataset.size}</span>
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="mr-1 h-3 w-3" />
                    <span>{dataset.cases} cas</span>
                  </div>
                  <div className="flex items-center">
                    <FiCpu className="mr-1 h-3 w-3" />
                    <span>{dataset.modalities.join(', ')}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    <span>Mis à jour {dataset.updated}</span>
                  </div>
                </div>
                
                <div className="mb-4 flex flex-wrap gap-2">
                  {dataset.tags.map((tag) => (
                    <span key={tag} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-2">{dataset.stats}</span>
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-500">4.8</span>
                    </div>
                  </div>
                  <Link
                    href={`/datasets/${dataset.id}`}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 relative z-10 flex items-center group/link"
                  >
                    Explorer
                    <span aria-hidden="true" className="ml-1.5 transition-transform duration-200 group-hover/link:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/datasets"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
          >
            Voir tous les Datasets
            <ChevronDownIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default DatasetShowcase;