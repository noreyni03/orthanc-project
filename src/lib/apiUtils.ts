// src/lib/apiUtils.ts
import { NextResponse } from 'next/server';

/**
 * Crée une réponse d'erreur JSON standardisée pour les API.
 * @param message - Message d'erreur convivial pour l'utilisateur.
 * @param status - Code de statut HTTP pour la réponse.
 * @param details - Optionnel : Détails supplémentaires (ex: erreurs de validation).
 * @returns Une instance de NextResponse configurée.
 */
export function createErrorResponse(
  message: string,
  status: number,
  details?: Record<string, any> | null
): NextResponse {
  const responseBody = {
    success: false,
    message: message,
    // Inclure 'details' seulement s'il est fourni et non null/undefined
    ...(details ? { details } : {}), // Alternative: details: details ?? undefined
  };
  return NextResponse.json(responseBody, { status });
}

// Optionnel: Tu pourrais aussi ajouter une fonction pour les réponses de succès ici
// export function createSuccessResponse(data: any, status: number = 200) { ... }