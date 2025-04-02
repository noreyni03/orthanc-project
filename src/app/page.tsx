'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';

// --- Composant DataParticles (INCHANGÉ) ---
const DataParticles = () => {
  // ... (code précédent identique) ...
    const particlesRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; speed: number; color: string }[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const colors = ['#0891b2', '#0e7490', '#06b6d4', '#22d3ee', '#67e8f9'];
      const newParticles = Array.from({ length: 80 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.5 + Math.random() * 2,
        speed: 0.5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
      setParticles(newParticles);
    };

    generateParticles();

    const interval = setInterval(() => {
      if (particlesRef.current && document.visibilityState === 'visible') {
        setParticles(prev => prev.map(particle => ({
          ...particle,
          y: (particle.y + particle.speed / 20) % 100,
          x: particle.x + (Math.sin(particle.y / 10) * 0.1) % 100 // Ajout modulo pour X aussi
        })));
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={particlesRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute rounded-full"
          style={{
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: 0.4 + Math.random() * 0.6,
            boxShadow: `0 0 ${4 + particle.size * 2}px ${particle.color}`,
            filter: 'blur(1px)'
          }}
        />
      ))}
    </div>
  );
};


// --- Composant DicomViewerSimulation (Avec images renommées) ---
const DicomViewerSimulation = () => {
  const [activeLayer, setActiveLayer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  // Utiliser 5 images pour la simulation, par exemple image_2 à image_6
  const sliceImages = [
    "/images/image_2.jpg",
    "/images/image_3.jpg",
    "/images/image_4.jpg",
    "/images/image_5.jpg",
    "/images/image_6.jpg",
  ];
  const slices = Array.from({ length: sliceImages.length }); // S'adapte au nombre d'images
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current); // Clear existing interval
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setActiveLayer(prev => (prev + 1) % sliceImages.length);
    }, 800);
  };

  const stopAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSliceClick = (index: number) => {
    stopAnimation();
    setActiveLayer(index);
  };


  return (
    // ... (Structure HTML/Tailwind du viewer simulé identique) ...
        <div className="relative w-full max-w-md mx-auto h-96 bg-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 right-0 h-8 bg-slate-700 flex items-center px-3 z-10">
        <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
        <div className="ml-4 text-xs text-slate-300">Patient ID: ANON124597 • Brain MRI</div>
      </div>

      <div className="absolute inset-0 mt-8 bg-black">
        <div className="relative h-full w-full">
          {sliceImages.map((src, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-300 flex items-center justify-center"
              style={{ opacity: activeLayer === i ? 1 : 0 }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={src || `/images/placeholder_dicom.jpg`} // Utilise les images renommées
                  alt={`Examen Slice ${i+1}`} // Nom générique
                  fill
                  className="object-contain" // contain pour mieux voir l'image médicale
                />
              </div>
            </div>
          ))}

          {/* Interface contrôles & outils */}
          <div className="absolute top-2 right-2 flex flex-col space-y-2 z-20">
             {/* ... (icônes identiques) ... */}
            <button className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-md flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            <button className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-md flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            <button className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-md flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3" />
              </svg>
            </button>
          </div>

          {/* Annotation exemple */}
          <div className="absolute left-1/3 top-1/3 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-yellow-400 rounded-sm opacity-40"></div>
        </div>
      </div>

      {/* Contrôle coupes */}
      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
        <button
          onClick={() => isPlaying ? stopAnimation() : startAnimation()}
          className="px-2 py-1 bg-cyan-600 hover:bg-cyan-700 rounded text-xs text-white"
        >
          {isPlaying ? 'Pause' : 'Défiler'}
        </button>

        <div className="flex space-x-1">
          {slices.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSliceClick(index)}
              className={`w-5 h-5 rounded-sm flex items-center justify-center text-xs ${
                activeLayer === index ? 'bg-cyan-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Composant FeatureCard (INCHANGÉ) ---
const FeatureCard = ({ title, description, icon, delay = 0 }: { title: string; description: string; icon: string; delay?: number }) => {
  // ... (code précédent identique) ...
    const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500 transform origin-left transition-transform duration-500 ease-out scale-x-0 group-hover:scale-x-100"
      />

      <div className="mb-4 text-cyan-400 flex items-center justify-center w-12 h-12 rounded-lg bg-cyan-900/30">
        <span className="text-2xl">{icon}</span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>

      <div className="mt-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
        <span className="text-sm font-medium">En savoir plus</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </motion.div>
  );
};

// --- Composant AnimatedStats (INCHANGÉ) ---
const AnimatedStats = () => {
  // ... (code précédent identique) ...
    const stats = [
    { value: 99.9, label: "Disponibilité", symbol: "%" },
    { value: 0.25, label: "Temps de réponse", symbol: "s" },
    { value: 3, label: "Intégrations", symbol: "standards" },
    { value: 128, label: "Formats supportés", symbol: "bits" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

        return (
          <motion.div
            key={index}
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/5 rounded-lg" />

            <div className="relative">
              <div className="flex items-center justify-center">
                {/* Animation du nombre - peut être améliorée avec une librairie */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  className="text-4xl font-bold text-white"
                >
                  {stat.value}
                </motion.span>
                <span className="ml-1 text-cyan-400 text-xl">{stat.symbol}</span>
              </div>
              <div className="mt-1 text-gray-400">{stat.label}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// --- Composant AnimatedText (INCHANGÉ) ---
const AnimatedText = ({ text, className = "" }: { text: string; className?: string }) => {
  // ... (code précédent identique) ...
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

  const letters = Array.from(text);

  return (
    <motion.h2
      ref={ref}
      className={`inline-block ${className}`}
      variants={{
          hidden: { opacity: 0 },
          visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: 0.1 * i },
          }),
        }}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.3 }
             },
          }}
          className="inline-block"
        >
          {letter === " " ? <span> </span> : letter}
        </motion.span>
      ))}
    </motion.h2>
  );
};

// --- Composant ScrollProgressBar (INCHANGÉ) ---
const ScrollProgressBar = () => {
  // ... (code précédent identique) ...
    const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500 z-50" // Cyan à la fin aussi
      style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
    />
  );
};

// --- Composant HexagonalGrid (INCHANGÉ) ---
const HexagonalGrid = () => {
 // ... (code précédent identique) ...
    const hexagons = Array.from({ length: 30 });
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 0.4 } : {}}
      transition={{ duration: 1.5 }}
      className="absolute -inset-20 overflow-hidden z-0 pointer-events-none"
    >
      <div className="grid grid-cols-5 gap-10 transform rotate-12 scale-125">
        {hexagons.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 0.1 + Math.random() * 0.3, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: Math.random() * 1 }} // Délai aléatoire
            className="w-40 h-40 relative"
          >
            <div
              className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 border border-cyan-500/30"
              style={{
                clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// --- Composant Principal Home ---
export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]); // Parallax plus prononcé
  const opacityHero = useTransform(scrollY, [0, 300, 500], [1, 0.5, 0]);
  const scaleHero = useTransform(scrollY, [0, 400], [1, 0.8]); // Scale sur une plus grande distance

  const heroRef = useRef<HTMLDivElement>(null); // Référence pour la section Hero

  // Pour le state monté (évite les erreurs d'hydratation avec framer-motion)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Références et états pour les sections InView
  const [heroInViewRef, heroInView] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [presInViewRef, presInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [featInViewRef, featInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statsInViewRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [uiInViewRef, uiInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [testiInViewRef, testiInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaInViewRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  if (!mounted) {
    // Éviter le rendu côté serveur qui pourrait causer des mismatches d'hydratation avec framer-motion
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-900 text-white">
      <ScrollProgressBar />

      {/* Hero Section */}
      <section
        ref={heroInViewRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Fond avec image et dégradé */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/image_9.jpg" // Utilisation d'une image de fond appropriée
            alt="Fond médical abstrait"
            fill
            className="object-cover opacity-20 scale-110 blur-sm" // Effet subtil
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900 to-slate-900" />
        </div>

        {/* Particules en arrière plan */}
        <DataParticles />

        {/* Contenu du Hero avec animations */}
        <motion.div
          // style={{ y: y1, opacity: opacityHero, scale: scaleHero }} // Parallax peut être complexe, utiliser inView pour l'instant
          initial={{ opacity: 0, y: 50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          {/* ... (Badge, Titre H1, Paragraphe P comme avant) ... */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }} // Délai léger
            className="mb-4 inline-block py-2 px-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
          >
            <span className="text-sm font-medium text-cyan-400 tracking-wider">DEMAIN COMMENCE AUJOURD'HUI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500 bg-clip-text text-transparent">Orthanc</span>
            <span className="text-white"> Project</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-light"
          >
            Une révolution dans l'imagerie médicale : diagnostics précis, collaboration sécurisée, et workflow optimisé.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
             {/* ... (Boutons identiques) ... */}
            <Link href="/api/auth/signin/google" passHref> {/* Lien direct pour Google */}
               <motion.button
                 whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)' }}
                 whileTap={{ scale: 0.95 }}
                 className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
               >
                 Commencer Maintenant
               </motion.button>
            </Link>
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="px-8 py-4 bg-transparent border border-cyan-500/50 hover:border-cyan-500 text-white font-semibold rounded-lg transition-all duration-300"
             >
               Voir la Démo
             </motion.button>
          </motion.div>
        </motion.div>

        {/* Indicateur de scroll animé */}
        <div className="absolute bottom-12 left-0 right-0 z-10 flex justify-center">
           {/* ... (code SVG identique) ... */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Section Présentation avec DicomViewerSimulation */}
      <section ref={presInViewRef} className="relative py-24 px-4 overflow-hidden bg-slate-900">
        <HexagonalGrid />
        <div className="relative max-w-7xl mx-auto z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texte à gauche */}
            <div className="order-2 lg:order-1">
               {/* ... (Titre AnimatedText, paragraphe motion.p identiques) ... */}
               <div className="mb-8">
                <AnimatedText
                  text="Une Nouvelle Ère de l'Imagerie Médicale"
                  className="text-4xl font-bold text-white mb-4"
                />

                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "40%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }} // Délai légèrement ajusté
                  className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mb-6"
                />

                <div className="space-y-4 text-gray-300">
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={presInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <span className="text-cyan-400 font-semibold">orthanc-project</span> redéfinit l'interaction avec les données DICOM grâce à une architecture web moderne, sécurisée et interopérable.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={presInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Conçu pour les professionnels de santé, notre système centralise l'accès, la recherche et la visualisation des images médicales tout en optimisant les flux de travail cliniques.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={presInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-8 flex items-center"
                >
                  <Link href="/dashboard" className="group inline-flex items-center"> {/* Pointe vers le dashboard */}
                    <span className="text-cyan-400 font-medium mr-2 group-hover:mr-4 transition-all">Découvrir la plateforme</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </div>
            {/* DicomViewerSimulation à droite */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              animate={presInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="order-1 lg:order-2 relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-md opacity-50"></div>
              <div className="relative transform-style-3d perspective-1200"> {/* Perspective pour la simulation */}
                 <DicomViewerSimulation />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

       {/* Section Fonctionnalités */}
      <section ref={featInViewRef} className="relative py-24 px-4 bg-gradient-to-b from-slate-900 via-black/30 to-slate-900">
        {/* ... (Titre, description identiques) ... */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-3 py-1 px-3 rounded-full bg-cyan-900/30 text-cyan-400 text-sm font-medium">
              CAPACITÉS
            </div>

            <AnimatedText
              text="Un Écosystème Complet d'Imagerie"
              className="text-4xl font-bold text-white mb-4"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={featInView ? { opacity: 1} : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-2xl mx-auto text-gray-400"
            >
              Découvrez les fonctionnalités avancées qui font d'orthanc-project la solution idéale pour les établissements de santé modernes.
            </motion.p>
          </div>
        {/* Grille FeatureCard identique */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
              title="Visualisation Haute Fidélité"
              description="Affichage interactif des images DICOM avec outils avancés d'annotation et de mesure directement dans votre navigateur."
              icon="👁️" // Emoji plus pertinent
              delay={0.1}
            />
            <FeatureCard
              title="Sécurité Conforme" // Précision
              description="Authentification multi-facteurs, contrôle d'accès basé sur les rôles et audit complet pour la conformité RGPD."
              icon="🛡️"
              delay={0.2}
            />
            <FeatureCard
              title="Workflow Optimisé" // Plus direct
              description="Réception DICOM Push, importation manuelle intuitive et indexation rapide pour accélérer le diagnostic."
              icon="⚡"
              delay={0.3}
            />
            <FeatureCard
              title="Partage Simplifié"
              description="Partage sécurisé d'études via liens contrôlés pour faciliter la téléexpertise et les avis confraternels."
              icon="🔗"
              delay={0.4}
            />
            <FeatureCard
              title="Interopérabilité Standard"
              description="Intégration SIH/DPI via HL7 FHIR et DICOMweb pour une vue patient unifiée et des échanges fluides."
              icon="🌐"
              delay={0.5}
            />
            <FeatureCard
              title="Technologie Moderne" // Plus clair
              description="Stack Next.js, React, TypeScript et Prisma garantissant performance, maintenabilité et évolutivité."
              icon="⚙️"
              delay={0.6}
            />
        </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section ref={statsInViewRef} className="relative py-20 px-4 bg-slate-900">
         {/* ... (AnimatedStats identique) ... */}
         <div className="max-w-6xl mx-auto">
          <div className="relative z-10 py-10">
            <AnimatedStats />
          </div>
        </div>
      </section>

      {/* Section Interface (avec image renommée) */}
      <section ref={uiInViewRef} className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800/30">
         {/* ... (Titre, description identiques) ... */}
         <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-3 py-1 px-3 rounded-full bg-cyan-900/30 text-cyan-400 text-sm font-medium">
              EXPÉRIENCE UTILISATEUR
            </div>

            <AnimatedText
              text="Interface Conçue pour les Professionnels"
              className="text-4xl font-bold text-white mb-4"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={uiInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-2xl mx-auto text-gray-400"
            >
              Une expérience utilisateur intuitive et performante, développée en collaboration avec des radiologues et cliniciens.
            </motion.p>
          </div>
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={uiInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
          {/* ... (Divs de style identiques) ... */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-lg opacity-50"></div>
            <div className="relative bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/20 p-2">
            <Image
              src="/images/image_7.jpg" // Image renommée (ex: IRM colonne)
              alt="Exemple Interface Orthanc Project"
              width={1200}
              height={800}
              className="rounded-xl w-full h-auto object-cover shadow-inner" // Effet shadow-inner
            />
          </div>
        </motion.div>
        {/* ... (Grid des 3 points forts identique) ... */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={uiInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50"
            >
              <div className="w-10 h-10 bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
                {/* Icon for Adaptative Design */}
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-cyan-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                 </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Design Adaptatif</h3>
              <p className="text-gray-400 text-sm">L'interface s'adapte à tous les écrans, du smartphone au workstation radiologique.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={uiInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50"
            >
              <div className="w-10 h-10 bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
                {/* Icon for Advanced Customization */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-cyan-400">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 1.658c-.007.379.138.752.43.992l1.003.827c.446.367.592.984.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.331.185-.581.496-.644.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 010-1.658c.007-.379-.137-.752-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.297-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.127.332-.185.582-.496.645-.87l.213-1.281z" />
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Personnalisation Avancée</h3>
              <p className="text-gray-400 text-sm">Configurez votre espace de travail, raccourcis et préférences d'affichage selon vos besoins.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={uiInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50"
            >
              <div className="w-10 h-10 bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
                 {/* Icon for Performance */}
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-cyan-400">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Performance Optimisée</h3>
              <p className="text-gray-400 text-sm">Chargement rapide et navigation fluide, même avec des études volumineuses, grâce à une architecture optimisée.</p>
            </motion.div>
        </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section ref={testiInViewRef} className="relative py-24 px-4 bg-gradient-to-b from-slate-900 via-black/30 to-slate-900">
         {/* ... (Contenu identique, potentiellement ajouter de vraies images de médecins si possible) ... */}
          <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-3 py-1 px-3 rounded-full bg-cyan-900/30 text-cyan-400 text-sm font-medium">
              TÉMOIGNAGES
            </div>

            <AnimatedText
              text="Ils Font Confiance à Orthanc Project" // Mise à jour nom
              className="text-4xl font-bold text-white mb-4"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Témoignage 1 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={testiInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative bg-slate-800 rounded-xl p-8 shadow-lg"
            >
               {/* ... (Citation et détails identiques) ... */}
               <div className="absolute top-0 left-0 transform -translate-x-4 -translate-y-4">
                <svg width="42" height="42" viewBox="0 0 42 42" className="text-cyan-500 opacity-30">
                  <path d="M13.14 10.68C12.16 11.5 11.38 12.5 10.84 13.66C10.3 14.82 10.02 16.1 10 17.42V22H18V14H15.04C15.3 13.3 15.72 12.68 16.3 12.14C16.88 11.62 17.56 11.24 18.3 11H20V3H12C11.98 5.16 11.5 7.28 10.58 9.24C9.66 11.2 8.32 12.96 6.62 14.48L10 17.42C11.02 15.5 12.3 13.76 13.14 10.68ZM31.14 10.68C30.16 11.5 29.38 12.5 28.84 13.66C28.3 14.82 28.02 16.1 28 17.42V22H36V14H33.04C33.3 13.3 33.72 12.68 34.3 12.14C34.88 11.62 35.56 11.24 36.3 11H38V3H30C29.98 5.16 29.5 7.28 28.58 9.24C27.66 11.2 26.32 12.96 24.62 14.48L28 17.42C29.02 15.5 30.3 13.76 31.14 10.68Z" fill="currentColor" />
                </svg>
              </div>

              <div className="relative z-10">
                <p className="text-gray-300 mb-6 font-light italic">
                  "Orthanc Project a transformé notre service. L'accès instantané aux images et la collaboration ont amélioré notre efficacité."
                </p>

                <div className="flex items-center">
                  <Image src="/images/image_8.jpg" alt="Dr. Sophie Laurent" width={48} height={48} className="w-12 h-12 rounded-full object-cover mr-4 bg-slate-700"/> {/* Image si disponible */}
                  <div>
                    <h4 className="text-white font-medium">Dr. Sophie Laurent</h4>
                    <p className="text-gray-400 text-sm">Chef de Service Radiologie</p>
                  </div>
                </div>
              </div>
            </motion.div>
             {/* Témoignage 2 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={testiInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative bg-slate-800 rounded-xl p-8 shadow-lg"
            >
              {/* ... (Citation et détails identiques) ... */}
              <div className="absolute top-0 left-0 transform -translate-x-4 -translate-y-4">
                 <svg width="42" height="42" viewBox="0 0 42 42" className="text-cyan-500 opacity-30">
                    <path d="M13.14 10.68C12.16 11.5 11.38 12.5 10.84 13.66C10.3 14.82 10.02 16.1 10 17.42V22H18V14H15.04C15.3 13.3 15.72 12.68 16.3 12.14C16.88 11.62 17.56 11.24 18.3 11H20V3H12C11.98 5.16 11.5 7.28 10.58 9.24C9.66 11.2 8.32 12.96 6.62 14.48L10 17.42C11.02 15.5 12.3 13.76 13.14 10.68ZM31.14 10.68C30.16 11.5 29.38 12.5 28.84 13.66C28.3 14.82 28.02 16.1 28 17.42V22H36V14H33.04C33.3 13.3 33.72 12.68 34.3 12.14C34.88 11.62 35.56 11.24 36.3 11H38V3H30C29.98 5.16 29.5 7.28 28.58 9.24C27.66 11.2 26.32 12.96 24.62 14.48L28 17.42C29.02 15.5 30.3 13.76 31.14 10.68Z" fill="currentColor" />
                 </svg>
              </div>
               <div className="relative z-10">
                 <p className="text-gray-300 mb-6 font-light italic">
                   "La facilité d'intégration avec notre SIH et la conformité aux normes de sécurité ont été des facteurs clés dans notre choix."
                 </p>
                 <div className="flex items-center">
                  <Image src="/images/image_10.jpg" alt="Marc Dupont" width={48} height={48} className="w-12 h-12 rounded-full object-cover mr-4 bg-slate-700"/> {/* Image si disponible */}
                   <div>
                     <h4 className="text-white font-medium">Marc Dupont</h4>
                     <p className="text-gray-400 text-sm">DSI, Clinique ABC</p>
                   </div>
                 </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section ref={ctaInViewRef} className="relative py-24 px-4 bg-slate-900">
         {/* ... (Contenu identique) ... */}
          <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-12 border border-cyan-700/30"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5" />
              <DataParticles />
            </div>

            <div className="relative z-10 text-center">
              <AnimatedText
                text="Prêt à Révolutionner Votre Imagerie ?"
                className="text-3xl md:text-4xl font-bold text-white mb-6"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={ctaInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-gray-300 mb-8 max-w-3xl mx-auto"
              >
                Découvrez comment Orthanc Project peut transformer la gestion de vos images médicales. Contactez-nous pour une démonstration personnalisée.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                 <motion.button
                   whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)' }}
                   whileTap={{ scale: 0.95 }}
                   className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
                 >
                   Demander une Démo
                 </motion.button>
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="px-8 py-4 bg-transparent border border-cyan-500/50 hover:border-cyan-500 text-white font-semibold rounded-lg transition-all duration-300"
                 >
                   Consulter la Doc
                 </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4">
         {/* ... (Contenu Footer identique) ... */}
         <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
                Orthanc Project
              </div>
              <p className="text-gray-400 mb-6 text-sm">
                Solution d'imagerie médicale innovante pour les professionnels de santé.
              </p>
              <div className="flex space-x-4">
                {/* Social Icons */}
                 <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.424.727-.666 1.584-.666 2.477 0 1.91.922 3.591 2.311 4.573-.926-.031-1.787-.286-2.545-.695v.043c0 2.668 1.853 4.897 4.318 5.417-.45.123-.928.188-1.423.188-.347 0-.686-.034-1.022-.095.718 2.185 2.796 3.778 5.27 3.814-1.84 1.441-4.164 2.304-6.694 2.304-.434 0-.863-.026-1.286-.075 2.38 1.521 5.21 2.416 8.27 2.416 9.926 0 15.36-8.207 15.36-15.36 0-.233 0-.465-.015-.695.996-.718 1.86-1.618 2.557-2.648z"/></svg></a>
                 <a href="https://github.com/noreyni03/orthanc-project" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.5.49.09.67-.21.67-.46 0-.23-.01-1.02-.01-1.9-2.782.605-3.369-1.34-3.369-1.34-.446-1.13-1.09-1.43-1.09-1.43-.89-.61.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.33 4.68-4.57 4.93.36.31.67.92.67 1.85 0 1.33-.01 2.41-.01 2.74 0 .25.18.55.68.46A10.019 10.019 0 0022 12.017C22 6.484 17.523 2 12 2z" clipRule="evenodd"/></svg></a>
                 <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.57-.5 5.05-1.36.28-.16.36-.53.18-.81l-1.29-1.93c-.18-.27-.53-.35-.81-.18C13.89 18.21 12.97 18.5 12 18.5c-3.58 0-6.5-2.92-6.5-6.5S8.42 5.5 12 5.5c1.61 0 3.09.59 4.23 1.57l-1.51 1.51c-.49.49-.06 1.42.69 1.42h4.09c.3 0 .55-.25.55-.55V5.41c0-.75-.92-1.18-1.41-.69L16.77 6.2c-1.38-1.23-3.21-2-5.18-2h-.01z" clipRule="evenodd"/></svg></a> {/* Exemple: LinkedIn ou autre */}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Produit</h3>
               <ul className="space-y-2">
                 <li><Link href="#features" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Fonctionnalités</Link></li>
                 <li><Link href="/demo" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Démo Interactive</Link></li>
                 <li><Link href="/security" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Sécurité</Link></li>
                 <li><Link href="/testimonials" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Témoignages</Link></li>
               </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Ressources</h3>
               <ul className="space-y-2">
                 <li><Link href="/docs" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Documentation</Link></li>
                 <li><a href="https://github.com/noreyni03/orthanc-project" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Code Source (GitHub)</a></li>
                 <li><Link href="/blog" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Blog</Link></li>
                 <li><Link href="/community" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Communauté</Link></li>
               </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
               <ul className="space-y-2">
                 <li><Link href="/support" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Support Technique</Link></li>
                 <li><Link href="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Nous Contacter</Link></li>
                 {/* <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Partenariats</a></li> */}
               </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Orthanc Project. Université Cheikh Anta Diop de Dakar.
            </p>

            <div className="flex space-x-6">
              {/* Liens légaux (à créer si nécessaire) */}
              {/* <a href="#" className="text-gray-500 hover:text-cyan-400 text-sm">Politique de confidentialité</a>
              <a href="#" className="text-gray-500 hover:text-cyan-400 text-sm">Conditions d'utilisation</a> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}