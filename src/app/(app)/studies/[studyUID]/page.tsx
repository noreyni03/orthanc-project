// src/app/(app)/studies/[studyUID]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import withAuth from '@/components/withAuth';
import { StudyDetailsPageData, SeriesSummaryForStudyPage } from '@/types/dicom';
import { 
  FiCalendar, 
  FiUser, 
  FiFileText, 
  FiTag, 
  FiGrid, 
  FiCamera, 
  FiChevronRight, 
  FiArrowLeft, 
  FiLoader, 
  FiAlertTriangle,
  FiHash // Assurez-vous que FiHash est bien importé ici
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const allowedViewRoles = ['ADMIN', 'RADIOLOGIST', 'TECHNICIAN', 'MEDECIN', 'SECRETARY'];

function StudyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const studyUID = params.studyUID as string;

  const [studyData, setStudyData] = useState<StudyDetailsPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (studyUID) {
      const fetchStudyDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/studies/${studyUID}/details`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erreur ${response.status} lors de la récupération des détails de l'étude.`);
          }
          const data: StudyDetailsPageData = await response.json();
          setStudyData(data);
        } catch (err: any) {
          console.error("Fetch study details error:", err);
          setError(err.message || 'Une erreur inattendue est survenue.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchStudyDetails();
    }
  }, [studyUID]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr || dateStr.length !== 8) return 'N/A';
    return `${dateStr.substring(6, 8)}/${dateStr.substring(4, 6)}/${dateStr.substring(0, 4)}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <FiLoader className="animate-spin h-12 w-12 text-cyan-600 dark:text-cyan-400" />
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Chargement des détails de l'étude...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/50 text-red-700 dark:text-red-300 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]" role="alert">
        <FiAlertTriangle className="h-10 w-10 mb-3" />
        <p className="font-semibold text-lg">Erreur lors du chargement</p>
        <p className="text-sm mb-4">{error}</p>
        <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium rounded-md bg-red-100 dark:bg-red-700/50 text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-600/50 transition-colors"
        >
            <FiArrowLeft className="inline-block h-4 w-4 mr-1.5 align-text-bottom" />
            Retour
        </button>
      </div>
    );
  }

  if (!studyData) {
    return <div className="text-center py-10 text-gray-600 dark:text-gray-400">Aucune donnée d'étude disponible.</div>;
  }

  const { studyDetails, series } = studyData;

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
    >
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
      >
        <FiArrowLeft className="h-4 w-4 mr-2" />
        Retour aux résultats
      </button>

      {/* Section Détails de l'Étude */}
      <section className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Détails de l'Étude
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 break-all">UID: {studyDetails.studyInstanceUID}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
          <DetailItem icon={FiUser} label="Patient" value={studyDetails.patientName || 'N/A'} />
          <DetailItem icon={FiHash} label="ID Patient" value={studyDetails.patientId || 'N/A'} /> {/* Utilisation de FiHash */}
          <DetailItem icon={FiCalendar} label="Date Étude" value={formatDate(studyDetails.studyDate)} />
          <DetailItem icon={FiFileText} label="Description" value={studyDetails.studyDescription || 'N/A'} className="md:col-span-2 lg:col-span-1" />
          {studyDetails.accessionNumber && <DetailItem icon={FiTag} label="Accession #" value={studyDetails.accessionNumber} />}
          {studyDetails.referringPhysicianName && <DetailItem icon={FiUser} label="Médecin Prescripteur" value={studyDetails.referringPhysicianName} />}
          {studyDetails.modalitiesInStudy && studyDetails.modalitiesInStudy.length > 0 && (
             <DetailItem icon={FiCamera} label="Modalités" value={studyDetails.modalitiesInStudy.join(', ')} />
          )}
           <DetailItem icon={FiGrid} label="Nombre de Séries" value={studyDetails.numberOfSeries?.toString() || series.length.toString()} />
           <DetailItem icon={FiCamera} label="Nombre total d'Instances" value={studyDetails.numberOfInstances?.toString() || 'N/A'} />
        </div>
      </section>

      {/* Section Liste des Séries */}
      <section className="mt-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Séries de cette Étude ({series.length})
        </h2>
        {series.length > 0 ? (
          <div className="space-y-4">
            {series.map((s, index) => (
              <motion.div
                key={s.seriesInstanceUID}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  href={`/series/${s.seriesInstanceUID}`}
                  className="block p-5 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:border-cyan-500 dark:hover:border-cyan-400
                             bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                       <div className="mr-3 p-2 bg-gray-100 dark:bg-slate-700 rounded-md">
                         <FiCamera className="h-5 w-5 text-teal-500 dark:text-teal-400" />
                       </div>
                      <div className="min-w-0">
                        <p className="text-md font-semibold text-gray-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 truncate" title={s.seriesDescription || `Série ${s.seriesNumber || 'N/A'}`}>
                          {s.seriesDescription || `Série ${s.seriesNumber || 'N/A'}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 break-all">UID: {s.seriesInstanceUID}</p>
                      </div>
                    </div>
                    <FiChevronRight className="h-6 w-6 text-gray-400 dark:text-gray-500 group-hover:text-cyan-500 ml-2 flex-shrink-0" />
                  </div>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <InfoPill label="Modalité" value={s.modality} />
                    {s.seriesNumber && <InfoPill label="N° Série" value={s.seriesNumber} />}
                    <InfoPill label="Instances" value={s.numberOfInstances.toString()} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700">
             <FiCamera className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-md text-gray-500 dark:text-gray-400">Aucune série trouvée pour cette étude.</p>
          </div>
        )}
      </section>
    </motion.div>
  );
}

// Helper component for displaying detail items consistently
const DetailItem: React.FC<{ icon: React.ElementType; label: string; value: string; className?: string }> = ({ icon: Icon, label, value, className }) => (
  <div className={`flex items-start ${className || ''}`}>
    <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
    <div>
      <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <span className="block text-gray-800 dark:text-gray-100 break-words">{value}</span>
    </div>
  </div>
);

// Helper component for small info pills
const InfoPill: React.FC<{label: string; value: string}> = ({ label, value}) => (
    <div className="truncate">
        <span className="font-medium">{label}:</span> {value}
    </div>
);

export default withAuth(StudyDetailsPage, { allowedRoles: allowedViewRoles });