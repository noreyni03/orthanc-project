// src/app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import SessionProviderWrapper from '@/components/SessionProviderWrapper';

export const metadata: Metadata = {
  title: "Orthanc - Plateforme d'Imagerie Médicale Collaborative",
  description: "Collaborez, analysez et partagez des données d'imagerie médicale de manière sécurisée.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <SessionProviderWrapper>
          {/* Structure simplifiée - le contenu spécifique est géré dans page.tsx */}
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}