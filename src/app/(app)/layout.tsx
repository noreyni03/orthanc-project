// src/app/(app)/layout.tsx
import React from 'react';
// import Navbar from '@/components/Navbar'; // Retire l'import de Navbar
import Sidebar from '@/components/layout/Sidebar';
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased text-gray-900 dark:text-gray-100`}>
      <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
        <Sidebar /> {/* La Sidebar reste fixe à gauche */}
        {/*
          Le conteneur principal pour le contenu à droite de la Sidebar.
          Il prendra toute la largeur restante et permettra le scroll vertical.
          Le pl-64 pour la version desktop est important pour ne pas que le contenu soit sous la Sidebar.
          Sur mobile, la Sidebar pourrait être cachée ou se superposer, nécessitant une logique JS pour le toggle et l'ajustement du padding.
          Pour cette phase, on suppose une Sidebar toujours visible sur desktop.
        */}
        <div className="flex flex-1 flex-col overflow-hidden lg:pl-64"> {/* pl-64 pour desktop */}
          {/* La Navbar est retirée d'ici */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-950">
            {/* Conteneur pour le contenu avec padding et max-width */}
            <div className="py-6 px-4 sm:px-6 lg:px-8">
                 <div className="max-w-7xl mx-auto">
                     {children}
                 </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}