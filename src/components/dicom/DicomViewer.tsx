// src/components/dicom/DicomViewer.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import Hammer from 'hammerjs';

import { InstanceMetadata } from '@/types/dicom';
import {
  FiZoomIn, FiMove, FiSun, FiRefreshCw,
  FiChevronsLeft, FiChevronLeft, FiChevronRight, FiChevronsRight, FiPlay, FiPause,
  FiLoader, FiAlertTriangle
} from 'react-icons/fi';

// Configuration initiale de Cornerstone (à faire une seule fois globalement)
// Ce bloc peut causer des problèmes avec HMR en dev s'il est ré-exécuté.
// Idéalement, initialiser dans un fichier séparé ou un useEffect avec un flag.
let cornerstoneInitialized = false;
if (typeof window !== 'undefined' && !cornerstoneInitialized) {
  try {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.Hammer = Hammer;

    cornerstoneTools.init({
      mouseEnabled: true,
      touchEnabled: true,
      globalToolSyncEnabled: true,
      showSVGCursors: true,
    });
    
    // Pour la config WebWorker, vous devez servir les fichiers
    // cornerstoneWADOImageLoaderWebWorker.min.js et cornerstoneWADOImageLoaderCodecs.min.js
    // depuis votre dossier /public et ajuster les chemins ici.
    // Exemple:
    // const webWorkerConfig = {
    //   maxWebWorkers: Math.max(1, navigator.hardwareConcurrency - 1 || 1),
    //   startWebWorkersOnDemand: true,
    //   webWorkerPath: '/cornerstoneWADOImageLoaderWebWorker.min.js', 
    //   taskConfiguration: {
    //     decodeTask: {
    //       loadCodecsOnStartup: true,
    //       initializeCodecsOnStartup: true,
    //       codecsPath: '/cornerstoneWADOImageLoaderCodecs.min.js', 
    //       usePDFJS: false,
    //       strict: false,
    //     },
    //   },
    // };
    // cornerstoneWADOImageLoader.webWorkerManager.initialize(webWorkerConfig);

    cornerstoneInitialized = true;
    console.log("Cornerstone initialized successfully.");
  } catch (error) {
    console.warn("Cornerstone initialization error (might be due to HMR or already initialized):", error);
  }
}


interface DicomViewerProps {
  instances: InstanceMetadata[]; // Doit maintenant inclure studyInstanceUID et seriesInstanceUID
  orthancPublicUrl: string; // ex: "http://localhost:8042" (base URL d'Orthanc)
}

