// src/app/api/studies/[studyUID]/details/route.ts
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
    throw new Error(errorMsg); // Bloquer si l'URL publique manque
}

// Schéma de validation pour les paramètres de la route
const paramsSchema = z.object({
  studyUID: z.string().min(1, "L'UID de l'étude est requis."),
});

// Rôles autorisés
const allowedRoles = ['TECHNICIAN', 'PHYSICIAN', 'RADIOLOGIST', 'ADMIN'];

export async function GET(
    request: NextRequest, // Non utilisé mais présent pour la signature
    { params }: { params: { studyUID: string } }
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
  const validatedStudyUID = paramsValidation.data.studyUID;

  // 2. Authentification et Autorisation
  const session = await auth();
  if (!session?.user) {
    return createErrorResponse("Authentification requise.", 401);
  }
  const { id: userId, email: userEmail, roles: userRoles } = session.user;

  const hasRequiredRole = userRoles?.some(role => allowedRoles.includes(role));
  if (!hasRequiredRole) {
    try { await logAuditEvent(userId, userEmail, 'STUDY_DETAILS_VIEW_DENIED', { targetId: validatedStudyUID, reason: 'Insufficient role' }); } catch (e) { console.error("Log error:", e); }
    return createErrorResponse("Accès refusé. Rôle non autorisé.", 403);
  }

  // 3. Appel à Orthanc
  try {
    // Récupérer les détails principaux de l'étude et la liste simplifiée des séries
    const orthancResponse = await fetchOrthanc(`studies/${validatedStudyUID}`);

    // 4. Gestion de la Réponse Orthanc
    if (!orthancResponse.ok) {
      const errorStatus = orthancResponse.status;
      const errorBody = await orthancResponse.text();
      console.error(`Erreur Orthanc (studies/${validatedStudyUID}) - Status ${errorStatus}: ${errorBody}`);
      try { await logAuditEvent(userId, userEmail, 'STUDY_DETAILS_VIEW_FAILED', { targetId: validatedStudyUID, orthancStatus: errorStatus, orthancError: errorBody }); } catch (e) { console.error("Log error:", e); }

      if (errorStatus === 404) {
        return createErrorResponse("Étude non trouvée.", 404);
      }
      return createErrorResponse(`Erreur communication serveur DICOM (status: ${errorStatus}).`, 502);
    }

    // 5. Extraction et Formatage des Données
    const studyData = await orthancResponse.json();

    // Extraire les détails pertinents de l'étude (adapter selon besoin)
    const studyDetails = {
      studyInstanceUID: studyData.MainDicomTags?.StudyInstanceUID || validatedStudyUID,
      patientName: studyData.PatientMainDicomTags?.PatientName || 'N/A',
      patientId: studyData.PatientMainDicomTags?.PatientID || 'N/A',
      studyDate: studyData.MainDicomTags?.StudyDate || 'N/A',
      studyDescription: studyData.MainDicomTags?.StudyDescription || '',
      referringPhysicianName: studyData.MainDicomTags?.ReferringPhysicianName || '',
      modalitiesInStudy: studyData.MainDicomTags?.ModalitiesInStudy || [],
      // Ajouter d'autres tags utiles ici
    };

    // Extraire les informations de base des séries
    const seriesList = (studyData.Series || []).map((serie: any) => ({
      seriesInstanceUID: serie.MainDicomTags?.SeriesInstanceUID || serie.ID, // Utiliser l'ID Orthanc comme fallback
      modality: serie.MainDicomTags?.Modality || 'N/A',
      seriesNumber: serie.MainDicomTags?.SeriesNumber || null,
      seriesDescription: serie.MainDicomTags?.SeriesDescription || '',
      numberOfInstances: serie.Instances?.length || serie.NumberOfInstances || 0, // Préférer le compte réel si disponible
    }));

    // 6. Audit Log (Succès)
    try { await logAuditEvent(userId, userEmail, 'STUDY_DETAILS_VIEW_SUCCESS', { targetId: validatedStudyUID }); } catch (e) { console.error("Log error:", e); }

    // 7. Réponse au Frontend
    return NextResponse.json({
      studyDetails,
      series: seriesList,
      orthancPublicUrl: NEXT_PUBLIC_ORTHANC_WADO_URL, // Inclure l'URL publique
    });

  } catch (error) {
    // 8. Gestion Générale des Erreurs
    console.error(`Erreur interne dans /api/studies/${validatedStudyUID}/details:`, error);
    try { await logAuditEvent(userId, userEmail, 'STUDY_DETAILS_VIEW_ERROR', { targetId: validatedStudyUID, error: error instanceof Error ? error.message : String(error) }); } catch (e) { console.error("Log error:", e); }
    return createErrorResponse("Erreur interne du serveur lors de la récupération des détails de l'étude.", 500);
  }
}