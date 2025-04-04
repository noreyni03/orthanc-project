'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';

// --- Composant DataParticles (Couleurs adaptées pour fonds clairs/sombres) ---
const DataParticles = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; speed: number; color: string; opacity: number }[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      // Ajuster les couleurs et l'opacité en fonction du thème de la section
      const colors = theme === 'light'
        ? ['#cbd5e1', '#94a3b8', '#e2e8f0', '#f1f5f9'] // Gris clairs/bleutés pour fond clair
        : ['#0891b2', '#0e7490', '#06b6d4', '#22d3ee', '#67e8f9']; // Cyan/Bleu pour fond sombre
      const baseOpacity = theme === 'light' ? 0.6 : 0.4;
      const randomOpacityFactor = theme === 'light' ? 0.4 : 0.6;
      const blur = theme === 'light' ? '0px' : '1px'; // Moins de flou sur fond clair

      const newParticles = Array.from({ length: 60 }, () => ({ // Moins de particules peut-être
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.8 + Math.random() * 2.5, // Légèrement plus gros peut-être
        speed: 0.4 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: baseOpacity + Math.random() * randomOpacityFactor
      }));
      setParticles(newParticles);
    };

    generateParticles();

    const interval = setInterval(() => {
      if (particlesRef.current && document.visibilityState === 'visible') {
        setParticles(prev => prev.map(particle => ({
          ...particle,
          y: (particle.y + particle.speed / 20) % 100,
          x: (particle.x + (Math.sin(particle.y / 15) * 0.1)) % 100
        })));
      }
    }, 60); // Légèrement plus lent

    return () => clearInterval(interval);
  }, [theme]); // Re-générer si le thème change

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
            opacity: particle.opacity,
            boxShadow: theme === 'dark' ? `0 0 ${4 + particle.size * 2}px ${particle.color}` : 'none', // Pas d'ombre sur fond clair
            filter: `blur(${theme === 'dark' ? '1px' : '0px'})` // Pas de flou sur fond clair
          }}
        />
      ))}
    </div>
  );
};


// --- Composant DicomViewerSimulation (INCHANGÉ - garde son thème sombre interne) ---
const DicomViewerSimulation = () => {
  // ... (code précédent identique) ...
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
    // Le viewer garde son style sombre pour contraster
    <div className="relative w-full max-w-md mx-auto h-96 bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
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
            {/* ... autres boutons ... */}
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


// --- Composant FeatureCard (Adapté pour fond clair) ---
const FeatureCard = ({ title, description, icon, delay = 0 }: { title: string; description: string; icon: string; delay?: number }) => {
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
      // Refonte Couleur: Fond blanc, bordure légère, ombre au survol
      className="group relative bg-white rounded-xl overflow-hidden p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200"
      whileHover={{ y: -5 }}
    >
      {/* Refonte Couleur: Garde la barre d'accent cyan/bleu */}
      <div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transform origin-left transition-transform duration-500 ease-out scale-x-0 group-hover:scale-x-100"
      />

      {/* Refonte Couleur: Fond icône clair, couleur icône plus sombre */}
      <div className="mb-4 text-cyan-600 flex items-center justify-center w-12 h-12 rounded-lg bg-cyan-100">
        <span className="text-2xl">{icon}</span>
      </div>

      {/* Refonte Couleur: Texte sombre */}
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>

      {/* Refonte Couleur: Texte lien cyan plus sombre */}
      <div className="mt-4 text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
        <span className="text-sm font-medium">En savoir plus</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </motion.div>
  );
};


