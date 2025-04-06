// src/app/api/series/[seriesUID]/details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';
import { fetchOrthanc } from '@/lib/orthancApi';
import { createErrorResponse } from '@/lib/apiUtils';

// Placeholder pour la fonction d'audit log
async function logAuditEvent(userId: string, email: string | null | undefined, action: string, details?: any): Promise<void> {
    console.log(`AUDIT LOG: User ${email} (${userId}) performed action: ${action}`, details ? { details } : '');
}

// --- Validation URL Publique Orthanc ---
const NEXT_PUBLIC_ORTHANC_WADO_URL = process.env.NEXT_PUBLIC_ORTHANC_WADO_URL;
if (!NEXT_PUBLIC_ORTHANC_WADO_URL) {
    const errorMsg = "FATAL ERROR: NEXT_PUBLIC_ORTHANC_WADO_URL is not defined in environment variables. Frontend cannot construct WADO URLs.";
    console.error(errorMsg);
    throw new Error(errorMsg);
}

// Schéma de validation pour les paramètres de la route
const paramsSchema = z.object({
  seriesUID: z.string().min(1, "L'UID de la série est requis."),
});

// Rôles autorisés
const allowedRoles = ['TECHNICIAN', 'PHYSICIAN', 'RADIOLOGIST', 'ADMIN'];

// Tags DICOM essentiels pour Cornerstone et le rendu
const requestedInstanceTags = [
    "SOPInstanceUID", "InstanceNumber", "Rows", "Columns", "BitsAllocated",
    "BitsStored", "PixelRepresentation", "PhotometricInterpretation", "PixelSpacing",
    "ImageOrientationPatient", "WindowCenter", "WindowWidth", "SliceThickness",
    "NumberOfFrames", "RescaleIntercept", "RescaleSlope",
].join(',');

// --- AJOUT: Interface pour la structure des métadonnées d'instance ---
interface InstanceMetadata {
    sopInstanceUID: string;
    instanceNumber: number;
    rows: number;
    columns: number;
    bitsAllocated: number;
    bitsStored: number;
    pixelRepresentation: number;
    photometricInterpretation: string;
    windowCenter: number[];
    windowWidth: number[];
    pixelSpacing: number[];
    imageOrientationPatient: number[];
    sliceThickness: number;
    numberOfFrames: number;
    rescaleIntercept: number;
    rescaleSlope: number;
}
// ------------------------------------------------------------------


