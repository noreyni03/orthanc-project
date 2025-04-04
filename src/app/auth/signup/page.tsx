// src/app/auth/signup/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import { signIn } from 'next-auth/react'; // For Google sign in

import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/auth/Input';
import Button from '@/components/auth/Button';
import SocialButton, { GoogleIcon } from '@/components/auth/SocialButton'; // Import icon too

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return false;
    }
    setError(null); // Clear error if validation passes
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name || null, // Send null if empty
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        // Attempt to parse error message from backend
        let errorMsg = 'Une erreur est survenue lors de l\'inscription.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (parseError) {
          // Ignore if response body is not JSON or empty
        }
        throw new Error(errorMsg);
      }

      // Success
      console.log('Inscription réussie !');
      // Optionally show a success message briefly before redirecting
      router.push('/auth/login?signupSuccess=true'); // Redirect to login

    } catch (err: any) {
      console.error("Signup Error:", err);
      setError(err.message || 'Erreur lors de la connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Créer votre compte">
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="rounded-md border border-red-500/50 bg-red-900/20 p-3 text-center text-sm text-red-400 animate-shake">
            {error}
          </div>
        )}

        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Nom (facultatif)"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
        />
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Adresse email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          hasError={!!error && (error.toLowerCase().includes('email') || error.includes('obligatoires'))}
        />
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Mot de passe (min. 6 caractères)"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          hasError={!!error && (error.toLowerCase().includes('passe') || error.includes('obligatoires'))}
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Confirmer le mot de passe"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={loading}
          hasError={!!error && error.toLowerCase().includes('correspondent pas')}
        />

        <div>
          <Button type="submit" loading={loading} disabled={loading}>
            S'inscrire
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
          onClick={() => signIn('google')} // Redirect handled by NextAuth by default
          disabled={loading}
        />
      </div>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-400">Déjà un compte ? </span>
        <Link href="/auth/login" className="font-medium text-cyan-500 hover:text-cyan-400 transition-colors">
          Se connecter
        </Link>
      </div>
    </AuthLayout>
  );
}