// --- Composant AnimatedStats (Adapté pour thème clair ou sombre) ---
const AnimatedStats = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => {
  const stats = [
    { value: 99.9, label: "Disponibilité", symbol: "%" },
    { value: 0.25, label: "Temps de réponse", symbol: "s" },
    { value: 3, label: "Intégrations", symbol: "standards" },
    { value: 128, label: "Formats supportés", symbol: "bits" },
  ];

  const cardBg = theme === 'light' ? 'bg-white/70 backdrop-blur-sm border border-gray-200' : 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50';
  const gradientBg = theme === 'light' ? 'from-cyan-500/5 to-blue-600/5' : 'from-cyan-500/10 to-blue-600/5';
  const valueColor = theme === 'light' ? 'text-slate-800' : 'text-white';
  const symbolColor = theme === 'light' ? 'text-cyan-600' : 'text-cyan-400';
  const labelColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400';

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
            className={`relative ${cardBg} rounded-lg p-6 text-center shadow-sm`}
          >
            {/* <div className={`absolute inset-0 bg-gradient-to-br ${gradientBg} rounded-lg`} /> */}

            <div className="relative">
              <div className="flex items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  className={`text-4xl font-bold ${valueColor}`}
                >
                  {stat.value}
                </motion.span>
                <span className={`ml-1 ${symbolColor} text-xl`}>{stat.symbol}</span>
              </div>
              <div className={`mt-1 ${labelColor}`}>{stat.label}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// --- Composant AnimatedText (Adapté pour couleurs claires/sombres) ---
const AnimatedText = ({ text, className = "", colorClass = "text-slate-800" }: { text: string; className?: string, colorClass?: string }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const letters = Array.from(text);

  return (
    <motion.h2
      ref={ref}
      // Refonte Couleur: Utilise colorClass pour la couleur du texte
      className={`inline-block ${colorClass} ${className}`}
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
          {letter === " " ? <span style={{ display: 'inline-block', width: '0.25em' }}></span> : letter} {/* Espace insécable */}
        </motion.span>
      ))}
    </motion.h2>
  );
};

// --- Composant ScrollProgressBar (Couleurs vives conservées) ---
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      // Refonte Couleur: Garde les couleurs vives pour la visibilité
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 z-50"
      style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
    />
  );
};

