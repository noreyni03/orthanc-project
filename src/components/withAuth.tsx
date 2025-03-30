// src/components/withAuth.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Utiliser next/navigation dans App Router
import React, { useEffect } from 'react';

// Interface pour définir les rôles autorisés
interface WithAuthProps {
  allowedRoles?: string[];
}

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthProps = {}
) => {
  const ComponentWithAuth = (props: P) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const isLoading = status === 'loading';
    const user = session?.user;
    const userRoles = user?.roles || [];

    useEffect(() => {
      if (isLoading) return; // Attendre la fin du chargement de la session

      if (!user) {
        // Rediriger vers la page de connexion si non authentifié
        // Ajouter ici une animation de transition si souhaité (ex: fondu)
        router.push('/api/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname));
        return;
      }

      // Vérifier les rôles si spécifié
      if (options.allowedRoles && options.allowedRoles.length > 0) {
        const hasRequiredRole = options.allowedRoles.some(role => userRoles.includes(role));
        if (!hasRequiredRole) {
          // Rediriger vers une page "accès refusé" ou le dashboard
          // Ajouter ici une animation de transition si souhaité
          console.warn("Accès refusé pour le rôle");
          router.push('/dashboard'); // Ou une page /unauthorized
          return;
        }
      }

    }, [isLoading, user, userRoles, router, options.allowedRoles]);

    // Afficher une animation de "vérification" pendant le chargement ou la redirection initiale
    if (isLoading || !user || (options.allowedRoles && !options.allowedRoles.some(role => userRoles.includes(role)))) {
      return (
        <div className="flex justify-center items-center min-h-screen">
           {/* Placeholder pour l'animation de vérification */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="ml-3 text-gray-500">Vérification de l'accès...</p>
        </div>
      );
    }

    // Si authentifié et autorisé, rendre le composant original
    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default withAuth;

// Utilisation dans une page:
// import withAuth from '@/components/withAuth';
// function ProtectedPage() { ... }
// export default withAuth(ProtectedPage, { allowedRoles: ['ADMIN', 'RADIOLOGIST'] });