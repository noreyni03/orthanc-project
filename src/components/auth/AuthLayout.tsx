// src/components/auth/AuthLayout.tsx
import React from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-800/60 backdrop-blur-md p-8 md:p-10 shadow-2xl border border-slate-700">
        <div>
          {/* Optional: Add Logo Here */}
          {/* <Link href="/" className="flex justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-cyan-500">
               ... your logo svg ...
            </svg>
          </Link> */}
          <h2 className="text-center text-3xl font-bold tracking-tight text-white">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;