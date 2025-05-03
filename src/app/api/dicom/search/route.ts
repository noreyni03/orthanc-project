// src/app/api/dicom/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';
import { fetchOrthanc } from '@/lib/orthancApi';
import { createErrorResponse } from '@/lib/apiUtils';


async function logAuditEvent(userId: string, email: string | null | undefined, action: string, details?: any): Promise<void> {
    // Implémentation future : enregistrer l'événement dans la DB ou un système de log
    console.log(`AUDIT LOG: User ${email} (${userId}) performed action: ${action}`, details ? { details } : '');
    // Ne pas lancer d'erreur ici pour ne pas bloquer la requête principale
}

// Schéma de validation Zod pour les critères de recherche
const searchSchema = z.object({
  patientName: z.string().trim().optional(), // Trim whitespace
  patientId: z.string().trim().optional(),
  studyDate: z.string().trim().optional(), // Format YYYYMMDD ou YYYYMMDD-YYYYMMDD
  modalities: z.array(z.string().trim().toUpperCase()).optional(), // Trim & uppercase modalities
  accessionNumber: z.string().trim().optional(),
  searchLevel: z.enum(['Patient', 'Study', 'Series']).default('Study'),
});

// Rôles autorisés pour la recherche
const allowedRoles = ['TECHNICIAN', 'MEDECIN', 'RADIOLOGIST', 'ADMIN']; 

export async function POST(request: NextRequest) {
  // 1. Authentification et Autorisation
  const session = await auth();
  if (!session?.user) {
    return createErrorResponse("Authentification requise pour la recherche DICOM.", 401); // 401 Unauthorized
  }
  const { id: userId, email: userEmail, roles: userRoles } = session.user;

  const hasRequiredRole = userRoles?.some(role => allowedRoles.includes(role));
  if (!hasRequiredRole) {
    // Log de l'audit (tentative non autorisée)
    try {
      await logAuditEvent(userId, userEmail, 'DICOM_SEARCH_ATTEMPT_DENIED', { reason: 'Insufficient role' });
    } catch (logError) {
      console.error("Failed to log denied search attempt:", logError);
    }
    return createErrorResponse("Accès refusé. Votre rôle ne permet pas d'effectuer cette recherche.", 403); // 403 Forbidden
  }

  // 2. Validation du Corps de la Requête
  let body: any;
  try {
      body = await request.json();
  } catch (parseError) {
      console.error("Search API - Invalid JSON body:", parseError);
      return createErrorResponse("Corps de la requête invalide (doit être du JSON).", 400);
  }

  const validationResult = searchSchema.safeParse(body);
  if (!validationResult.success) {
    return createErrorResponse(
      "Critères de recherche invalides.",
      400,
      validationResult.error.flatten().fieldErrors
    );
  }

  // Données de recherche validées
  const searchData = validationResult.data;

  // 3. Construction et Exécution de la Requête Orthanc
  try {
    // Construction de l'objet Query pour Orthanc
    const orthancQueryPayload: Record<string, any> = {
      Level: searchData.searchLevel,
      Query: {},
      Expand: true, // Demander les détails étendus
      // Limit: 100, // Optionnel: Limiter le nombre de résultats
      // Since: 0, // Optionnel: Pour la pagination
    };

    // Ajout conditionnel des champs de recherche à la Query Orthanc
    if (searchData.patientName) {
      // Recherche partielle insensible à la casse (wildcards)
      orthancQueryPayload.Query.PatientName = `*${searchData.patientName}*`;
    }
    if (searchData.patientId) {
      orthancQueryPayload.Query.PatientID = searchData.patientId;
    }
    if (searchData.studyDate) {
      orthancQueryPayload.Query.StudyDate = searchData.studyDate; // Orthanc gère YYYYMMDD et YYYYMMDD-YYYYMMDD
    }
    if (searchData.modalities && searchData.modalities.length > 0) {
      // Orthanc attend une chaîne séparée par des backslashes pour les séquences VR=CS
      orthancQueryPayload.Query.ModalitiesInStudy = searchData.modalities.join('\\');
    }
    if (searchData.accessionNumber) {
      orthancQueryPayload.Query.AccessionNumber = searchData.accessionNumber;
    }
    // Ajouter d'autres champs ici si nécessaire
    // if (searchData.referringPhysicianName) {
    //   orthancQueryPayload.Query.ReferringPhysicianName = `*${searchData.referringPhysicianName}*`;
    // }

    // Appel à Orthanc via l'utilitaire fetchOrthanc
    console.log("Sending query to Orthanc:", JSON.stringify(orthancQueryPayload));
    const orthancResponse = await fetchOrthanc('tools/find', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orthancQueryPayload),
    });

    // 4. Gestion de la Réponse d'Orthanc
    if (!orthancResponse.ok) {
      const errorStatus = orthancResponse.status;
      const errorBody = await orthancResponse.text(); // Lire le corps pour le log
      console.error(`Erreur Orthanc (${errorStatus}): ${errorBody}`);
      // Log de l'audit (échec Orthanc)
      try {
          await logAuditEvent(userId, userEmail, 'DICOM_SEARCH_FAILED', { query: searchData, orthancStatus: errorStatus, orthancError: errorBody });
      } catch (logError) {
          console.error("Failed to log failed search event:", logError);
      }
      // Retourner une erreur 502 (Bad Gateway) car notre serveur a eu un problème avec Orthanc
      return createErrorResponse(`Erreur lors de la communication avec le serveur DICOM (status: ${errorStatus}).`, 502);
    }

    // Parse de la réponse JSON si succès
    let searchResults: any;
    try {
        searchResults = await orthancResponse.json();
    } catch (jsonError) {
        console.error("Failed to parse JSON response from Orthanc:", jsonError);
        const responseText = await orthancResponse.text(); // Log raw response
        console.error("Orthanc raw response:", responseText);
         try {
            await logAuditEvent(userId, userEmail, 'DICOM_SEARCH_FAILED', { query: searchData, reason: 'Invalid JSON response from Orthanc' });
         } catch (logError) { console.error("Failed to log failed search event:", logError); }
        return createErrorResponse("Réponse invalide reçue du serveur DICOM.", 502);
    }


    // 5. Audit Log (Succès)
    try {
      // Logguer uniquement les critères fournis, pas tout l'objet data avec les undefined
      const providedCriteria = Object.fromEntries(
          Object.entries(searchData).filter(([_, v]) => v !== undefined)
      );
      await logAuditEvent(userId, userEmail, 'DICOM_SEARCH_SUCCESS', { criteria: providedCriteria, resultCount: Array.isArray(searchResults) ? searchResults.length : 'N/A' });
    } catch (logError) {
      console.error("Failed to log successful search event:", logError);
      // Ne pas bloquer la réponse pour une erreur de log
    }

    // 6. Réponse au Frontend
    return NextResponse.json(searchResults); // Retourne les résultats bruts d'Orthanc

  } catch (error) {
    // 7. Gestion Générale des Erreurs (Internes à cette API Route)
    console.error("Erreur interne dans /api/dicom/search:", error);
     // Log de l'audit (échec interne)
    try {
        await logAuditEvent(userId, userEmail, 'DICOM_SEARCH_ERROR', { query: searchData, error: error instanceof Error ? error.message : String(error) });
    } catch (logError) {
        console.error("Failed to log internal search error event:", logError);
    }
    return createErrorResponse("Erreur interne du serveur lors de la recherche DICOM.", 500);
  }
}