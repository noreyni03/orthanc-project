// src/app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans"; // Utiliser GeistSans directement
import { GeistMono } from "geist/font/mono"; // Utiliser GeistMono directement
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper"; // Wrapper côté client
import Header from "@/components/Header"; // Importer le Header

export const metadata: Metadata = {
  title: "Orthanc Project - Gestion d'Imagerie Médicale", // Titre plus pertinent
  description: "Une plateforme moderne pour visualiser et gérer les images DICOM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr"> {/* Langue française */}
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden`} // Ajout overflow-x-hidden
      >
        {/* SessionProvider doit être dans un composant client */}
        <SessionProviderWrapper>
          {/* Design à grille fluide - structure de base */}
          <div className="flex flex-col min-h-screen">
             <Header /> {/* Barre de navigation */}
             <main className="flex-grow">
               {/* Intégrer ici la logique pour les transitions de page si nécessaire */}
               {children}
             </main>
             {/* Ajouter un Footer si nécessaire */}
             {/* <Footer /> */}
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}