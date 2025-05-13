// src/types/dicom.ts

/**
 * Interface pour les résultats de recherche principaux retournés par l'API Orthanc via /tools/find.
 * Cette structure est typique de ce que Orthanc retourne pour les patients, études ou séries.
 */
export interface OrthancFindResult {
  ID: string; // ID Orthanc de la ressource (PatientID, StudyID, SeriesID)
  ParentPatient?: string; // ID du patient parent (pertinent pour les études et séries)
  ParentStudy?: string; // ID de l'étude parente (pertinent pour les séries)
  Type: 'Patient' | 'Study' | 'Series'; // Niveau de la ressource trouvée
  LastUpdate: string; // Date de dernière mise à jour au format Orthanc (YYYYMMDDTHHMMSS)
  Instances?: string[]; // Pour une série, liste des ID Orthanc de ses instances
  IndexInSeries?: number; // Pour une instance, son index dans la série

  // Tags DICOM principaux, la structure exacte peut varier légèrement selon le 'Type'
  MainDicomTags: {
    // Tags Niveau Patient (disponibles si Type='Patient' ou inclus dans les niveaux inférieurs)
    PatientName?: string;
    PatientID?: string;
    PatientBirthDate?: string; // Format YYYYMMDD
    PatientSex?: string; // M, F, O

    // Tags Niveau Étude
    StudyInstanceUID?: string;
    StudyDate?: string; // Format YYYYMMDD
    StudyTime?: string; // Format HHMMSS
    AccessionNumber?: string;
    StudyDescription?: string;
    ReferringPhysicianName?: string;
    ModalitiesInStudy?: string; // Chaîne de modalités séparées par '\\', ex: "CT\\MR"
    NumberOfStudyRelatedSeries?: string; // Orthanc retourne souvent les nombres sous forme de chaîne
    NumberOfStudyRelatedInstances?: string; // Orthanc retourne souvent les nombres sous forme de chaîne

    // Tags Niveau Série
    SeriesInstanceUID?: string;
    Modality?: string; // ex: CT, MR, US
    SeriesNumber?: string; // Peut être un nombre, mais souvent une chaîne
    SeriesDate?: string; // Format YYYYMMDD
    SeriesTime?: string; // Format HHMMSS
    SeriesDescription?: string;
    BodyPartExamined?: string;
    PatientPosition?: string; // ex: HFP, FFS
    ProtocolName?: string;
    NumberOfSeriesRelatedInstances?: string; // Orthanc retourne souvent les nombres sous forme de chaîne

    // Tags Niveau Instance (si l'objet est une instance, bien que 'tools/find' s'arrête souvent à la série)
    SOPInstanceUID?: string;
    InstanceNumber?: string; // Peut être un nombre, mais souvent une chaîne
    ContentDate?: string;
    ContentTime?: string;
    // Ajoutez d'autres tags DICOM spécifiques si votre API `tools/find` les retourne et qu'ils sont utiles
  };

  // Orthanc inclut souvent les tags du parent pour faciliter l'accès
  PatientMainDicomTags?: OrthancFindResult['MainDicomTags']; // Si Type='Study' ou 'Series'
  StudyMainDicomTags?: OrthancFindResult['MainDicomTags'];   // Si Type='Series'
}


/**
 * Interface pour les données complètes attendues par la page de détails d'une étude.
 * Cette structure est ce que l'API `/api/studies/[studyUID]/details` devrait retourner.
 */
export interface StudyDetailsPageData {
  studyDetails: {
    studyInstanceUID: string;
    patientName: string;
    patientId: string;
    studyDate: string; // Format YYYYMMDD
    studyTime?: string; // Format HHMMSS
    studyDescription: string;
    referringPhysicianName?: string;
    accessionNumber?: string;
    modalitiesInStudy?: string[]; // Tableau de chaînes après traitement, ex: ['CT', 'MR']
    numberOfSeries?: number;
    numberOfInstances?: number; // Nombre total d'instances dans l'étude
  };
  series: SeriesSummaryForStudyPage[]; // Liste des résumés des séries pour cette étude
  orthancPublicUrl: string; // URL de base pour WADO (ex: http://localhost:8042)
}

/**
 * Interface pour le résumé d'une série, utilisée dans la liste des séries sur la page de détails de l'étude.
 */
export interface SeriesSummaryForStudyPage {
  seriesInstanceUID: string;
  modality: string;
  seriesNumber: string | null; // Peut être null ou une chaîne représentant un nombre
  seriesDescription: string;
  numberOfInstances: number;
  // Optionnel: Vous pourriez ajouter ici une URL pour un thumbnail/aperçu de la série
  // thumbnailUrl?: string;
}


/**
 * Interface pour les données complètes attendues par la page de détails d'une série.
 * Cette structure est ce que l'API `/api/series/[seriesUID]/details` devrait retourner.
 */
export interface SeriesDetailsApiResponse {
  seriesDetails: {
    studyInstanceUID: string; // UID de l'étude parente, important pour la navigation et la construction d'URLs WADO
    seriesInstanceUID: string;
    modality: string;
    seriesNumber: string | null;
    seriesDescription: string;
    bodyPartExamined?: string;
    patientPosition?: string;
    protocolName?: string;
    // Ajoutez d'autres tags de la série pertinents pour l'affichage
  };
  instances: InstanceMetadata[]; // Liste des métadonnées détaillées pour chaque instance de la série
  orthancPublicUrl: string; // URL de base pour WADO (ex: http://localhost:8042)
}

/**
 * Interface pour les métadonnées d'une instance DICOM, utilisée par le DicomViewer.
 * Doit contenir tous les champs nécessaires pour la construction de l'imageId WADO et pour la visualisation.
 */
export interface InstanceMetadata {
  // Champs obligatoires pour la construction de l'URL WADO et l'identification
  studyInstanceUID: string;
  seriesInstanceUID: string;
  sopInstanceUID: string;
  instanceNumber: number; // Assurez-vous que c'est un nombre pour le tri

  // Champs DICOM essentiels pour Cornerstone et la visualisation
  rows: number;
  columns: number;
  bitsAllocated: number;
  bitsStored: number;
  pixelRepresentation: number; // 0 pour unsigned, 1 pour signed
  photometricInterpretation: string; // ex: MONOCHROME1, MONOCHROME2, RGB
  
  // Fenêtrage (peuvent être des tableaux si plusieurs valeurs, ou un seul nombre)
  windowCenter: number | number[]; 
  windowWidth: number | number[];
  
  // Géométrie et calibration
  pixelSpacing?: number[]; // [espacementLigne, espacementColonne]
  imageOrientationPatient?: number[]; // 6 valeurs pour les cosinus directeurs
  imagePositionPatient?: number[]; // 3 valeurs [x, y, z] pour la position du coin supérieur gauche
  sliceThickness?: number;
  sliceLocation?: number; // Position de la coupe, utile pour le tri spatial

  // Pour les images multi-frame
  numberOfFrames?: number;

  // Pour la conversion des valeurs de pixels (Modality LUT)
  rescaleIntercept?: number;
  rescaleSlope?: number;

  // Autres tags potentiellement utiles
  imageType?: string[]; // ex: ["ORIGINAL", "PRIMARY", "AXIAL"]
  frameOfReferenceUID?: string;

  // Potentiellement d'autres champs que votre API `/api/series/.../details` extrait
  // ou que Cornerstone pourrait utiliser via des loaders personnalisés.
}