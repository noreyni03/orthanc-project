// src/app/api/dicom/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route'; // Adjust path if needed
import { fetchOrthanc } from '@/lib/orthancApi';
import { createErrorResponse } from '@/lib/apiUtils';

// Placeholder pour la fonction d'audit log - à implémenter séparément
async function logAuditEvent(userId: string, email: string | null | undefined, action: string, details?: any): Promise<void> {
    console.log(`AUDIT LOG: User ${email} (${userId}) performed action: ${action}`, details ? { details } : '');
    // Ne pas lancer d'erreur ici pour ne pas bloquer la requête principale
}

// Rôles autorisés pour l'upload DICOM
const allowedRoles = ['TECHNICIAN', 'ADMIN'];

// Optionnel: Définir une taille maximale par fichier (ex: 100MB)
// const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

export async function POST(request: NextRequest) {
  // 1. Authentification et Autorisation
  const session = await auth();
  if (!session?.user) {
    return createErrorResponse("Authentification requise pour uploader des fichiers DICOM.", 401);
  }
  const { id: userId, email: userEmail, roles: userRoles } = session.user;

  const hasRequiredRole = userRoles?.some(role => allowedRoles.includes(role));
  if (!hasRequiredRole) {
    try { await logAuditEvent(userId, userEmail, 'DICOM_UPLOAD_ATTEMPT_DENIED', { reason: 'Insufficient role' }); } catch (e) { console.error("Log error:", e); }
    return createErrorResponse("Accès refusé. Votre rôle ne permet pas d'uploader des fichiers.", 403);
  }

  // Variables pour suivre les résultats
  let successCount = 0;
  let failureCount = 0;
  const errors: { fileName: string; message: string }[] = [];
  let processedFileCount = 0; // Compteur pour savoir si on a traité au moins un fichier potentiel

  try {
    // 2. Traitement du FormData
    const formData = await request.formData();

    // 3. Itération et Validation/Envoi des Fichiers
    for (const [name, value] of formData.entries()) {
      // Ignorer les champs qui ne sont pas des fichiers
      if (!(value instanceof File)) {
        console.log(`Skipping non-file form field: ${name}`);
        continue;
      }

      const file = value;
      const fileName = file.name || 'unknown_file'; // Utiliser un nom par défaut si manquant
      processedFileCount++;

      // --- Début du traitement d'un fichier individuel ---
      try {
        // Validation Basique (Taille)
        if (file.size === 0) {
          errors.push({ fileName, message: "Fichier vide." });
          failureCount++;
          continue; // Passer au fichier suivant
        }

        // if (file.size > MAX_FILE_SIZE_BYTES) {
        //   errors.push({ fileName, message: `Fichier trop volumineux (limite: ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB).` });
        //   failureCount++;
        //   continue;
        // }

        // Lire le contenu du fichier
        const fileContent = await file.arrayBuffer();

        // Envoyer à Orthanc
        console.log(`Uploading file ${fileName} (${(file.size / 1024).toFixed(2)} KB) to Orthanc...`);
        const orthancResponse = await fetchOrthanc('instances', {
          method: 'POST',
          headers: {
            // Le type MIME standard pour un fichier DICOM unique
            'Content-Type': 'application/dicom',
          },
          body: fileContent,
        });

        // Gérer la réponse d'Orthanc pour ce fichier
        if (!orthancResponse.ok) {
          failureCount++;
          let orthancErrorText = `Erreur inconnue (${orthancResponse.status})`;
          try {
            // Essayer de lire le corps de la réponse d'erreur d'Orthanc
            orthancErrorText = await orthancResponse.text();
          } catch (readError) {
            console.error(`Failed to read Orthanc error response body for ${fileName}:`, readError);
          }
          const errorMessage = `Erreur Orthanc (${orthancResponse.status}): ${orthancErrorText}`;
          console.error(`Orthanc upload failed for ${fileName}: ${errorMessage}`);
          errors.push({ fileName, message: errorMessage });
        } else {
          successCount++;
          console.log(`Successfully uploaded ${fileName} to Orthanc.`);
          // Optionnel: Parser la réponse de succès d'Orthanc si elle contient des infos utiles
          // const successData = await orthancResponse.json();
          // console.log("Orthanc success response:", successData);
        }

      } catch (fileProcessingError) {
        // Gérer les erreurs lors de la lecture ou de l'envoi d'un fichier spécifique
        console.error(`Error processing file ${fileName}:`, fileProcessingError);
        failureCount++;
        errors.push({
          fileName,
          message: fileProcessingError instanceof Error ? fileProcessingError.message : "Erreur inconnue lors du traitement du fichier."
        });
      }
      // --- Fin du traitement d'un fichier individuel ---
    } // Fin de la boucle for

    // 4. Construction de la Réponse Finale
    if (processedFileCount === 0) {
      return createErrorResponse("Aucun fichier trouvé dans la requête FormData.", 400);
    }

    // Log d'audit global
    try {
        await logAuditEvent(userId, userEmail, 'DICOM_UPLOAD_COMPLETED', { successCount, failureCount, totalFilesProcessed: processedFileCount });
    } catch (logError) {
        console.error("Failed to log upload completion event:", logError);
    }

    // Construire le corps de la réponse
    const responseBody = {
      success: failureCount === 0 && successCount > 0, // Vrai succès global si au moins un upload a réussi et aucun n'a échoué
      message: `Upload terminé. ${successCount} succès, ${failureCount} échec(s) sur ${processedFileCount} fichier(s) traité(s).`,
      successCount,
      failureCount,
      // N'inclure la liste détaillée des erreurs que s'il y en a eu
      ...(failureCount > 0 ? { errors } : {}),
    };

    // Déterminer le statut (200 OK est généralement suffisant, le corps détaille le résultat)
    const status = 200;

    return NextResponse.json(responseBody, { status });

  } catch (error) {
    // 5. Gestion Générale des Erreurs (ex: erreur de parsing FormData, etc.)
    console.error("Erreur interne majeure dans /api/dicom/upload:", error);
     try {
         await logAuditEvent(userId, userEmail, 'DICOM_UPLOAD_ERROR', { error: error instanceof Error ? error.message : String(error) });
     } catch (logError) {
         console.error("Failed to log internal upload error event:", logError);
     }
    // Erreur générique si quelque chose d'inattendu se produit avant/pendant la boucle
    if (error instanceof Error && error.message.includes('could not be processed')) { // Erreur potentielle de parsing FormData
         return createErrorResponse("Impossible de traiter les données envoyées. Vérifiez le format.", 400);
     }
    return createErrorResponse("Erreur interne du serveur lors du traitement de l'upload.", 500);
  }
}