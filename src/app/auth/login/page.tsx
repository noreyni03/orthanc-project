// src/app/auth/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; // Correct imports
import { signIn } from 'next-auth/react';

import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/auth/Input';
import Button from '@/components/auth/Button';
import SocialButton, { GoogleIcon } from '@/components/auth/SocialButton';

// Map NextAuth error keys to user-friendly messages
const errorMessages: { [key: string]: string } = {
  CredentialsSignin: 'Email ou mot de passe invalide.',
  Default: 'Une erreur d\'authentification est survenue.',
  // Add other potential error keys from NextAuth if needed
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/'; // Default redirect to home/dashboard
  const signupSuccess = searchParams?.get('signupSuccess');

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); // Separate loading for Google

  // Display success message on redirect from signup
  useEffect(() => {
    if (signupSuccess) {
      setSuccessMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      // Optional: remove the query param from URL without reloading
      // router.replace('/auth/login', { scroll: false }); // Might need adjustment based on Next version behavior
    }
  }, [signupSuccess, router]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('Veuillez entrer votre email et votre mot de passe.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null); // Clear success message on new attempt

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false, // Handle redirect manually
        email: formData.email,
        password: formData.password,
        // callbackUrl: callbackUrl // Can be passed here, but we handle redirect based on result.ok
      });

      if (result?.error) {
        // Map the error key from NextAuth to a friendly message
        const errorMessage = errorMessages[result.error] || errorMessages.Default;
        throw new Error(errorMessage);
      }

      if (result?.ok) {
        // Success
        console.log('Connexion réussie ! Redirection vers:', callbackUrl);
        router.push(callbackUrl); // Redirect to intended page or default
        // router.refresh(); // Might be needed to update session state display in header immediately
      } else {
         // Handle unexpected non-error, non-ok scenario
         throw new Error(errorMessages.Default);
      }

    } catch (err: any) {
      console.error("Login Error:", err);
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
      // No need for redirect: false here, let NextAuth handle Google's redirect flow
      await signIn('google', { callbackUrl });
      // The page might redirect before this line is reached if successful
    } catch (err) {
       console.error("Google Sign-In Error:", err);
       setError("Impossible de se connecter avec Google.");
       setGoogleLoading(false); // Only set loading false if an error occurs before redirect
    }
    // Don't set googleLoading to false here if successful, as the page will navigate away
  };


  return (
    <AuthLayout title="Se connecter">
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="rounded-md border border-red-500/50 bg-red-900/20 p-3 text-center text-sm text-red-400 animate-shake">
            {error}
          </div>
        )}
        {successMessage && (
           <div className="rounded-md border border-green-500/50 bg-green-900/20 p-3 text-center text-sm text-green-400">
             {successMessage}
           </div>
        )}

        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Adresse email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading || googleLoading}
          hasError={!!error} // Highlight both on generic error
        />
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          disabled={loading || googleLoading}
          hasError={!!error} // Highlight both on generic error
        />

        {/* Optional: Add Remember me and Forgot password link here */}
        {/* <div className="flex items-center justify-between">
          <div className="text-sm">
            <a href="#" className="font-medium text-cyan-500 hover:text-cyan-400">
              Mot de passe oublié ?
            </a>
          </div>
        </div> */}

        <div>
          <Button type="submit" loading={loading} disabled={loading || googleLoading}>
            Se connecter
          </Button>
        </div>
      </form>

       {/* Divider */}
       <div className="relative my-6">
         <div className="absolute inset-0 flex items-center" aria-hidden="true">
           <div className="w-full border-t border-slate-600" />
         </div>
         <div className="relative flex justify-center text-sm">
           <span className="bg-slate-800 px-2 text-gray-400">Ou continuer avec</span>
         </div>
       </div>

       {/* Social Login */}
       <div>
         <SocialButton
           providerName="Google"
           icon={<GoogleIcon />}
           onClick={handleGoogleSignIn}
           disabled={loading || googleLoading} // Disable if credential login is loading too
           // Consider adding a loading indicator specific to this button if needed
         />
         {googleLoading && <p className="mt-2 text-center text-xs text-gray-400">Redirection vers Google...</p>}
       </div>


      <div className="mt-6 text-center text-sm">
        <span className="text-gray-400">Pas encore de compte ? </span>
        <Link href="/auth/signup" className="font-medium text-cyan-500 hover:text-cyan-400 transition-colors">
          S'inscrire
        </Link>
      </div>
    </AuthLayout>
  );
}