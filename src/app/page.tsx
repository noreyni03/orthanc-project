// src/app/page.tsx
import Image from "next/image";
// Importer des composants pour les animations si vous utilisez des librairies
// import { Parallax } from 'some-parallax-library';
// import ParticleComponent from '@/components/ParticleComponent';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen overflow-x-hidden">

      {/* Section Héros */}
      <section
        id="hero"
        className="w-full h-screen flex flex-col justify-center items-center relative text-center px-4 md:px-8 bg-gradient-to-br from-blue-900/80 via-cyan-900/70 to-teal-900/60" // Exemple de dégradé
        // Ajouter ici les styles/logiques pour le motif abstrait et l'effet parallaxe
      >
         {/* Placeholder pour l'animation d'entrée */}
         <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up"> {/* Utiliser une classe d'animation CSS ou JS */}
           Orthanc Project
         </h1>
         <p className="text-lg md:text-xl text-cyan-200 mb-8 animate-fade-in-up animation-delay-200">
           Révolutionner l'accès à l'imagerie médicale.
         </p>

         {/* Placeholder pour l'image 1 (radio thoracique) avec interaction */}
         <div className="w-full max-w-4xl h-64 md:h-96 relative my-8 perspective-1000">
            {/* Intégrer ici l'image 1 avec effets 3D/parallaxe (ex: avec React Three Fiber ou CSS 3D) */}
           <Image
             src="/images/image1_thorax.jpg" // Assurez-vous que le chemin est correct
             alt="Radiographie Thoracique Interactive"
             layout="fill"
             objectFit="contain"
             className="transition-transform duration-500 ease-out hover:scale-105" // Effet de base au survol
           />
           <div className="absolute inset-0 bg-black/10 pointer-events-none"></div> {/* Effet de superposition */}
         </div>

         {/* Placeholder pour l'appel à l'action */}
         <button className="mt-8 px-8 py-3 bg-cyan-500 text-white font-semibold rounded-full shadow-lg hover:bg-cyan-400 transition-all duration-300 relative overflow-hidden group">
           {/* Animation d'enveloppe lumineuse (ex: via pseudo-éléments CSS animés) */}
           <span className="absolute inset-0 bg-white/20 animate-pulse-light group-hover:animate-none"></span>
           <span className="relative z-10">Commencer l'Exploration</span>
         </button>

         {/* Placeholder pour l'animation de particules */}
         {/* <ParticleComponent className="absolute inset-0 z-[-1]" /> */}
      </section>

      {/* Section Exploration Fonctionnalités */}
      <section id="features" className="w-full py-20 px-4 md:px-8 bg-gray-100 dark:bg-gray-900 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-12">Découvrez la Puissance</h2>
        <div className="max-w-5xl mx-auto relative h-[400px] md:h-[500px]">
          {/* Placeholder pour l'écran 3D simulé avec l'image 2 */}
          <div className="absolute inset-0 flex justify-center items-center perspective-1200">
             {/* Mettre ici la logique pour la rotation 3D au mouvement souris (JS/CSS) */}
             <div className="w-[80%] h-[80%] bg-gray-800 rounded-lg shadow-2xl transform-style-3d transition-transform duration-200 ease-out">
                {/* Intégrer l'image 2 ici, potentiellement dans un carousel */}
               <Image
                 src="/images/image2_brain_scans.jpg" // Chemin correct
                 alt="Scans Cérébraux sur Écran 3D"
                 layout="fill"
                 objectFit="cover"
                 className="rounded-lg"
               />
             </div>
          </div>
        </div>
      </section>

      {/* Section Mobilité Médicale */}
      <section id="mobility" className="w-full py-20 px-4 md:px-8 bg-white dark:bg-black">
         <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">L'Imagerie à portée de Main</h2>
         <div className="max-w-4xl mx-auto relative flex justify-center items-center">
           {/* Placeholder pour la maquette de scène clinique avec tablette (Image 3) */}
           {/* Utiliser une image de fond de scène clinique et superposer la tablette */}
           <div className="relative w-[300px] h-[450px] md:w-[400px] md:h-[600px]">
             {/* Maquette de tablette (peut être une div stylisée ou une image) */}
             <div className="absolute inset-0 border-8 border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/image3_dental_tablet.jpg" // Chemin correct
                  alt="Radiographie Dentaire sur Tablette"
                  layout="fill"
                  objectFit="cover"
                />
             </div>
           </div>
           {/* Ajouter des éléments de scène clinique interactifs autour */}
         </div>
      </section>

      {/* Ajouter d'autres sections si nécessaire */}

    </div>
  );
}