// --- Composant HexagonalGrid (Adapté pour fond clair) ---
const HexagonalGrid = () => {
 const hexagons = Array.from({ length: 30 });
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}} // Opacité contrôlée ici
      transition={{ duration: 1.5 }}
      className="absolute -inset-20 overflow-hidden z-0 pointer-events-none"
    >
      <div className="grid grid-cols-5 gap-10 transform rotate-12 scale-125 opacity-30"> {/* Opacité globale */}
        {hexagons.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 0.1 + Math.random() * 0.3, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: Math.random() * 1 }}
            className="w-40 h-40 relative"
          >
            {/* Refonte Couleur: Bordure très légère, pas de fond */}
            <div
              className="absolute inset-0 border border-cyan-200/50"
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
  // Hooks (inchangés)
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacityHero = useTransform(scrollY, [0, 300, 500], [1, 0.5, 0]);
  const scaleHero = useTransform(scrollY, [0, 400], [1, 0.8]);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Hooks InView (inchangés)
  const [heroInViewRef, heroInView] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [presInViewRef, presInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [featInViewRef, featInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statsInViewRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [uiInViewRef, uiInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [testiInViewRef, testiInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaInViewRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  if (!mounted) return null;

  return (
    // Refonte Couleur: Fond principal blanc/gris clair
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-800">
      <ScrollProgressBar />

      {/* Hero Section - Garde un fond sombre pour l'impact initial */}
      <section
        ref={heroInViewRef}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white" // Garde un fond sombre
      >
        {/* Fond avec image (ajuster opacité si besoin) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/image_9.jpg"
            alt="Fond médical abstrait"
            fill
            className="object-cover opacity-15 scale-105 blur-sm" // Opacité ajustée
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/90 to-slate-900" />
        </div>

        {/* Particules thème sombre */}
        <DataParticles theme="dark" />

        {/* Contenu du Hero (texte reste blanc) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-4 inline-block py-2 px-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
          >
            <span className="text-sm font-medium text-cyan-300 tracking-wider">DEMAIN COMMENCE AUJOURD'HUI</span>
          </motion.div>

          {/* Titre (partie Orthanc en gradient, Project en blanc) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Orthanc</span>
            <span className="text-white"> Project</span>
          </motion.h1>

          {/* Paragraphe (texte clair) */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto font-light"
          >
            Une révolution dans l'imagerie médicale : diagnostics précis, collaboration sécurisée, et workflow optimisé.
          </motion.p>

          {/* Boutons (styles conservés, adaptés au fond sombre) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/api/auth/signin/google" passHref>
               <motion.button
                 whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)' }}
                 whileTap={{ scale: 0.95 }}
                 className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
               >
                 Commencer Maintenant
               </motion.button>
            </Link>
             <motion.button
               whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
               whileTap={{ scale: 0.95 }}
               // Refonte Couleur: Bordure plus visible sur fond sombre
               className="px-8 py-4 bg-transparent border border-slate-500 hover:border-slate-300 text-white font-semibold rounded-lg transition-all duration-300"
             >
               Voir la Démo
             </motion.button>
          </motion.div>
        </motion.div>

        {/* Indicateur de scroll (cyan sur fond sombre) */}
        <div className="absolute bottom-12 left-0 right-0 z-10 flex justify-center">
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
      {/* Refonte Couleur: Fond blanc */}
      <section ref={presInViewRef} className="relative py-24 px-4 overflow-hidden bg-white">
        {/* Grille Hexagonale adaptée pour fond clair */}
        <HexagonalGrid />
        <div className="relative max-w-7xl mx-auto z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"> {/* Augmentation du gap */}
            {/* Texte à gauche */}
            <div className="order-2 lg:order-1">
               <div className="mb-8">
                {/* Refonte Couleur: Titre sombre */}
                <AnimatedText
                  text="Une Nouvelle Ère de l'Imagerie Médicale"
                  className="text-4xl font-bold mb-4"
                  colorClass="text-slate-800" // Spécifier la couleur
                />
                {/* Ligne dégradée conservée */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "40%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mb-6"
                />
                {/* Refonte Couleur: Texte sombre, accent cyan/bleu plus vif */}
                <div className="space-y-4 text-gray-700">
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={presInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <span className="text-cyan-600 font-semibold">orthanc-project</span> redéfinit l'interaction avec les données DICOM grâce à une architecture web moderne, sécurisée et interopérable.
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
                  {/* Refonte Couleur: Lien cyan plus vif */}
                  <Link href="/dashboard" className="group inline-flex items-center">
                    <span className="text-cyan-600 font-medium mr-2 group-hover:mr-4 transition-all">Découvrir la plateforme</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </div>
            {/* DicomViewerSimulation à droite (garde son style sombre) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} // Animation ajustée
              animate={presInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="order-1 lg:order-2 relative"
            >
              {/* Refonte Couleur: Lueur subtile sur fond blanc */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-300/10 to-blue-300/10 rounded-2xl blur-xl opacity-50 z-0"></div>
              <div className="relative transform-style-3d perspective-1200 z-10">
                 <DicomViewerSimulation />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

       {/* Section Fonctionnalités */}
       {/* Refonte Couleur: Fond gris très clair pour alterner */}
      <section ref={featInViewRef} className="relative py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* --- Bloc Titre --- */}
          {/* Confirmation Centrage: text-center ici centre bien tout ce bloc */}
          <div className="text-center mb-16">
            {/* Refonte Couleur: Badge adapté fond clair */}
            <div className="inline-block mb-3 py-1 px-3 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium">
              CAPACITÉS
            </div>
            {/* Refonte Couleur: Titre sombre */}
            <AnimatedText
              text="Un Écosystème Complet d'Imagerie"
              className="text-4xl font-bold text-slate-800 mb-4"
              colorClass="text-slate-800"
            />
            {/* Refonte Couleur: Paragraphe sombre */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={featInView ? { opacity: 1} : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-2xl mx-auto text-gray-600"
            >
              Découvrez les fonctionnalités avancées qui font d'orthanc-project la solution idéale pour les établissements de santé modernes.
            </motion.p>
          </div>
          {/* --- Fin Bloc Titre --- */}

          {/* Grille FeatureCard (utilise le composant FeatureCard adapté) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <FeatureCard
              title="Visualisation Haute Fidélité"
              description="Affichage interactif des images DICOM avec outils avancés d'annotation et de mesure directement dans votre navigateur."
              icon="👁️"
              delay={0.1}
            />
            <FeatureCard
              title="Sécurité Conforme"
              description="Authentification multi-facteurs, contrôle d'accès basé sur les rôles et audit complet pour la conformité RGPD."
              icon="🛡️"
              delay={0.2}
            />
            <FeatureCard
              title="Workflow Optimisé"
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
              title="Technologie Moderne"
              description="Stack Next.js, React, TypeScript et Prisma garantissant performance, maintenabilité et évolutivité."
              icon="⚙️"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      {/* Refonte Couleur: Fond contrastant (gris moyen ou dégradé léger) pour rythmer */}
      <section ref={statsInViewRef} className="relative py-20 px-4 bg-gradient-to-b from-gray-100 to-gray-200">
         <div className="max-w-6xl mx-auto">
          <div className="relative z-10 py-10">
            {/* Utilise AnimatedStats adapté pour thème clair */}
            <AnimatedStats theme="light" />
          </div>
        </div>
      </section>

      {/* Section Interface */}
      {/* Refonte Couleur: Retour à un fond blanc */}
      <section ref={uiInViewRef} className="relative py-24 px-4 overflow-hidden bg-white">
         <div className="max-w-7xl mx-auto">
          {/* --- Bloc Titre --- */}
          {/* Confirmation Centrage: text-center ici centre bien tout ce bloc */}
          <div className="text-center mb-16">
            {/* Refonte Couleur: Badge adapté fond clair */}
            <div className="inline-block mb-3 py-1 px-3 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium">
              EXPÉRIENCE UTILISATEUR
            </div>
            {/* Refonte Couleur: Titre sombre */}
            <AnimatedText
              text="Interface Conçue pour les Professionnels"
              className="text-4xl font-bold text-slate-800 mb-4"
              colorClass="text-slate-800"
            />
            {/* Refonte Couleur: Paragraphe sombre */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={uiInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-2xl mx-auto text-gray-600"
            >
              Une expérience utilisateur intuitive et performante, développée en collaboration avec des radiologues et cliniciens.
            </motion.p>
          </div>
          {/* --- Fin Bloc Titre --- */}

          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={uiInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative"
            >
            {/* Refonte Couleur: Lueur très subtile */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-300/10 to-blue-300/10 rounded-2xl blur-xl opacity-40"></div>
            {/* Refonte Couleur: Conteneur image avec bordure légère */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200 p-2">
            <Image
              src="/images/image_7.jpg"
              alt="Exemple Interface Orthanc Project"
              width={1200}
              height={800}
              className="rounded-xl w-full h-auto object-cover" // Retiré shadow-inner, remplacé par shadow-xl sur le parent
            />
          </div>
        </motion.div>
        {/* Grid des 3 points forts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {/* Point Fort 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={uiInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              // Refonte Couleur: Fond blanc/très clair, bordure, texte sombre
              className="bg-gray-50/50 rounded-lg p-6 border border-gray-200"
            >
              {/* Refonte Couleur: Icône adaptée */}
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-cyan-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                 </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Design Adaptatif</h3>
              <p className="text-gray-600 text-sm">L'interface s'adapte à tous les écrans, du smartphone au workstation radiologique.</p>
            </motion.div>

             {/* Point Fort 2 */}
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={uiInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-50/50 rounded-lg p-6 border border-gray-200"
            >
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-cyan-600">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 1.658c-.007.379.138.752.43.992l1.003.827c.446.367.592.984.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.331.185-.581.496-.644.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 010-1.658c.007-.379-.137-.752-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.297-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.127.332-.185.582-.496.645-.87l.213-1.281z" />
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Personnalisation Avancée</h3>
              <p className="text-gray-600 text-sm">Configurez votre espace de travail, raccourcis et préférences d'affichage selon vos besoins.</p>
            </motion.div>

            {/* Point Fort 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={uiInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gray-50/50 rounded-lg p-6 border border-gray-200"
            >
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-cyan-600">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Performance Optimisée</h3>
              <p className="text-gray-600 text-sm">Chargement rapide et navigation fluide, même avec des études volumineuses, grâce à une architecture optimisée.</p>
            </motion.div>
        </div>
        </div>
      </section>

      {/* Section Témoignages */}
      {/* Refonte Couleur: Fond gris clair (alterne avec section précédente) */}
      <section ref={testiInViewRef} className="relative py-24 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
          {/* --- Bloc Titre --- */}
          {/* Confirmation Centrage: text-center ici centre bien tout ce bloc */}
          <div className="text-center mb-16">
             {/* Refonte Couleur: Badge adapté */}
            <div className="inline-block mb-3 py-1 px-3 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium">
              TÉMOIGNAGES
            </div>
            {/* Refonte Couleur: Titre sombre */}
            <AnimatedText
              text="Ils Font Confiance à Orthanc Project"
              className="text-4xl font-bold text-slate-800 mb-4"
              colorClass="text-slate-800"
            />
          </div>
          {/* --- Fin Bloc Titre --- */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Témoignage 1 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={testiInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              // Refonte Couleur: Carte blanche, bordure, ombre légère
              className="relative bg-white rounded-xl p-8 shadow-md border border-gray-200"
            >
               {/* Refonte Couleur: Citation SVG plus claire */}
               <div className="absolute top-0 left-0 transform -translate-x-3 -translate-y-3">
                <svg width="42" height="42" viewBox="0 0 42 42" className="text-cyan-200 opacity-80">
                  <path d="M13.14 10.68C12.16 11.5 11.38 12.5 10.84 13.66C10.3 14.82 10.02 16.1 10 17.42V22H18V14H15.04C15.3 13.3 15.72 12.68 16.3 12.14C16.88 11.62 17.56 11.24 18.3 11H20V3H12C11.98 5.16 11.5 7.28 10.58 9.24C9.66 11.2 8.32 12.96 6.62 14.48L10 17.42C11.02 15.5 12.3 13.76 13.14 10.68ZM31.14 10.68C30.16 11.5 29.38 12.5 28.84 13.66C28.3 14.82 28.02 16.1 28 17.42V22H36V14H33.04C33.3 13.3 33.72 12.68 34.3 12.14C34.88 11.62 35.56 11.24 36.3 11H38V3H30C29.98 5.16 29.5 7.28 28.58 9.24C27.66 11.2 26.32 12.96 24.62 14.48L28 17.42C29.02 15.5 30.3 13.76 31.14 10.68Z" fill="currentColor" />
                </svg>
              </div>

              <div className="relative z-10">
                 {/* Refonte Couleur: Texte sombre */}
                <p className="text-gray-700 mb-6 font-light italic">
                  "Orthanc Project a transformé notre service. L'accès instantané aux images et la collaboration ont amélioré notre efficacité."
                </p>
                 {/* Refonte Couleur: Texte sombre, sous-titre plus clair */}
                <div className="flex items-center">
                  <Image src="/images/image_8.jpg" alt="Dr. Sophie Laurent" width={48} height={48} className="w-12 h-12 rounded-full object-cover mr-4 bg-gray-200"/>
                  <div>
                    <h4 className="text-slate-800 font-medium">Dr. Sophie Laurent</h4>
                    <p className="text-gray-500 text-sm">Chef de Service Radiologie</p>
                  </div>
                </div>
              </div>
            </motion.div>
             {/* Témoignage 2 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={testiInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative bg-white rounded-xl p-8 shadow-md border border-gray-200"
            >
              <div className="absolute top-0 left-0 transform -translate-x-3 -translate-y-3">
                 <svg width="42" height="42" viewBox="0 0 42 42" className="text-cyan-200 opacity-80">
                    <path d="M13.14 10.68C12.16 11.5 11.38 12.5 10.84 13.66C10.3 14.82 10.02 16.1 10 17.42V22H18V14H15.04C15.3 13.3 15.72 12.68 16.3 12.14C16.88 11.62 17.56 11.24 18.3 11H20V3H12C11.98 5.16 11.5 7.28 10.58 9.24C9.66 11.2 8.32 12.96 6.62 14.48L10 17.42C11.02 15.5 12.3 13.76 13.14 10.68ZM31.14 10.68C30.16 11.5 29.38 12.5 28.84 13.66C28.3 14.82 28.02 16.1 28 17.42V22H36V14H33.04C33.3 13.3 33.72 12.68 34.3 12.14C34.88 11.62 35.56 11.24 36.3 11H38V3H30C29.98 5.16 29.5 7.28 28.58 9.24C27.66 11.2 26.32 12.96 24.62 14.48L28 17.42C29.02 15.5 30.3 13.76 31.14 10.68Z" fill="currentColor" />
                 </svg>
              </div>
               <div className="relative z-10">
                 <p className="text-gray-700 mb-6 font-light italic">
                   "La facilité d'intégration avec notre SIH et la conformité aux normes de sécurité ont été des facteurs clés dans notre choix."
                 </p>
                 <div className="flex items-center">
                  <Image src="/images/image_10.jpg" alt="Marc Dupont" width={48} height={48} className="w-12 h-12 rounded-full object-cover mr-4 bg-gray-200"/>
                   <div>
                     <h4 className="text-slate-800 font-medium">Marc Dupont</h4>
                     <p className="text-gray-500 text-sm">DSI, Clinique ABC</p>
                   </div>
                 </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      {/* Refonte Couleur: Fond blanc pour revenir à la base avant le footer */}
      <section ref={ctaInViewRef} className="relative py-24 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} // Animation subtile
            animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            // Refonte Couleur: Fond dégradé subtil, bordure
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 p-12 border border-gray-200 shadow-lg"
          >
             {/* Particules adaptées pour fond clair */}
             <DataParticles theme="light" />

            <div className="relative z-10 text-center">
              {/* Refonte Couleur: Titre sombre */}
              <AnimatedText
                text="Prêt à Révolutionner Votre Imagerie ?"
                className="text-3xl md:text-4xl font-bold text-slate-800 mb-6"
                colorClass="text-slate-800"
              />
              {/* Refonte Couleur: Paragraphe sombre */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={ctaInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-gray-600 mb-8 max-w-3xl mx-auto"
              >
                Découvrez comment Orthanc Project peut transformer la gestion de vos images médicales. Contactez-nous pour une démonstration personnalisée.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                 {/* Bouton Principal (gradient conservé) */}
                 <motion.button
                   whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                   whileTap={{ scale: 0.95 }}
                   className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                 >
                   Demander une Démo
                 </motion.button>
                 {/* Bouton Secondaire (bordure cyan/bleu, texte assorti) */}
                 <motion.button
                   whileHover={{ scale: 1.05, backgroundColor: 'rgba(6, 182, 212, 0.05)' }} // Léger fond au survol
                   whileTap={{ scale: 0.95 }}
                   className="px-8 py-4 bg-transparent border border-cyan-500 text-cyan-600 hover:border-cyan-600 font-semibold rounded-lg transition-all duration-300"
                 >
                   Consulter la Doc
                 </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      {/* Refonte Couleur: Fond sombre conservé pour un ancrage final */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12 px-4 text-slate-300">
         <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
               {/* Titre (gradient conservé) */}
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                Orthanc Project
              </div>
              <p className="text-slate-400 mb-6 text-sm">
                Solution d'imagerie médicale innovante pour les professionnels de santé.
              </p>
              {/* Icônes sociales (couleurs claires) */}
              <div className="flex space-x-4">
                 <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">...</svg></a>
                 <a href="https://github.com/noreyni03/orthanc-project" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">...</svg></a>
                 {/* ... autres icônes ... */}
              </div>
            </div>
            {/* Colonnes Liens (texte clair) */}
            <div>
              <h3 className="text-white font-semibold mb-4">Produit</h3>
               <ul className="space-y-2">
                 <li><Link href="#features" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Fonctionnalités</Link></li>
                 {/* ... autres liens ... */}
               </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Ressources</h3>
               <ul className="space-y-2">
                 <li><Link href="/docs" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Documentation</Link></li>
                 {/* ... autres liens ... */}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
               <ul className="space-y-2">
                 <li><Link href="/support" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">Support Technique</Link></li>
                 {/* ... autres liens ... */}
              </ul>
            </div>
          </div>

          {/* Copyright et liens légaux (texte plus clair) */}
          <div className="mt-12 pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Orthanc Project. Université Cheikh Anta Diop de Dakar.
            </p>
            {/* <div className="flex space-x-6">
               <a href="#" className="text-slate-500 hover:text-cyan-400 text-sm">Politique de confidentialité</a>
               <a href="#" className="text-slate-500 hover:text-cyan-400 text-sm">Conditions d'utilisation</a>
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
}