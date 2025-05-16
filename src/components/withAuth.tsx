// src/components/withAuth.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation'; // Utiliser next/navigation dans App Router
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// Interface pour définir les rôles autorisés
interface WithAuthProps {
  allowedRoles?: string[];
}

const ADMIN_ROLE = 'ADMIN';

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthProps = {}
) => {
  const ComponentWithAuth = (props: P) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname(); // Pour obtenir le chemin actuel pour le callbackUrl
    const isLoading = status === 'loading';
    const user = session?.user;
    const userRoles = user?.roles || [];

    useEffect(() => {
      // Optionnel: Logs pour le débogage, à commenter/supprimer en production
      // console.log('[withAuth] Status:', status);
      // console.log('[withAuth] Session:', session);
      // console.log('[withAuth] User object:', user);
      // console.log('[withAuth] User roles:', userRoles);
      // console.log('[withAuth] Page specific allowed roles:', options.allowedRoles);
      // console.log('[withAuth] Current pathname for callback:', pathname);

      if (isLoading) {
        // console.log('[withAuth] Still loading session, returning.');
        return; 
      }

      if (!user) {
        // console.log('[withAuth] User not found after loading, redirecting to login.');
        router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
        return;
      }

      // Si l'utilisateur est ADMIN, on lui donne accès, peu importe les allowedRoles de la page.
      const isAdmin = userRoles.includes(ADMIN_ROLE);
      if (isAdmin) {
        // console.log('[withAuth] User is ADMIN. Access granted automatically.');
        return; // L'admin a accès, pas besoin de vérifier les allowedRoles spécifiques
      }

      // Si l'utilisateur n'est pas ADMIN, alors on vérifie les rôles spécifiques à la page
      if (options.allowedRoles && options.allowedRoles.length > 0) {
        const hasRequiredRole = options.allowedRoles.some(role => userRoles.includes(role));
        // console.log('[withAuth] Has required role (non-admin):', hasRequiredRole);
        if (!hasRequiredRole) {
          // console.warn(`[withAuth] Access denied for non-admin user ${user.email} to path ${pathname}. Redirecting to /dashboard.`);
          router.push('/dashboard'); // Ou une page /unauthorized dédiée
          return;
        }
      }
      // console.log('[withAuth] Access granted (non-admin with required role, or page has no specific role restrictions).');

    }, [isLoading, user, userRoles, router, options.allowedRoles, pathname, session, status]);


    // Afficher une animation de chargement/vérification
    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-slate-900">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 border-4 border-t-cyan-500 border-r-cyan-500 border-b-gray-200 dark:border-b-slate-700 border-l-gray-200 dark:border-l-slate-700 rounded-full"
          ></motion.div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement de la session...</p>
        </div>
      );
    }

    const isAdmin = user?.roles?.includes(ADMIN_ROLE);
    // Si l'utilisateur est en cours de redirection ou n'a pas encore les bons rôles (et n'est pas admin)
    if (!user || (!isAdmin && options.allowedRoles && options.allowedRoles.length > 0 && !options.allowedRoles.some(role => user?.roles?.includes(role)))) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-slate-900">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="h-10 w-10 text-cyan-500"
              >
                <svg className="animate-spin h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </motion.div>
              <p className="mt-3 text-gray-500 dark:text-gray-400">Vérification de l'accès...</p>
            </div>
          );
    }

    // Si authentifié et autorisé, rendre le composant original
    return <WrappedComponent {...props} />;
  };

  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  ComponentWithAuth.displayName = `withAuth(${wrappedComponentName})`;

  return ComponentWithAuth;
};

export default withAuth;