export async function GET(
    request: NextRequest,
    { params }: { params: { seriesUID: string } }
) {
  // 1. Validation des paramètres
  const paramsValidation = paramsSchema.safeParse(params);
  if (!paramsValidation.success) {
    return createErrorResponse(
      "Paramètres d'URL invalides.",
      400,
      paramsValidation.error.flatten().fieldErrors
    );
  }
  const validatedSeriesUID = paramsValidation.data.seriesUID;

  // 2. Authentification et Autorisation
  const session = await auth();
  if (!session?.user) {
    return createErrorResponse("Authentification requise.", 401);
  }
  const { id: userId, email: userEmail, roles: userRoles } = session.user;

  const hasRequiredRole = userRoles?.some(role => allowedRoles.includes(role));
  if (!hasRequiredRole) {
     try { await logAuditEvent(userId, userEmail, 'SERIES_DETAILS_VIEW_DENIED', { targetId: validatedSeriesUID, reason: 'Insufficient role' }); } catch (e) { console.error("Log error:", e); }
    return createErrorResponse("Accès refusé. Rôle non autorisé.", 403);
  }

  // 3. Appels à Orthanc (Série + Instances)
  try {
    // Appel 1: Obtenir les détails de la série
    const seriesResponse = await fetchOrthanc(`series/${validatedSeriesUID}`);
    if (!seriesResponse.ok) {
      const errorStatus = seriesResponse.status;
      const errorBody = await seriesResponse.text();
      console.error(`Erreur Orthanc (series/${validatedSeriesUID}) - Status ${errorStatus}: ${errorBody}`);
      try { await logAuditEvent(userId, userEmail, 'SERIES_DETAILS_VIEW_FAILED', { targetId: validatedSeriesUID, step: 'fetch_series', orthancStatus: errorStatus, orthancError: errorBody }); } catch (e) { console.error("Log error:", e); }
      if (errorStatus === 404) return createErrorResponse("Série non trouvée.", 404);
      return createErrorResponse(`Erreur communication serveur DICOM (série) (status: ${errorStatus}).`, 502);
    }
    // Utiliser `any` ici car la structure des détails de série est moins critique pour le typage strict que celle des instances
    const seriesData: any = await seriesResponse.json();

    // Appel 2: Obtenir les métadonnées essentielles des instances
    const instancesResponse = await fetchOrthanc(`series/${validatedSeriesUID}/instances?requestedTags=${requestedInstanceTags}`);
    if (!instancesResponse.ok) {
        const errorStatus = instancesResponse.status;
        const errorBody = await instancesResponse.text();
        console.error(`Erreur Orthanc (series/${validatedSeriesUID}/instances) - Status ${errorStatus}: ${errorBody}`);
         try { await logAuditEvent(userId, userEmail, 'SERIES_DETAILS_VIEW_FAILED', { targetId: validatedSeriesUID, step: 'fetch_instances', orthancStatus: errorStatus, orthancError: errorBody }); } catch (e) { console.error("Log error:", e); }
        return createErrorResponse(`Erreur communication serveur DICOM (instances) (status: ${errorStatus}).`, 502);
    }
    // Utiliser `any[]` ici aussi, car on va mapper vers notre type strict ensuite
    const instancesData: any[] = await instancesResponse.json();

    // 4. Extraction et Formatage des Données
    const seriesDetails = {
        seriesInstanceUID: seriesData.MainDicomTags?.SeriesInstanceUID || validatedSeriesUID,
        modality: seriesData.MainDicomTags?.Modality || 'N/A',
        seriesNumber: seriesData.MainDicomTags?.SeriesNumber || null,
        seriesDescription: seriesData.MainDicomTags?.SeriesDescription || '',
        bodyPartExamined: seriesData.MainDicomTags?.BodyPartExamined || '',
        patientPosition: seriesData.MainDicomTags?.PatientPosition || '',
        studyInstanceUID: seriesData.ParentStudy?.MainDicomTags?.StudyInstanceUID || seriesData.ParentStudy?.ID || null,
    };

    // --- CORRECTION: Utilisation de l'interface pour typer la liste et le map ---
    const instancesList: InstanceMetadata[] = (instancesData || []).map((instance: any): InstanceMetadata => ({
        sopInstanceUID: instance.MainDicomTags?.SOPInstanceUID || instance.ID,
        instanceNumber: parseInt(instance.MainDicomTags?.InstanceNumber || '0', 10),
        rows: parseInt(instance.MainDicomTags?.Rows || '0', 10),
        columns: parseInt(instance.MainDicomTags?.Columns || '0', 10),
        bitsAllocated: parseInt(instance.MainDicomTags?.BitsAllocated || '16', 10),
        bitsStored: parseInt(instance.MainDicomTags?.BitsStored || '16', 10),
        pixelRepresentation: parseInt(instance.MainDicomTags?.PixelRepresentation || '0', 10),
        photometricInterpretation: instance.MainDicomTags?.PhotometricInterpretation || 'MONOCHROME2',
        windowCenter: instance.MainDicomTags?.WindowCenter?.split('\\').map(Number) || [],
        windowWidth: instance.MainDicomTags?.WindowWidth?.split('\\').map(Number) || [],
        pixelSpacing: instance.MainDicomTags?.PixelSpacing?.split('\\').map(Number) || [],
        imageOrientationPatient: instance.MainDicomTags?.ImageOrientationPatient?.split('\\').map(Number) || [],
        sliceThickness: parseFloat(instance.MainDicomTags?.SliceThickness || '0'),
        numberOfFrames: parseInt(instance.MainDicomTags?.NumberOfFrames || '1', 10),
        rescaleIntercept: parseFloat(instance.MainDicomTags?.RescaleIntercept || '0'),
        rescaleSlope: parseFloat(instance.MainDicomTags?.RescaleSlope || '1'),
    }));
    // --------------------------------------------------------------------------

    // Trier les instances par InstanceNumber (maintenant correctement typé)
    instancesList.sort((a, b) => a.instanceNumber - b.instanceNumber);

    // 5. Audit Log (Succès)
    try { await logAuditEvent(userId, userEmail, 'SERIES_DETAILS_VIEW_SUCCESS', { targetId: validatedSeriesUID }); } catch (e) { console.error("Log error:", e); }

    // 6. Réponse au Frontend
    return NextResponse.json({
      seriesDetails,
      instances: instancesList,
      orthancPublicUrl: NEXT_PUBLIC_ORTHANC_WADO_URL,
    });

  } catch (error) {
    // 7. Gestion Générale des Erreurs
    console.error(`Erreur interne dans /api/series/${validatedSeriesUID}/details:`, error);
    try { await logAuditEvent(userId, userEmail, 'SERIES_DETAILS_VIEW_ERROR', { targetId: validatedSeriesUID, error: error instanceof Error ? error.message : String(error) }); } catch (e) { console.error("Log error:", e); }
    return createErrorResponse("Erreur interne du serveur lors de la récupération des détails de la série.", 500);
  }
}