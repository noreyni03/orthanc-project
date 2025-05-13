// src/components/dicom/SearchResultCard.tsx
'use client';

import Link from 'next/link';
import { OrthancFindResult } from '@/types/dicom';
import { FiChevronRight, FiFileText, FiCamera, FiUser, FiCalendar, FiHash, FiGrid } from 'react-icons/fi';

interface SearchResultCardProps {
  item: OrthancFindResult;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ item }) => {
  const { PatientName, PatientID } = item.PatientMainDicomTags || item.MainDicomTags || {};
  const { StudyDate, StudyDescription, AccessionNumber, NumberOfStudyRelatedSeries, NumberOfStudyRelatedInstances } = item.MainDicomTags || {};
  const { SeriesDescription, Modality, SeriesNumber, NumberOfSeriesRelatedInstances } = item.MainDicomTags || {};

  let detailUrl = '';
  let title = '';
  let itemTypeIcon = <FiFileText className="h-5 w-5 text-cyan-500" />;

  switch (item.Type) {
    case 'Study':
      detailUrl = `/studies/${item.ID}`;
      title = StudyDescription || AccessionNumber || `Étude du ${StudyDate || 'N/A'}`;
      itemTypeIcon = <FiGrid className="h-5 w-5 text-blue-500" />;
      break;
    case 'Series':
      detailUrl = `/series/${item.ID}`;
      title = SeriesDescription || `Série ${SeriesNumber || 'N/A'} (${Modality || 'N/A'})`;
      itemTypeIcon = <FiCamera className="h-5 w-5 text-teal-500" />;
      break;
    case 'Patient':
      // Pour l'instant, les patients n'ont pas de page de détail dédiée dans cette phase
      // On pourrait lister les études du patient ici ou lier à une future page patient
      title = PatientName || PatientID || 'Patient Inconnu';
      itemTypeIcon = <FiUser className="h-5 w-5 text-purple-500" />;
      detailUrl = '#'; // Pas de lien pour les patients pour le moment ou vers une recherche d'études du patient
      break;
    default:
      title = 'Résultat inconnu';
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr || dateStr.length !== 8) return 'N/A';
    return `${dateStr.substring(6, 8)}/${dateStr.substring(4, 6)}/${dateStr.substring(0, 4)}`;
  };


  return (
    <Link
      href={detailUrl}
      className={`block p-5 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:border-cyan-500 dark:hover:border-cyan-400
                  bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 group
                  ${item.Type === 'Patient' && !detailUrl.startsWith('/') ? 'cursor-default' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4 p-2 bg-gray-100 dark:bg-slate-700 rounded-md">
             {itemTypeIcon}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 truncate" title={title}>
            {title}
          </h3>
        </div>
        {detailUrl.startsWith('/') && <FiChevronRight className="h-6 w-6 text-gray-400 dark:text-gray-500 group-hover:text-cyan-500" />}
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
        {PatientName && (
          <div className="flex items-center">
            <FiUser className="h-4 w-4 mr-2 text-gray-500" />
            <span className="font-medium mr-1">Patient:</span> {PatientName}
          </div>
        )}
        {PatientID && (
          <div className="flex items-center">
            <FiHash className="h-4 w-4 mr-2 text-gray-500" />
            <span className="font-medium mr-1">ID Patient:</span> {PatientID}
          </div>
        )}

        {item.Type === 'Study' && (
          <>
            {StudyDate && (
              <div className="flex items-center">
                <FiCalendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium mr-1">Date Étude:</span> {formatDate(StudyDate)}
              </div>
            )}
            {AccessionNumber && (
              <div className="flex items-center">
                <FiFileText className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium mr-1">Acc. Num.:</span> {AccessionNumber}
              </div>
            )}
             <div className="flex items-center">
                <FiGrid className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium mr-1">Séries:</span> {NumberOfStudyRelatedSeries || 'N/A'}
              </div>
              <div className="flex items-center">
                <FiCamera className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium mr-1">Instances:</span> {NumberOfStudyRelatedInstances || 'N/A'}
              </div>
          </>
        )}

        {item.Type === 'Series' && (
          <>
            {Modality && (
              <div className="flex items-center">
                <FiCamera className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium mr-1">Modalité:</span> {Modality}
              </div>
            )}
            {SeriesNumber && (
              <div className="flex items-center">
                <FiHash className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium mr-1">N° Série:</span> {SeriesNumber}
              </div>
            )}
            <div className="flex items-center col-span-full sm:col-span-1">
                <FiCamera className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium mr-1">Instances:</span> {NumberOfSeriesRelatedInstances || item.Instances?.length || 'N/A'}
            </div>
          </>
        )}
      </div>
       {item.Type === 'Patient' && (
          <p className="mt-3 text-xs text-gray-500 italic">
            La vue détaillée des patients n'est pas encore implémentée.
          </p>
        )}
    </Link>
  );
};

export default SearchResultCard;