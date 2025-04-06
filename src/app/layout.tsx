// --- START OF FILE src/app/layout.tsx ---
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans"; // Utiliser GeistSans directement
import { GeistMono } from "geist/font/mono"; // Utiliser GeistMono directement
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper"; // Wrapper côté client requis pour useSession

// Supprimer l'import du Header redondant
// import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Orthanc - Plateforme d'Imagerie Médicale Collaborative", // Titre affiné
  description: "Collaborez, analysez et partagez des données d'imagerie médicale de manière sécurisée.", // Description affinée
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr"> {/* Langue française */}
      <body
        // Application des polices Geist et styles de base via variables CSS globales
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden`}
      >
        {/* SessionProviderWrapper est essentiel pour que useSession fonctionne dans les composants Client (comme Navbar) */}
        <SessionProviderWrapper>
          {/* Structure principale pour s'assurer que le contenu remplit la page */}
          <div className="flex flex-col min-h-screen">
             {/*
                L'ancien composant <Header /> est supprimé ici.
                La barre de navigation est maintenant gérée par le composant <Navbar />
                qui est inclus directement dans le composant de la page (par exemple, page.tsx).
             */}
             {/* <Header /> */} {/* LIGNE SUPPRIMÉE / COMMENTÉE */}

             {/* Le contenu principal de la page (y compris la Navbar de page.tsx) sera injecté ici */}
             <main className="flex-grow">
               {children}
             </main>

             {/* Le Footer est également géré dans page.tsx pour cette structure,
                 mais pourrait être placé ici s'il devait être global et en dehors de <main> */}
             {/* <Footer /> */}
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
// --- END OF FILE src/app/layout.tsx ---