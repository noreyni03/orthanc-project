// src/app/(app)/search/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import withAuth from '@/components/withAuth';
import { OrthancFindResult } from '@/types/dicom';
import SearchResultCard from '@/components/dicom/SearchResultCard'; // Composant pour afficher chaque résultat
import { FiSearch, FiLoader, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

type SearchFormInputs = {
  patientName: string;
  patientId: string;
  studyDate: string; // YYYYMMDD ou YYYYMMDD-YYYYMMDD
  accessionNumber: string;
  modalities: string; // Sera splité en tableau si besoin
  searchLevel: 'Patient' | 'Study' | 'Series';
};

const allowedSearchRoles = ['ADMIN', 'RADIOLOGIST', 'TECHNICIAN', 'MEDECIN', 'SECRETARY'];

function DicomSearchPage() {
  const { register, handleSubmit, formState: { errors: formErrors }, reset } = useForm<SearchFormInputs>({
    defaultValues: {
      searchLevel: 'Study', // Valeur par défaut pour le niveau de recherche
      patientName: '',
      patientId: '',
      studyDate: '',
      accessionNumber: '',
      modalities: '',
    }
  });

  const [searchResults, setSearchResults] = useState<OrthancFindResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false); // Pour afficher "aucun résultat" seulement après une recherche

  const onSubmit: SubmitHandler<SearchFormInputs> = async (data) => {
    setIsLoading(true);
    setApiError(null);
    setHasSearched(true); // Marquer qu'une recherche a été effectuée
    setSearchResults([]); // Vider les résultats précédents

    const payload: any = {
      searchLevel: data.searchLevel,
    };
    if (data.patientName) payload.patientName = data.patientName;
    if (data.patientId) payload.patientId = data.patientId;
    if (data.studyDate) payload.studyDate = data.studyDate;
    if (data.accessionNumber) payload.accessionNumber = data.accessionNumber;
    if (data.modalities) {
        // Convertir la chaîne de modalités en tableau, en supprimant les espaces et en mettant en majuscules
        payload.modalities = data.modalities.split(',').map(m => m.trim().toUpperCase()).filter(m => m);
    }


    try {
      const response = await fetch('/api/dicom/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur ${response.status} lors de la recherche.`);
      }

      const results: OrthancFindResult[] = await response.json();
      setSearchResults(results);
    } catch (error: any) {
      console.error("Search API error:", error);
      setApiError(error.message || 'Une erreur inattendue est survenue.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    reset(); // Réinitialise le formulaire aux valeurs par défaut
    setSearchResults([]);
    setApiError(null);
    setHasSearched(false);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
        Recherche DICOM
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Patient Name */}
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du Patient</label>
            <input
              id="patientName"
              type="text"
              {...register("patientName")}
              className="block w-full px-3 py-2 rounded-md shadow-sm border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              placeholder="ex: DOE^JOHN"
            />
          </div>

          {/* Patient ID */}
          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID Patient</label>
            <input
              id="patientId"
              type="text"
              {...register("patientId")}
              className="block w-full px-3 py-2 rounded-md shadow-sm border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              placeholder="ex: 123456"
            />
          </div>

          {/* Study Date */}
          <div>
            <label htmlFor="studyDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de l'Étude</label>
            <input
              id="studyDate"
              type="text"
              {...register("studyDate")}
              className="block w-full px-3 py-2 rounded-md shadow-sm border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              placeholder="YYYYMMDD ou YYYYMMDD-YYYYMMDD"
            />
          </div>
          
          {/* Accession Number */}
          <div>
            <label htmlFor="accessionNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Accession Number</label>
            <input
              id="accessionNumber"
              type="text"
              {...register("accessionNumber")}
              className="block w-full px-3 py-2 rounded-md shadow-sm border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              placeholder="ex: AN123XYZ"
            />
          </div>

          {/* Modalities */}
            <div>
                <label htmlFor="modalities" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modalités (séparées par virgule)</label>
                <input
                id="modalities"
                type="text"
                {...register("modalities")}
                className="block w-full px-3 py-2 rounded-md shadow-sm border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                placeholder="ex: CT,MR,XA"
                />
            </div>

          {/* Search Level */}
          <div>
            <label htmlFor="searchLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Niveau de Recherche</label>
            <select
              id="searchLevel"
              {...register("searchLevel")}
              className="block w-full px-3 py-2 rounded-md shadow-sm border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            >
              <option value="Study">Étude</option>
              <option value="Series">Série</option>
              <option value="Patient">Patient</option>
            </select>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
          <button
            type="button"
            onClick={handleClearForm}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium rounded-md border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <FiXCircle className="inline-block h-4 w-4 mr-1.5 align-text-bottom" />
            Effacer
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <FiLoader className="animate-spin h-5 w-5 mr-2" />
            ) : (
              <FiSearch className="h-5 w-5 mr-2" />
            )}
            {isLoading ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>
      </form>

      {/* Affichage des erreurs API */}
      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-4 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/50 text-red-700 dark:text-red-300 flex items-start"
            role="alert"
          >
            <FiAlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
                <p className="font-medium">Erreur lors de la recherche</p>
                <p className="text-sm">{apiError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Résultats de la recherche */}
      <div className="mt-10">
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <FiLoader className="animate-spin h-8 w-8 text-cyan-600 dark:text-cyan-400" />
            <p className="ml-3 text-gray-600 dark:text-gray-400">Chargement des résultats...</p>
          </div>
        )}
        {!isLoading && hasSearched && searchResults.length === 0 && !apiError && (
          <div className="text-center py-10 px-4">
            <FiSearch className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Aucun résultat trouvé.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Veuillez essayer d'affiner vos critères de recherche.</p>
          </div>
        )}
        {!isLoading && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Résultats ({searchResults.length})
            </h2>
            {searchResults.map((item) => (
              <SearchResultCard key={item.ID} item={item} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default withAuth(DicomSearchPage, { allowedRoles: allowedSearchRoles });