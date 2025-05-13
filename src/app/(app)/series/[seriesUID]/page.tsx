// src/app/(app)/series/[seriesUID]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import withAuth from '@/components/withAuth';
import { SeriesDetailsApiResponse } from '@/types/dicom'; // Mise à jour du type
import DicomViewer from '@/components/dicom/DicomViewer'; // Import du viewer
import { FiCamera, FiHash, FiFileText, FiArrowLeft, FiLoader, FiAlertTriangle, FiInfo, FiGrid } from 'react-icons/fi';
import { motion } from 'framer-motion';

const allowedViewRoles = ['ADMIN', 'RADIOLOGIST', 'TECHNICIAN', 'MEDECIN', 'SECRETARY'];

function SeriesDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const seriesUID = params.seriesUID as string;

  const [seriesData, setSeriesData] = useState<SeriesDetailsApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (seriesUID) {
      const fetchSeriesDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/series/${seriesUID}/details`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erreur ${response.status} lors de la récupération des détails de la série.`);
          }
          const data: SeriesDetailsApiResponse = await response.json();
          setSeriesData(data);
        } catch (err: any) {
          console.error("Fetch series details error:", err);
          setError(err.message || 'Une erreur inattendue est survenue.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchSeriesDetails();
    }
  }, [seriesUID]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <FiLoader className="animate-spin h-12 w-12 text-cyan-600 dark:text-cyan-400" />
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Chargement des détails de la série...</p>
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

  if (!seriesData || !seriesData.seriesDetails) {
    return <div className="text-center py-10 text-gray-600 dark:text-gray-400">Aucune donnée de série disponible ou format de données incorrect.</div>;
  }

  const { seriesDetails, instances, orthancPublicUrl } = seriesData;

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Détails de la Série
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 break-all">UID: {seriesDetails.seriesInstanceUID}</p>
        </div>
        <button
          onClick={() => seriesDetails.studyInstanceUID ? router.push(`/studies/${seriesDetails.studyInstanceUID}`) : router.back()}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors self-start sm:self-auto"
        >
          <FiArrowLeft className="h-4 w-4 mr-2" />
          {seriesDetails.studyInstanceUID ? "Retour à l'Étude" : "Retour"}
        </button>
      </div>
      

      {/* Section Informations de la Série */}
      <section className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
          <DetailItem icon={FiCamera} label="Modalité" value={seriesDetails.modality || 'N/A'} />
          <DetailItem icon={FiHash} label="N° Série" value={seriesDetails.seriesNumber || 'N/A'} />
          <DetailItem icon={FiFileText} label="Description" value={seriesDetails.seriesDescription || 'N/A'} className="md:col-span-2 lg:col-span-1"/>
          {seriesDetails.bodyPartExamined && <DetailItem icon={FiInfo} label="Partie du Corps" value={seriesDetails.bodyPartExamined} />}
          {seriesDetails.patientPosition && <DetailItem icon={FiInfo} label="Position Patient" value={seriesDetails.patientPosition} />}
          {seriesDetails.protocolName && <DetailItem icon={FiInfo} label="Protocole" value={seriesDetails.protocolName} />}
          <DetailItem icon={FiGrid} label="Nombre d'Instances" value={instances.length.toString()} />
        </div>
      </section>

      {/* Intégration du Visualiseur DICOM */}
      <section className="mt-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Visualiseur d'Images
        </h2>
        {instances && instances.length > 0 && orthancPublicUrl ? (
          <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
            <DicomViewer instances={instances} orthancPublicUrl={orthancPublicUrl} />
          </div>
        ) : (
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 text-center text-gray-500 dark:text-gray-400">
            <FiCamera className="h-12 w-12 mx-auto mb-2 opacity-50" />
            Impossible d'afficher le visualiseur : données d'instances ou URL Orthanc manquantes.
          </div>
        )}
      </section>
    </motion.div>
  );
}

// Helper component (peut être partagé)
const DetailItem: React.FC<{ icon: React.ElementType; label: string; value: string; className?: string }> = ({ icon: Icon, label, value, className }) => (
  <div className={`flex items-start ${className || ''}`}>
    <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
    <div>
      <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <span className="block text-gray-800 dark:text-gray-100 break-words">{value}</span>
    </div>
  </div>
);

export default withAuth(SeriesDetailsPage, { allowedRoles: allowedViewRoles });