const DicomViewer: React.FC<DicomViewerProps> = ({ instances, orthancPublicUrl }) => {
  const dicomImageRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Retrait de viewport ici, car reset() est plus simple et on ne le stocke pas pour l'instant
  // const [viewport, setViewport] = useState<any>(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const imageIds = React.useMemo(() => {
    if (!instances || instances.length === 0 || !orthancPublicUrl) return [];
    
    const sortedInstances = [...instances].sort((a, b) => {
        // S'assurer que instanceNumber est traité comme un nombre pour le tri
        const numA = typeof a.instanceNumber === 'string' ? parseInt(a.instanceNumber, 10) : a.instanceNumber;
        const numB = typeof b.instanceNumber === 'string' ? parseInt(b.instanceNumber, 10) : b.instanceNumber;
        return (numA || 0) - (numB || 0);
    });

    return sortedInstances.map(
      (instance) => {
        if (!instance.studyInstanceUID || !instance.seriesInstanceUID || !instance.sopInstanceUID) {
          console.error("Instance manquant des UIDs nécessaires:", instance);
          // Retourner une chaîne invalide ou null pour filtrer plus tard, ou gérer l'erreur.
          // Pour l'instant, on retourne une chaîne qui échouera probablement au chargement.
          return `error:Instance ${instance.instanceNumber} manquant_des_UIDs`; 
        }
        // Format WADO-URI pour cornerstone-wado-image-loader
        // orthancPublicUrl est la base, ex: http://localhost:8042
        return `wadouri:${orthancPublicUrl}/wado?requestType=WADO&studyUID=${instance.studyInstanceUID}&seriesUID=${instance.seriesInstanceUID}&objectUID=${instance.sopInstanceUID}&contentType=application/dicom&transferSyntax=*`;
      }
    ).filter(id => !id.startsWith('error:')); // Filtrer les IDs invalides
  }, [instances, orthancPublicUrl]);

  const loadAndDisplayImage = useCallback(async (indexToLoad: number) => {
    if (!dicomImageRef.current || imageIds.length === 0 || indexToLoad < 0 || indexToLoad >= imageIds.length) {
      if (imageIds.length > 0) setError("Index d'image invalide.");
      // Ne pas mettre setIsLoading(false) ici si imageIds est vide, car le useEffect principal le gère.
      return;
    }
    setIsLoading(true);
    setError(null);

    const element = dicomImageRef.current;
    const imageId = imageIds[indexToLoad];

    try {
      // cornerstone.enable doit être appelé AVANT cornerstone.loadImage si l'élément n'est pas encore activé
      // ou si on change d'élément. Ici, on l'appelle à chaque fois pour être sûr.
      cornerstone.enable(element);
      
      console.log(`[DICOMViewer] Tentative de chargement imageId: ${imageId}`);
      const image = await cornerstone.loadImage(imageId);
      console.log(`[DICOMViewer] Image chargée:`, image);
      
      cornerstone.displayImage(element, image);
      // const newViewport = cornerstone.getViewport(element) || cornerstone.getDefaultViewportForImage(element, image);
      // setViewport(newViewport); // Retiré pour l'instant

      // Ré-appliquer/configurer les outils à chaque chargement d'image sur cet élément
      // Cela peut être optimisé si l'élément reste le même et seuls les outils/stack changent.
      if (!cornerstoneTools.getToolForElement(element, 'Wwwc')) { // Ajouter les outils seulement s'ils ne sont pas déjà là pour cet élément
        cornerstoneTools.addToolForElement(element, cornerstoneTools.WwwcTool);
        cornerstoneTools.addToolForElement(element, cornerstoneTools.ZoomTool, { configuration: { invert: false, preventZoomOutsideImage: false } });
        cornerstoneTools.addToolForElement(element, cornerstoneTools.PanTool);
        cornerstoneTools.addToolForElement(element, cornerstoneTools.StackScrollMouseWheelTool);
      }

      // Toujours (ré)activer les outils désirés
      cornerstoneTools.setToolActiveForElement(element, 'Wwwc', { mouseButtonMask: 1 });
      cornerstoneTools.setToolActiveForElement(element, 'Zoom', { mouseButtonMask: 4 }); 
      cornerstoneTools.setToolActiveForElement(element, 'Pan', { mouseButtonMask: 2 }); 
      cornerstoneTools.setToolActiveForElement(element, 'StackScrollMouseWheel', {});

      cornerstoneTools.addStackStateManager(element, ['stack']);
      cornerstoneTools.clearToolState(element, 'stack'); // Effacer l'ancien état du stack
      cornerstoneTools.addToolState(element, 'stack', {
        currentImageIdIndex: indexToLoad,
        imageIds: imageIds,
      });
      
      // Ajuster le viewport après le chargement si nécessaire
      // cornerstone.fitToWindow(element); // Optionnel : pour ajuster l'image à la fenêtre

      setIsLoading(false);
    } catch (err: any) {
      console.error(`[DICOMViewer] Erreur chargement/affichage image ${imageId}:`, err);
      setError(`Erreur chargement image (${indexToLoad + 1}): ${err.message || 'Inconnue'}`);
      setIsLoading(false);
    }
  }, [imageIds]); // `index` a été enlevé car c'est `currentImageIndex` qui le gère via l'autre `useEffect`

  useEffect(() => {
    setTotalImages(imageIds.length);
    if (imageIds.length > 0) {
      // Assurer que currentImageIndex est valide avant de charger
      const validIndex = Math.max(0, Math.min(currentImageIndex, imageIds.length - 1));
      if (validIndex !== currentImageIndex) {
        setCurrentImageIndex(validIndex); // Cela déclenchera l'autre useEffect pour charger l'image
      } else {
        loadAndDisplayImage(validIndex);
      }
    } else {
      setIsLoading(false);
      if (instances.length > 0) {
        setError("Impossible de construire les URLs des images DICOM. Vérifiez les UIDs dans les données d'instances.");
      }
    }

    return () => {
      if (dicomImageRef.current) {
        try {
          cornerstone.disable(dicomImageRef.current); // Désactiver l'élément au démontage
        } catch (e) {
          // console.warn("Erreur désactivation élément cornerstone:", e);
        }
      }
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [imageIds]); // Déclencher si imageIds change (ex: nouvelle série chargée)
                 // currentImageIndex et loadAndDisplayImage sont gérés par un autre useEffect

  // useEffect pour charger une nouvelle image quand currentImageIndex change
  useEffect(() => {
    if (imageIds.length > 0 && currentImageIndex >= 0 && currentImageIndex < imageIds.length) {
      loadAndDisplayImage(currentImageIndex);
    }
  }, [currentImageIndex, imageIds, loadAndDisplayImage]);


  const handleImageChange = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < totalImages && newIndex !== currentImageIndex) {
      setCurrentImageIndex(newIndex);
    }
  };

  const handleToolAction = (toolName: 'Wwwc' | 'Zoom' | 'Pan') => {
    if (!dicomImageRef.current) return;
    const element = dicomImageRef.current;
    
    // Désactiver tous les outils actifs sur le clic gauche pour éviter les conflits
    cornerstoneTools.setToolDisabledForElement(element, 'Wwwc', { mouseButtonMask: 1 });
    cornerstoneTools.setToolDisabledForElement(element, 'Zoom', { mouseButtonMask: 1 });
    cornerstoneTools.setToolDisabledForElement(element, 'Pan', { mouseButtonMask: 1 });

    // Activer l'outil sélectionné pour le clic gauche
    cornerstoneTools.setToolActiveForElement(element, toolName, { mouseButtonMask: 1 });

    // Laisser les autres assignations de boutons (molette pour zoom, clic droit pour pan) actives si souhaité
    // cornerstoneTools.setToolActiveForElement(element, 'Zoom', { mouseButtonMask: 4 }); 
    // cornerstoneTools.setToolActiveForElement(element, 'Pan', { mouseButtonMask: 2 });
  };

  const handleReset = () => {
    if (dicomImageRef.current) {
      cornerstone.reset(dicomImageRef.current);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
      setIsPlaying(false);
    } else {
      if (totalImages <= 1) return;
      setIsPlaying(true);
      playIntervalRef.current = setInterval(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % totalImages);
      }, 300); // Vitesse de défilement (ajustez selon besoin)
    }
  };
  
  useEffect(() => { 
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, []);

  const ToolButton: React.FC<{ icon: React.ElementType; label: string; onClick: () => void; isActive?: boolean }> = 
  ({ icon: Icon, label, onClick, isActive }) => (
    <button
      onClick={onClick}
      title={label}
      className={`p-2 rounded-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75
                  ${isActive ? 'bg-cyan-600' : 'bg-slate-700 hover:bg-slate-600'}`}
    >
      <Icon className="h-5 w-5" />
      <span className="sr-only">{label}</span>
    </button>
  );

  // Gestion du cas où il n'y a pas d'instances après le filtrage initial
  if (imageIds.length === 0 && !isLoading && !error && instances.length > 0) {
     // Cela signifie que toutes les instances ont été filtrées (probablement à cause d'UIDs manquants)
     if (!error) setError("Certaines instances n'ont pas pu être préparées pour l'affichage (UIDs manquants).");
  }
  // Cas où il n'y a simplement pas d'instances fournies au composant
  if (instances.length === 0 && !isLoading && !error) {
    return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Aucune instance disponible pour cette série.</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-4 p-3 bg-slate-800 rounded-lg shadow-md flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ToolButton icon={FiZoomIn} label="Zoom" onClick={() => handleToolAction('Zoom')} />
          <ToolButton icon={FiMove} label="Pan" onClick={() => handleToolAction('Pan')} />
          <ToolButton icon={FiSun} label="Fenêtrage (WW/WC)" onClick={() => handleToolAction('Wwwc')} />
          <ToolButton icon={FiRefreshCw} label="Réinitialiser" onClick={handleReset} />
        </div>
        {totalImages > 1 && (
            <div className="flex items-center gap-2 text-white text-sm">
                <button 
                    onClick={togglePlay} 
                    title={isPlaying ? "Pause" : "Play"}
                    className={`p-2 rounded-md transition-colors ${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {isPlaying ? <FiPause className="h-5 w-5" /> : <FiPlay className="h-5 w-5" />}
                </button>
            </div>
        )}
      </div>

      <div className="relative w-full aspect-square sm:aspect-[4/3] max-w-full mx-auto bg-black rounded-md overflow-hidden border-2 border-slate-700">
        <div ref={dicomImageRef} className="w-full h-full select-none" data-testid="dicom-image-element" />
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 backdrop-blur-sm">
            <FiLoader className="animate-spin h-10 w-10 text-cyan-400 mb-3" />
            <p className="text-cyan-300 text-sm">Chargement de l'image...</p>
          </div>
        )}
        {error && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/90 text-red-200 p-4 z-10 backdrop-blur-sm">
             <FiAlertTriangle className="h-8 w-8 mb-2" />
            <p className="font-semibold">Erreur de chargement</p>
            <p className="text-xs text-center max-w-xs">{error}</p>
          </div>
        )}
      </div>

      {totalImages > 1 && (
        <div className="mt-4 p-3 bg-slate-800 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <ToolButton icon={FiChevronsLeft} label="Première image" onClick={() => handleImageChange(0)} />
            <ToolButton icon={FiChevronLeft} label="Image précédente" onClick={() => handleImageChange(currentImageIndex - 1)} />
            <input
              type="range"
              min="0"
              max={totalImages > 0 ? totalImages - 1 : 0}
              value={currentImageIndex}
              onChange={(e) => handleImageChange(parseInt(e.target.value, 10))}
              disabled={isLoading || totalImages <= 1}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer dark:bg-slate-600 accent-cyan-500 mx-3 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <ToolButton icon={FiChevronRight} label="Image suivante" onClick={() => handleImageChange(currentImageIndex + 1)} />
            <ToolButton icon={FiChevronsRight} label="Dernière image" onClick={() => handleImageChange(totalImages - 1)} />
          </div>
          <p className="text-center text-xs text-gray-300">
            Image {totalImages > 0 ? currentImageIndex + 1 : 0} / {totalImages}
          </p>
        </div>
      )}
    </div>
  );
};

export default DicomViewer;