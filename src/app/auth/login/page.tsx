// src/app/auth/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; // Correct imports for App Router
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion'; // Pour les animations
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon, // Icône pour voir le mot de passe
  EyeSlashIcon, // Icône pour cacher le mot de passe
  ArrowPathIcon, // Icône pour le chargement
  ExclamationTriangleIcon, // Icône pour les erreurs
  CheckCircleIcon, // Icône pour le succès
} from '@heroicons/react/24/outline';
import { FcGoogle } from "react-icons/fc"; // Icône Google
import { useInView } from 'react-intersection-observer'; // Pour l'animation d'entrée

// Messages d'erreur NextAuth mappés en français
const errorMessages: Record<string, string> = {
  CredentialsSignin: 'Adresse email ou mot de passe invalide.',
  OAuthSignin: "Erreur lors de la connexion avec le fournisseur externe.",
  OAuthCallback: "Erreur lors du retour du fournisseur externe.",
  OAuthCreateAccount: "Impossible de créer un compte avec ce fournisseur.",
  EmailCreateAccount: "Impossible de créer un compte avec cet email.",
  Callback: "Erreur lors de la redirection après connexion.",
  OAuthAccountNotLinked: "Cet email est déjà associé à un autre compte via un fournisseur différent. Essayez de vous connecter avec ce fournisseur.",
  EmailSignin: "Impossible d'envoyer l'email de connexion.",
  CredentialsCreateAccount: "Impossible de créer un compte avec ces identifiants.",
  SessionRequired: "Veuillez vous connecter pour accéder à cette page.",
  Default: 'Une erreur inattendue est survenue lors de la connexion.',
  "Compte désactivé.": "Votre compte a été désactivé. Veuillez contacter l'administrateur.",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrlParam = searchParams?.get('callbackUrl');
  // MODIFICATION: Assurer que la redirection par défaut est vers /dashboard
  const defaultRedirect = '/dashboard'; // Cible principale pour les utilisateurs non-admin
  const callbackUrl = callbackUrlParam || defaultRedirect;


  const signupSuccess = searchParams?.get('signupSuccess');
  const errorParam = searchParams?.get('error'); // Récupère l'erreur passée par NextAuth

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Chargement pour connexion par identifiants
  const [googleLoading, setGoogleLoading] = useState(false); // Chargement pour connexion Google
  const [passwordVisible, setPasswordVisible] = useState(false); // État pour la visibilité du mot de passe

  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.1, 
  });

  useEffect(() => {
    if (signupSuccess) {
      setSuccessMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('signupSuccess');
      window.history.replaceState({}, '', newUrl.toString());
    }

    if (errorParam) {
      setError(errorMessages[errorParam] || errorMessages.Default);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [signupSuccess, errorParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError('Veuillez entrer votre adresse email.');
      return false;
    }
    if (!formData.password) {
      setError('Veuillez entrer votre mot de passe.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // NextAuth gère la redirection vers callbackUrl si elle est fournie et la connexion réussit.
      // Le callback signIn dans [...nextauth]/route.ts peut surcharger cette redirection (ex: pour les admins).
      const result = await signIn('credentials', {
        // redirect: false, // Commenté/supprimé pour laisser NextAuth gérer la redirection
        email: formData.email,
        password: formData.password,
        callbackUrl: callbackUrl // Fournir la callbackUrl souhaitée
      });

      // Ce bloc est principalement atteint si 'redirect: false' est utilisé, ou si une erreur survient AVANT la redirection.
      // Avec redirect: true (par défaut), si la connexion est OK, l'utilisateur est redirigé.
      // Si une erreur se produit (ex: mauvais identifiants), result.error sera populé et la page ne redirigera pas (elle est réaffichée avec l'erreur dans l'URL).
      if (result?.error) {
        throw new Error(errorMessages[result.error] || errorMessages.Default);
      }
      
      // Si signIn ne redirige pas ET ne retourne pas d'erreur, c'est un cas inattendu ou un flux différent (ex: 2FA)
      // Pour une simple connexion, on s'attend soit à une redirection, soit à une erreur.
      if (result && !result.ok && !result.url) {
        // Ce cas peut se produire si signIn est interrompu ou si une configuration spécifique l'empêche de rediriger.
        // On s'appuie sur errorParam dans l'URL pour afficher l'erreur.
        console.warn("Sign-in result was not OK and did not redirect, but no explicit error returned by signIn function.", result);
      }
      // En cas de succès avec redirect: true (par défaut), l'utilisateur est redirigé par NextAuth,
      // donc le code ici ne devrait pas être atteint sur un succès.
      // La page de login est rechargée par NextAuth avec `?error=...` dans l'URL en cas d'échec.

    } catch (err: any) {
      console.error("Login Error (Credentials):", err);
      setError(err.message || 'Erreur lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      // Laisser NextAuth gérer la redirection. callbackUrl est fournie.
      await signIn('google', { callbackUrl });
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      setError("Impossible de démarrer la connexion avec Google.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8"
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <svg className="h-10 w-10 text-cyan-600 group-hover:text-blue-700 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-5 4 5h-3v4H11z"/>
              </svg>
              <span className="text-3xl font-bold text-cyan-600 group-hover:text-blue-700 transition-colors">Orthanc</span>
            </Link>
          </div>

          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Connectez-vous à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-cyan-600 hover:text-cyan-500 transition-colors"
            >
              créez un compte gratuitement
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-md bg-red-50 p-4 flex items-start border border-red-200"
              >
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" aria-hidden="true" />
                <div className="text-sm text-red-700">{error}</div>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-md bg-green-50 p-4 flex items-start border border-green-200"
              >
                <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" aria-hidden="true" />
                <div className="text-sm text-green-700">{successMessage}</div>
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Adresse email
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading || googleLoading}
                    className={`block w-full rounded-md border-0 py-3 pl-10 pr-3 text-gray-900 ring-1 ring-inset ${
                      error?.toLowerCase().includes('email') || error?.toLowerCase().includes('invalide') ? 'ring-red-500' : 'ring-gray-300'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6 transition-shadow duration-150 ease-in-out`}
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Mot de passe
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? 'text' : 'password'} 
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading || googleLoading}
                    className={`block w-full rounded-md border-0 py-3 pl-10 pr-10 text-gray-900 ring-1 ring-inset ${
                      error?.toLowerCase().includes('passe') || error?.toLowerCase().includes('invalide') ? 'ring-red-500' : 'ring-gray-300'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6 transition-shadow duration-150 ease-in-out`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-600 rounded-md"
                    aria-label={passwordVisible ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                  >
                    {passwordVisible ? (
                      <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm leading-6 text-gray-900">
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  {/* <Link
                    href="/auth/reset-password" 
                    className="font-semibold text-cyan-600 hover:text-cyan-500 transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link> */}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className={`flex w-full justify-center items-center rounded-md bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:from-cyan-700 hover:to-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 transition-all duration-300 ease-in-out ${
                    (loading || googleLoading) ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" aria-hidden="true" />
                      Connexion en cours...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm leading-6">
                  <span className="bg-white px-6 text-gray-500">
                    Ou continuez avec
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading || googleLoading}
                  className={`flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent transition-all duration-200 ease-in-out ${
                    (loading || googleLoading) ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-md'
                  }`}
                >
                  {googleLoading ? (
                     <ArrowPathIcon className="animate-spin h-5 w-5 text-gray-500" aria-hidden="true" />
                  ) : (
                     <FcGoogle className="h-5 w-5" aria-hidden="true" />
                  )}
                  <span className="text-sm font-semibold leading-6">Google</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            En vous connectant, vous acceptez nos{' '}
            <Link href="/terms" className="font-medium text-cyan-600 hover:text-cyan-500">
              Conditions d'utilisation
            </Link>
            {' '}et notre{' '}
            <Link href="/privacy" className="font-medium text-cyan-600 hover:text-cyan-500">
              Politique de confidentialité
            </Link>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}