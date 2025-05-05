const ORTHANC_API_BASEURL = process.env.ORTHANC_API_BASEURL;

// Vérification critique de la variable d'environnement au chargement du module
if (!ORTHANC_API_BASEURL || ORTHANC_API_BASEURL.trim() === '') {
  const errorMessage = "FATAL ERROR: La variable d'environnement ORTHANC_API_BASEURL est manquante ou vide. L'application ne peut pas communiquer avec le serveur Orthanc. Vérifiez votre fichier .env ou la configuration d'environnement.";
  console.error(errorMessage);
  throw new Error(errorMessage);
} else {
  console.log("Orthanc API Base URL chargée avec succès depuis l'environnement.");
}

// --- Fonction Utilitaire Fetch ---

/**
 * Effectue un appel fetch vers l'API REST d'Orthanc.
 *
 * IMPORTANT: Cette fonction ne gère PAS la vérification de `response.ok` ni le parsing
 * du corps de la réponse (ex: .json()). La logique appelante est responsable de
 * gérer la réponse d'Orthanc.
 *
 * @param endpoint - Le chemin spécifique de l'API Orthanc (ex: 'studies', 'tools/find').
 *                   Ne doit PAS commencer par '/'.
 * @param options - Options standard de `fetch` (RequestInit). Par défaut: {}.
 *                  Permet de spécifier method, headers, body, etc.
 * @returns Une promesse résolue avec l'objet Response brut de l'appel fetch.
 */
export async function fetchOrthanc(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> { // Utilise le type global Response
  // L'URL de base est validée au chargement du module
  const baseUrl = ORTHANC_API_BASEURL;

  // Construire l'URL complète
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  const url = `${baseUrl}/${cleanEndpoint}`;

  // Préparer les options finales
  const finalOptions: RequestInit = { // Utilise le type global RequestInit
    ...options,
    // headers: { // Exemple si on voulait des headers par défaut
    //   'Accept': 'application/json', // Header souvent utile
    //   ...options.headers, // Permet de surcharger ou ajouter d'autres headers
    // }
    // --- Section pour future authentification ---
    // headers: {
    //   ...options.headers,
    //   'Authorization': `Basic ${Buffer.from('user:pass').toString('base64')}`
    // }
  };

  // Log optionnel
  // console.log(`Fetching Orthanc: ${finalOptions.method || 'GET'} ${url}`);

  try {
    // Utilise le fetch global
    const response = await fetch(url, finalOptions);
    return response;
  } catch (error) {
    console.error(`Erreur réseau lors de l'appel fetch vers Orthanc (${url}):`, error);
    // Relancer l'erreur pour gestion par l'appelant
    throw error;
  }
}