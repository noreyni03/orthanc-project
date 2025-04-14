// --- START OF FILE page.tsx ---
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView as useInViewMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { Disclosure } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  AcademicCapIcon,
  CheckBadgeIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  BookOpenIcon,
  CodeBracketIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ArrowPathIcon,
  PuzzlePieceIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  ServerIcon,
  CubeIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  CalendarIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  // PlusIcon,
  // MinusIcon,
} from '@heroicons/react/24/outline';
import { FaTwitter, FaGithub, FaLinkedin, FaYoutube, FaDiscord, FaSlack, FaMedium, FaReddit, FaStackOverflow } from 'react-icons/fa';
import {
  FiCpu, FiUsers, FiDatabase, FiBarChart2, FiLock, FiEye, FiShare2, FiEdit,
  FiTrendingUp, FiFolderPlus, FiLifeBuoy, FiMessageSquare, FiGrid, FiLayers,
  FiSettings, FiDownload, FiUpload, FiFilter, FiSearch, FiBook, FiAward,
  FiHelpCircle, FiExternalLink, FiStar, FiHeart, FiBookmark, FiClock,
  FiRepeat, FiRefreshCw, FiZap, FiTarget, FiAnchor, FiFeather, FiPackage,
  FiTruck, FiShield, FiMonitor, FiSmartphone, FiTablet, FiWatch,
  FiPrinter, FiCamera, FiHeadphones, FiSpeaker, FiMic, FiMusic,
} from 'react-icons/fi';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Tab } from '@headlessui/react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { 
  ArrowUpIcon,
  StarIcon,
  ArrowRightIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/solid';

// --- Constants ---
const MEDICAL_SPECIALTIES = [
  'Radiologie', 'Cardiologie', 'Neurologie', 'Oncologie', 'Pédiatrie',
  'Orthopédie', 'Ophtalmologie', 'Dermatologie', 'Pneumologie', 'Gynécologie',
  'Urologie', 'Endocrinologie', 'Gastroentérologie', 'Néphrologie', 'Hématologie',
  'Rhumatologie', 'Oto-rhino-laryngologie', 'Psychiatrie', 'Anesthésiologie', 'Médecine interne'
];

const IMAGING_MODALITIES = [
  'IRM', 'CT', 'Rayons X', 'Ultrasons', 'OCT',
  'PET', 'SPECT', 'Mammographie', 'Fluoroscopie', 'Angiographie'
];

// --- Utility Functions ---
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

const getRandomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toLocaleDateString('fr-FR');
};

// --- Navbar Component (Enhanced) ---
const Navbar = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout>();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

  const navLinks = [
    { 
      name: 'Datasets', 
      href: '/datasets', 
      description: 'Explorez nos collections de données médicales.',
      dropdown: [
        { name: 'Rechercher', href: '/datasets/search', icon: FiSearch },
        { name: 'Parcourir par spécialité', href: '/datasets/specialties', icon: AcademicCapIcon },
        { name: 'Derniers ajouts', href: '/datasets/recent', icon: ClockIcon },
        { name: 'Plus populaires', href: '/datasets/popular', icon: FiTrendingUp },
      ]
    },
    { 
      name: 'Projets', 
      href: '/projects', 
      description: 'Collaborez sur des projets de recherche.',
      dropdown: [
        { name: 'Vos projets', href: '/projects/yours', icon: FiFolderPlus },
        { name: 'Projets publics', href: '/projects/public', icon: FiUsers },
        { name: 'Créer un projet', href: '/projects/new', icon: PlusIcon },
      ]
    },
    { 
      name: 'Modèles', 
      href: '/models', 
      description: 'Découvrez des modèles IA pré-entraînés.',
      dropdown: [
        { name: 'Modèles validés', href: '/models/validated', icon: CheckBadgeIcon },
        { name: 'Modèles communautaires', href: '/models/community', icon: UserGroupIcon },
        { name: 'Benchmarks', href: '/models/benchmarks', icon: ChartBarIcon },
      ]
    },
    { 
      name: 'Discussions', 
      href: '/discussions', 
      description: 'Échangez avec la communauté.',
      dropdown: [
        { name: 'Forum général', href: '/discussions/forum', icon: ChatBubbleLeftRightIcon },
        { name: 'Q&A', href: '/discussions/questions', icon: QuestionMarkCircleIcon },
        { name: 'Annonces', href: '/discussions/announcements', icon: InformationCircleIcon },
      ]
    },
    { 
      name: 'Docs', 
      href: '/docs', 
      description: 'Consultez notre documentation technique.',
      dropdown: [
        { name: 'API Reference', href: '/docs/api', icon: CodeBracketIcon },
        { name: 'Guides', href: '/docs/guides', icon: BookOpenIcon },
        { name: 'Tutoriels', href: '/docs/tutorials', icon: VideoCameraIcon },
      ]
    },
  ];

  const handleDropdownEnter = (linkName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(linkName);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const AuthLoadingSkeleton = () => (
    <div className="flex items-center space-x-2 animate-pulse">
      <div className="h-5 w-16 bg-gray-200 rounded"></div>
      <div className="h-8 w-24 bg-gray-300 rounded-md"></div>
    </div>
  );

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ease-in-out ${isScrolled ? 'bg-white/95 shadow-lg border-b border-gray-200 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-md'}`}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Left Side */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 mr-8 group">
              <svg className="h-8 w-8 text-cyan-600 group-hover:text-blue-700 transition-colors duration-200" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-5 4 5h-3v4H11z"/>
              </svg>
              <span className="text-2xl md:text-3xl font-bold text-cyan-600 group-hover:text-blue-700 transition-colors duration-200">
                Orthanc
              </span>
            </Link>
            
            {/* Desktop Navigation Links with Dropdowns */}
            <div className="hidden lg:flex lg:space-x-1">
              {navLinks.map((link) => (
                <div 
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(link.name)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={link.href}
                    className="relative text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors group flex items-center"
                    title={link.description}
                  >
                    {link.name}
                    {link.dropdown && (
                      <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-transform" />
                    )}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                  </Link>

                  {/* Dropdown Menu */}
                  {link.dropdown && activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-56 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-50"
                      onMouseEnter={() => handleDropdownEnter(link.name)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center">
            {/* Search Button (Desktop) */}
            <button className="hidden lg:flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 mr-2">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {/* Desktop Authentication UI */}
            <div className="hidden lg:flex items-center space-x-5">
              {status === 'loading' && <AuthLoadingSkeleton />}

              {status === 'unauthenticated' && (
                <>
                  <button
                    onClick={() => signIn()}
                    className="text-gray-600 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-gray-100"
                  >
                    Connexion
                  </button>
                  <Link
                    href="/register"
                    className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                  >
                    Inscription Gratuite
                  </Link>
                </>
              )}

              {status === 'authenticated' && user && (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Menu utilisateur"
                    aria-haspopup="true"
                    aria-expanded={isUserMenuOpen}
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt="Avatar utilisateur"
                        width={36}
                        height={36}
                        className="rounded-full ring-2 ring-offset-1 ring-cyan-400 shadow-sm"
                      />
                    ) : (
                      <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-cyan-200 to-blue-300 ring-2 ring-white text-sm font-medium text-blue-800">
                        {user.name?.split(' ').map(n => n[0]).join('') || user.email?.[0].toUpperCase()}
                      </span>
                    )}
                    <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </motion.button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }}
                        transition={{ type: "spring", stiffness: 300, damping: 25, duration: 0.25 }}
                        className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-50"
                        role="menu"
                      >
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm text-gray-500">Connecté en tant que</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name || user.email}</p>
                        </div>
                        <Link 
                          href="/profile" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left transition-colors duration-150"
                          role="menuitem"
                        >
                          <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600"/>
                          Votre Profil
                        </Link>
                        <Link 
                          href="/dashboard" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left transition-colors duration-150"
                          role="menuitem"
                        >
                          <FiBarChart2 className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600"/>
                          Tableau de bord
                        </Link>
                        <Link 
                          href="/settings" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left transition-colors duration-150"
                          role="menuitem"
                        >
                          <FiSettings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600"/>
                          Paramètres
                        </Link>
                        <Link 
                          href="/help" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left transition-colors duration-150"
                          role="menuitem"
                        >
                          <FiLifeBuoy className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600"/>
                          Aide & Support
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={() => { signOut(); setIsUserMenuOpen(false); }}
                          className="group flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors duration-150"
                          role="menuitem"
                        >
                          <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-700"/>
                          Déconnexion
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden ml-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                aria-label="Ouvrir menu principal"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-7 w-7" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-7 w-7" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden border-t border-gray-200 bg-white shadow-lg absolute w-full"
          >
            {/* Search Bar (Mobile) */}
            <div className="px-4 pt-3 pb-2">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Rechercher..."
                />
              </div>
            </div>

            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <div key={`mobile-${link.name}`}>
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:bg-blue-50 hover:text-blue-700 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <div className="pl-4 mt-1 space-y-1">
                      {link.dropdown.map((item) => (
                        <Link
                          key={`mobile-${item.name}`}
                          href={item.href}
                          className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Authentication Section */}
            <div className="pt-4 pb-4 border-t border-gray-200">
              {status === 'loading' && (
                <div className="flex justify-center px-5">
                  <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              )}

              {status === 'unauthenticated' && (
                <div className="flex flex-col items-center space-y-3 px-5">
                  <button
                    onClick={() => { signIn(); setIsMobileMenuOpen(false); }}
                    className="w-full text-center text-gray-700 hover:bg-gray-100 hover:text-blue-700 block px-3 py-3 rounded-md text-base font-medium transition-colors border border-gray-300"
                  >
                    Connexion
                  </button>
                  <Link
                    href="/register"
                    className="w-full text-center inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Inscription Gratuite
                  </Link>
                </div>
              )}

              {status === 'authenticated' && user && (
                <div className="px-5">
                  {/* User Info Display */}
                  <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
                    {user.image ? (
                      <Image src={user.image} alt="Avatar" width={48} height={48} className="rounded-full mr-4 ring-2 ring-cyan-300" />
                    ) : (
                      <UserCircleIcon className="h-12 w-12 text-gray-400 mr-4" />
                    )}
                    <div className="overflow-hidden">
                      <div className="text-base font-medium text-gray-800 truncate">{user.name || 'Utilisateur'}</div>
                      <div className="text-sm font-medium text-gray-500 truncate">{user.email}</div>
                    </div>
                  </div>
                  {/* Mobile User Actions */}
                  <div className="space-y-1">
                    <Link 
                      href="/profile" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="group flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <UserCircleIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-blue-600"/> 
                      Votre Profil
                    </Link>
                    <Link 
                      href="/dashboard" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="group flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <FiBarChart2 className="mr-3 h-6 w-6 text-gray-400 group-hover:text-blue-600"/>
                      Tableau de bord
                    </Link>
                    <Link 
                      href="/settings" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="group flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <FiSettings className="mr-3 h-6 w-6 text-gray-400 group-hover:text-blue-600"/>
                      Paramètres
                    </Link>
                    <Link 
                      href="/help" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="group flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <FiLifeBuoy className="mr-3 h-6 w-6 text-gray-400 group-hover:text-blue-600"/>
                      Aide & Support
                    </Link>
                    <button
                      onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                      className="group flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3 text-red-500 group-hover:text-red-700"/>
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Animated Section Wrapper ---
const MotionSection = ({ children, className, delay = 0, id }: { children: React.ReactNode, className?: string, delay?: number, id?: string }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 60 }}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// --- Hero Section (Enhanced) ---
const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-gray-50 pt-24 md:pt-32 lg:pt-40 pb-20 md:pb-24 overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 opacity-10">
        <div className="w-96 h-96 rounded-full bg-cyan-300 blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 opacity-10">
        <div className="w-80 h-80 rounded-full bg-blue-300 blur-3xl"></div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
          {/* Text Content Column */}
          <div className="lg:col-span-7 xl:col-span-6 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
            >
              <span className="block">La plateforme N°1</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mt-1 md:mt-2">
                pour l'IA Médicale.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="mt-6 text-lg text-gray-600 sm:text-xl max-w-xl mx-auto lg:mx-0"
            >
              Accédez à des datasets uniques, collaborez avec des experts et déployez des modèles d'IA pour révolutionner le diagnostic et la recherche médicale.
            </motion.p>
            
            {/* Call to Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="mt-10 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Commencer Maintenant
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-semibold rounded-lg text-blue-700 bg-white hover:bg-gray-50 hover:border-gray-400 md:text-lg md:px-10 shadow-sm hover:shadow-md transition-all duration-300"
              >
                Explorer la Plateforme
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
              className="mt-12 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full ring-2 ring-white bg-gray-200 overflow-hidden">
                    <Image 
                      src={`/images/image_${i}.jpg`} 
                      alt={`User ${i}`}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold">4.9/5</span> basé sur 1,200+ avis
                </p>
              </div>
            </motion.div>
          </div>

          {/* Illustration Column */}
          <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 100, damping: 15 }}
        className="mt-16 lg:mt-0 lg:col-span-5 xl:col-span-6 flex justify-center items-center p-4"
      >
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px] rounded-full overflow-hidden shadow-xl">
          <Image
            src="/images/image_1.jpg"
            alt="Illustration de collaboration et IA médicale dans un cercle"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 480px"
          />
        </div>
      </motion.div>
        </div>
      </div>
    </div>
  );
};

// --- Stats Section (Enhanced) ---
const StatsSection = () => {
  const stats = [
    { name: 'Datasets Médicaux', value: '15,000+', icon: FiDatabase, description: "Images annotées et rapports.", change: "+12% ce mois" },
    { name: 'Collaborateurs Actifs', value: '75,000+', icon: FiUsers, description: "Médecins, chercheurs, ingénieurs.", change: "+23% cette année" },
    { name: 'Projets de Recherche', value: '10,000+', icon: FiEdit, description: "Études publiées et en cours.", change: "+45% cette année" },
    { name: 'Modèles Pré-entraînés', value: '500+', icon: FiCpu, description: "Pour diverses spécialités.", change: "+18% ce trimestre" },
    { name: 'Analyses/Mois', value: '3M+', icon: FiBarChart2, description: "Calculs et visualisations.", change: "+62% cette année" },
    { name: 'Partenaires Cliniques', value: '80+', icon: FiTrendingUp, description: "Hôpitaux et centres de recherche.", change: "+15% ce semestre" },
  ];

  return (
    <MotionSection className="bg-white py-20 sm:py-24" delay={0.1}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-6 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.1, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 mb-4 shadow-inner">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-3xl md:text-4xl font-extrabold text-gray-900">{stat.value}</p>
              <p className="mt-1 text-sm font-semibold text-gray-700">{stat.name}</p>
              <p className="mt-1 text-xs text-gray-500 px-2">{stat.description}</p>
              <p className="mt-2 text-xs font-medium text-green-600 flex items-center">
                <ArrowUpIcon className="h-3 w-3 mr-1" />
                {stat.change}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </MotionSection>
  );
};

// --- Features Section (Enhanced with Tabs) ---
const FeaturesSection = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const featureGroups = [
    {
      name: 'Gestion des Données',
      icon: FiDatabase,
      features: [
        { name: 'Visualisation DICOM Interactive', description: 'Outils avancés (MPR, 3D, mesures) et annotations collaboratives en temps réel.', icon: FiEye },
        { name: 'Gestion Sécurisée des Cohortes', description: 'Importez, anonymisez (conforme RGPD/HIPAA) et gérez des datasets complexes.', icon: ShieldCheckIcon },
        { name: 'API Complète', description: 'Connectez Orthanc à vos systèmes existants (PACS, EMR) via notre API complète.', icon: CodeBracketIcon },
      ]
    },
    {
      name: 'Analyse & IA',
      icon: FiCpu,
      features: [
        { name: 'Environnement de Notebooks Intégré', description: 'Codez en Python/R avec accès direct aux données et GPU. Partagez et versionnez.', icon: BookOpenIcon },
        { name: 'Catalogue de Modèles IA', description: 'Explorez, testez et déployez des modèles validés pour l\'aide au diagnostic ou la segmentation.', icon: AcademicCapIcon },
        { name: 'Benchmarking Automatisé', description: 'Comparez les performances de vos modèles avec des benchmarks standardisés.', icon: ChartBarIcon },
      ]
    },
    {
      name: 'Collaboration',
      icon: FiUsers,
      features: [
        { name: 'Partage Contrôlé & Audit', description: 'Permissions fines par utilisateur/groupe. Logs d\'accès détaillés pour la traçabilité.', icon: FiLock },
        { name: 'Tableaux de Bord Analytiques', description: 'Suivez l\'utilisation des données, les performances des modèles et l\'activité collaborative.', icon: FiBarChart2 },
        { name: 'Support Expert & Communauté', description: 'Accès à notre équipe de support et à une communauté active pour l\'entraide.', icon: FiMessageSquare },
      ]
    },
  ];

  return (
    <MotionSection className="bg-gradient-to-b from-gray-50 to-white py-20 sm:py-24" delay={0.2} id="features">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Capacités Clés</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Une suite d'outils pensée pour l'innovation médicale
          </p>
          <p className="mt-5 max-w-3xl text-xl text-gray-500 mx-auto">
            De la donnée brute à la découverte scientifique, Orthanc vous accompagne à chaque étape.
          </p>
        </div>

        {/* Tabbed Interface */}
        <div className="max-w-3xl mx-auto">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              {featureGroups.map((group) => (
                <Tab
                  key={group.name}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                     ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                     ${selected ? 'bg-white shadow' : 'text-blue-600 hover:bg-white/[0.12] hover:text-white'}`
                  }
                >
                  <div className="flex items-center justify-center">
                    <group.icon className="h-5 w-5 mr-2" />
                    {group.name}
                  </div>
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-6">
              {featureGroups.map((group, idx) => (
                <Tab.Panel
                  key={idx}
                  className={`rounded-xl bg-white p-6 shadow-lg border border-gray-200 ${
                    selectedTab === idx ? 'block' : 'hidden'
                  }`}
                >
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {group.features.map((feature, index) => (
                      <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex flex-col p-4 bg-gray-50 rounded-lg hover:bg-white hover:shadow-md transition-all"
                      >
                        <div className="flex-shrink-0 mb-4">
                          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600">
                            <feature.icon className="h-6 w-6" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                          <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
          >
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                <FiDatabase className="h-6 w-6" />
              </div>
              <h3 className="ml-4 text-xl font-bold text-gray-900">Stockage Sécurisé</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Toutes vos données médicales stockées de manière sécurisée et conforme aux réglementations (RGPD, HIPAA).
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">Chiffrement AES-256</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">Anonymisation automatique</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">Sauvegardes quotidiennes</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
          >
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                <FiCpu className="h-6 w-6" />
              </div>
              <h3 className="ml-4 text-xl font-bold text-gray-900">Puissance de Calcul</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Accélérez vos analyses avec notre infrastructure GPU haute performance dédiée au traitement d'images médicales.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">NVIDIA A100 Tensor Core GPUs</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">Jupyter Notebooks pré-configurés</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">Environnements reproductibles</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
          >
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                <FiUsers className="h-6 w-6" />
              </div>
              <h3 className="ml-4 text-xl font-bold text-gray-900">Collaboration</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Travaillez en équipe avec des outils conçus pour la recherche collaborative en imagerie médicale.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">Annotations partagées</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">Gestion des accès granulaires</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span className="text-gray-700">Versioning des données</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </MotionSection>
  );
};

// --- How It Works Section (Enhanced) ---
const HowItWorksSection = () => {
  const steps = [
    { 
      id: 1, 
      name: 'Importer & Organiser', 
      description: 'Téléversez vos images DICOM ou connectez votre PACS. Anonymisez et structurez vos datasets.', 
      icon: FiFolderPlus,
      details: [
        'Supporte DICOM, NIfTI, NRRD et formats standards',
        'Anonymisation automatique ou manuelle',
        'Organisation par patient, étude ou projet'
      ]
    },
    { 
      id: 2, 
      name: 'Explorer & Annoter', 
      description: 'Utilisez nos viewers avancés pour analyser les images et collaborer sur les annotations.', 
      icon: FiEye,
      details: [
        'Visualisation 2D/3D/MPR',
        'Outils de mesure intégrés',
        'Annotations collaboratives en temps réel'
      ]
    },
    { 
      id: 3, 
      name: 'Analyser & Entraîner', 
      description: 'Lancez des notebooks, utilisez des modèles pré-entraînés ou développez les vôtres sur GPU.', 
      icon: CpuChipIcon,
      details: [
        'Environnements Jupyter pré-configurés',
        'Librairies médicales pré-installées',
        'Accès à des modèles de référence'
      ]
    },
    { 
      id: 4, 
      name: 'Partager & Publier', 
      description: 'Partagez vos résultats de manière sécurisée ou contribuez à la communauté scientifique.', 
      icon: FiShare2,
      details: [
        'Export vers formats standards',
        'Gestion fine des permissions',
        'Intégration avec les revues scientifiques'
      ]
    },
  ];

  return (
    <MotionSection className="bg-white py-20 sm:py-24" delay={0.3} id="how-it-works">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-cyan-600 tracking-wide uppercase">Processus Simplifié</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Comment fonctionne Orthanc ?
          </p>
          <p className="mt-5 max-w-3xl text-xl text-gray-500 mx-auto">
            Quatre étapes simples pour transformer vos données en connaissances.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (visible on larger screens) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2" aria-hidden="true"></div>

          <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.15, ease: "backOut" }}
                className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-sm border border-gray-200 relative z-10 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white mb-5 shadow-lg">
                  <span className="text-2xl font-bold">{step.id}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.name}</h3>
                <p className="text-base text-gray-600 mb-4">{step.description}</p>
                
                {/* Details dropdown */}
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                        {open ? (
                          <>
                            <span>Moins de détails</span>
                            <MinusIcon className="ml-1 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <span>Plus de détails</span>
                            <PlusIcon className="ml-1 h-4 w-4" />
                          </>
                        )}
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-3 text-sm text-gray-500 text-left">
                        <ul className="space-y-2">
                          {step.details.map((detail, i) => (
                            <li key={i} className="flex items-start">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                {/* Icon below text */}
                <div className="mt-4 text-cyan-500">
                  <step.icon className="h-8 w-8" aria-hidden="true" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video Demo 
        <div className="mt-20 bg-gray-900 rounded-xl overflow-hidden shadow-xl">
          <div className="aspect-w-16 aspect-h-9">
            <iframe 
              className="w-full h-full" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="Démonstration Orthanc" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>*/}
      </div>
    </MotionSection>
  );
};

// --- Dataset Showcase (Enhanced with Carousel) ---
const DatasetShowcase = () => {
  const datasets = [
    { 
      id: 1, 
      title: 'IRM Cérébrales (Tumeurs Gliome)', 
      description: 'Dataset multi-modalité (T1, T2, FLAIR) pour la segmentation de gliomes.', 
      category: 'Neuro-oncologie', 
      stats: '5.8k Utilisations', 
      image: '/images/image_2.jpg', 
      tags: ['IRM', 'Cerveau', 'Gliome'],
      size: '1.2TB',
      cases: '1,200',
      modalities: ['T1', 'T2', 'FLAIR'],
      license: 'CC-BY-NC 4.0',
      updated: getRandomDate(new Date(2022, 0, 1), new Date())
    },
    { 
      id: 2, 
      title: 'COVID-19 Radios Thorax', 
      description: 'Large collection de rayons X pulmonaires pour l\'étude et la détection de COVID-19.', 
      category: 'Pneumologie', 
      stats: '12.1k Utilisations', 
      image: '/images/image_3.jpg', 
      tags: ['Rayon X', 'Poumon', 'COVID-19'],
      size: '850GB',
      cases: '3,450',
      modalities: ['Rayons X'],
      license: 'CC-BY 4.0',
      updated: getRandomDate(new Date(2021, 0, 1), new Date())
    },
    { 
      id: 3, 
      title: 'OCT Rétiniennes (DMLA)', 
      description: 'Images de tomographie par cohérence optique pour la dégénérescence maculaire liée à l\'âge.', 
      category: 'Ophtalmologie', 
      stats: '3.2k Utilisations', 
      image: '/images/image_4.jpg', 
      tags: ['OCT', 'Rétine', 'DMLA'],
      size: '420GB',
      cases: '780',
      modalities: ['OCT'],
      license: 'CC-BY-NC-SA 4.0',
      updated: getRandomDate(new Date(2021, 6, 1), new Date())
    },
    { 
      id: 4, 
      title: 'Échographies Fœtales Biométrie', 
      description: 'Dataset pour l\'estimation automatique de la biométrie fœtale (PC, PA, LF).', 
      category: 'Obstétrique', 
      stats: '1.9k Utilisations', 
      image: '/images/image_5.jpg', 
      tags: ['Échographie', 'Fœtus', 'Biométrie'],
      size: '320GB',
      cases: '1,050',
      modalities: ['Ultrasons'],
      license: 'CC-BY 4.0',
      updated: getRandomDate(new Date(2022, 3, 1), new Date())
    },
    { 
      id: 5, 
      title: 'Scans CT Abdominaux (Organes)', 
      description: 'Collection de CT pour la segmentation multi-organes (Foie, Rate, Reins...).', 
      category: 'Radiologie Abdominale', 
      stats: '4.5k Utilisations', 
      image: '/images/image_6.jpg', 
      tags: ['CT', 'Abdomen', 'Segmentation'],
      size: '2.1TB',
      cases: '950',
      modalities: ['CT'],
      license: 'CC-BY-NC 4.0',
      updated: getRandomDate(new Date(2021, 9, 1), new Date())
    },
    { 
      id: 6, 
      title: 'Mammographies (Dépistage Cancer)', 
      description: 'Dataset de mammographies pour le développement d\'outils CAD pour le cancer du sein.', 
      category: 'Sénologie', 
      stats: '7.0k Utilisations', 
      image: '/images/image_7.jpg', 
      tags: ['Mammo', 'Sein', 'Cancer'],
      size: '1.5TB',
      cases: '2,300',
      modalities: ['Mammographie'],
      license: 'CC-BY-SA 4.0',
      updated: getRandomDate(new Date(2020, 11, 1), new Date())
    },
  ];

  return (
    <MotionSection className="bg-gradient-to-b from-white to-gray-50 py-20 sm:py-24" delay={0.4} id="datasets">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Bibliothèque de Données</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Datasets Médicaux Validés et Prêts à l'emploi
          </p>
          <p className="mt-5 max-w-3xl text-xl text-gray-500 mx-auto">
            Alimentez vos recherches et vos modèles avec des données de haute qualité issues de sources diverses.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium">
            Tous
          </button>
          {MEDICAL_SPECIALTIES.slice(0, 8).map((specialty) => (
            <button 
              key={specialty}
              className="px-4 py-2 rounded-full bg-white text-gray-700 text-sm font-medium border border-gray-300 hover:bg-gray-50"
            >
              {specialty}
            </button>
          ))}
          <button className="px-4 py-2 rounded-full bg-white text-blue-600 text-sm font-medium border border-blue-200 hover:bg-blue-50 flex items-center">
            Plus <ChevronDownIcon className="ml-1 h-4 w-4" />
          </button>
        </div>

        {/* Carousel for featured datasets */}
        <div className="mb-16">
          <Carousel
            showArrows={true}
            showStatus={false}
            showIndicators={true}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            stopOnHover={true}
            swipeable={true}
            dynamicHeight={false}
            emulateTouch={true}
            className="rounded-xl overflow-hidden shadow-lg"
          >
            {datasets.slice(0, 3).map((dataset) => (
              <div key={`carousel-${dataset.id}`} className="relative h-96">
                <Image
                  src={dataset.image}
                  alt={dataset.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-600 text-white mb-3">
                    {dataset.category}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{dataset.title}</h3>
                  <p className="mb-4">{dataset.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dataset.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/datasets/${dataset.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50"
                  >
                    Explorer ce dataset
                  </Link>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Datasets Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {datasets.map((dataset, index) => (
            <motion.div
              key={dataset.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="group relative bg-white overflow-hidden rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col transform hover:scale-[1.03]"
            >
              {/* Image Container */}
              <div className="h-56 w-full relative flex-shrink-0 overflow-hidden">
                <Image
                  src={dataset.image}
                  alt={`Aperçu ${dataset.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                <span className="absolute top-3 right-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800 shadow-sm z-10">
                  {dataset.category}
                </span>
              </div>
              
              {/* Content Container */}
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
                  <Link href={`/datasets/${dataset.id}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {dataset.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-600 flex-grow mb-4">{dataset.description}</p>
                
                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <FiDatabase className="mr-1 h-3 w-3" />
                    <span>{dataset.size}</span>
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="mr-1 h-3 w-3" />
                    <span>{dataset.cases} cas</span>
                  </div>
                  <div className="flex items-center">
                    <FiCpu className="mr-1 h-3 w-3" />
                    <span>{dataset.modalities.join(', ')}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    <span>Mis à jour {dataset.updated}</span>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {dataset.tags.map((tag) => (
                    <span key={tag} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Stats and Action */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-2">{dataset.stats}</span>
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-500">4.8</span>
                    </div>
                  </div>
                  <Link
                    href={`/datasets/${dataset.id}`}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 relative z-10 flex items-center group/link"
                  >
                    Explorer
                    <span aria-hidden="true" className="ml-1.5 transition-transform duration-200 group-hover/link:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Browse All Button */}
        <div className="mt-20 text-center">
          <Link
            href="/datasets"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
          >
            Voir tous les Datasets
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </MotionSection>
  );
};

// --- Community Section (Enhanced) ---
const CommunitySection = () => {
  const testimonials = [
    { 
      quote: "Orthanc a radicalement changé notre flux de travail collaboratif. L'accès sécurisé et les outils d'annotation sont phénoménaux.", 
      name: "Dr. Lena Moreau", 
      title: "Cheffe de Service Radiologie, APHP", 
      image: "/images/image_8.jpg",
      rating: 5
    },
    { 
      quote: "La richesse des datasets et la puissance des notebooks intégrés m'ont permis d'accélérer mes recherches sur l'IA en ophtalmologie de plusieurs mois.", 
      name: "Prof. Kenji Tanaka", 
      title: "Chercheur IA & Vision, Université de Tokyo", 
      image: "/images/image_10.jpg",
      rating: 5
    },
    { 
      quote: "En tant qu'ingénieur biomédical, l'API d'Orthanc nous a permis une intégration transparente avec notre PACS, simplifiant énormément la gestion des données.", 
      name: "Maria Garcia", 
      title: "Ingénieure Biomédicale, Clinica Barcelona", 
      image: "/images/image_6.jpg",
      rating: 4
    },
  ];
  
  const institutions = [
    { name: "MIT", image: "/images/image_6.jpg", url: "#" },
    { name: "Stanford Medicine", image: "/images/image_7.jpg", url: "#" },
    { name: "Inserm", image: "/images/image_9.jpg", url: "#" },
    { name: "NHS", image: "/images/image_2.jpg", url: "#" },
    { name: "Charité Berlin", image: "/images/image_3.jpg", url: "#" },
    { name: "Mayo Clinic", image: "/images/image_4.jpg", url: "#" },
    { name: "Google Health", image: "/images/image_5.jpg", url: "#" },
    { name: "Philips Healthcare", image: "/images/image_1.jpg", url: "#" },
  ];

  const events = [
    {
      title: "Webinar: Segmentation automatique des tumeurs cérébrales",
      date: "15 Juin 2023",
      time: "14:00 CEST",
      speaker: "Dr. Sophie Martin, Neuro-oncologue",
      image: "/images/image_8.jpg"
    },
    {
      title: "Atelier pratique: Déploiement de modèles d'IA en milieu clinique",
      date: "22 Juin 2023",
      time: "10:00 CEST",
      speaker: "Ing. Thomas Dupont, Expert en déploiement",
      image: "/images/image_9.jpg"
    },
    {
      title: "Conférence: L'avenir de l'imagerie médicale avec l'IA",
      date: "5 Juillet 2023",
      time: "16:00 CEST",
      speaker: "Prof. Jean-Luc Dubois, Chercheur en IA médicale",
      image: "/images/image_10.jpg"
    }
  ];

  return (
    <MotionSection className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20 sm:py-24 overflow-hidden" delay={0.5} id="community">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-cyan-600 tracking-wide uppercase">Notre Communauté</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Rejoignez les leaders de l'innovation en santé
          </p>
          <p className="mt-5 max-w-3xl text-xl text-gray-500 mx-auto">
            Ils font confiance à Orthanc pour faire avancer la recherche et les soins.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              className="flex flex-col justify-between p-8 bg-white rounded-xl shadow-lg border border-gray-100 h-full"
            >
              <blockquote className="relative grow mb-6">
                <svg className="absolute top-0 left-0 h-10 w-10 text-blue-100 transform -translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="relative text-lg text-gray-700 italic leading-relaxed">"{testimonial.quote}"</p>
              </blockquote>
              <figcaption className="flex items-center mt-auto pt-6 border-t border-gray-100">
                <div className="flex-shrink-0">
                  <Image src={testimonial.image} alt={testimonial.name} width={48} height={48} className="rounded-full object-cover ring-2 ring-offset-2 ring-cyan-200" />
                </div>
                <div className="ml-4">
                  <cite className="text-base font-semibold text-gray-900 not-italic">{testimonial.name}</cite>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* Trusted By Logos */}
        <div className="mt-24">
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-10">
            Adopté par des institutions pionnières et entreprises leaders
          </h3>
          <div className="mx-auto max-w-6xl grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-8 items-center">
            {institutions.map((inst, index) => (
              <motion.div
                key={inst.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="col-span-1 flex justify-center items-center filter grayscale hover:filter-none transition duration-300 ease-in-out opacity-60 hover:opacity-100"
                title={inst.name}
              >
                <Link href={inst.url} className="relative h-12 w-full">
                  <Image src={inst.image} alt={inst.name} fill className="object-contain" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-24">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Événements à venir dans notre communauté
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="h-48 relative">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm font-medium text-blue-600 mb-1">
                    {event.date} • {event.time}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">Par {event.speaker}</p>
                  <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                    S'inscrire
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/events" className="text-blue-600 hover:text-blue-800 font-medium">
              Voir tous les événements <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </MotionSection>
  );
};

// --- Pricing Section (New) ---
const PricingSection = () => {
  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      description: "Parfait pour découvrir la plateforme et les petites études",
      features: [
        "10GB de stockage",
        "Accès aux datasets publics",
        "Notebooks basiques (CPU)",
        "2 projets actifs",
        "Support communautaire"
      ],
      cta: "Commencer gratuitement",
      featured: false
    },
    {
      name: "Chercheur",
      price: "99€",
      description: "Pour les chercheurs individuels et les petites équipes",
      features: [
        "100GB de stockage",
        "Accès aux datasets premium",
        "Notebooks avancés (GPU)",
        "10 projets actifs",
        "Support prioritaire par email",
        "Annotations collaboratives"
      ],
      cta: "Essai gratuit 14 jours",
      featured: true
    },
    {
      name: "Institution",
      price: "Personnalisé",
      description: "Solution complète pour les hôpitaux et grandes équipes",
      features: [
        "Stockage illimité",
        "Tous les datasets premium",
        "Dédiée GPU clusters",
        "Projets illimités",
        "Support dédié 24/7",
        "Intégration PACS",
        "Formation sur site"
      ],
      cta: "Contactez-nous",
      featured: false
    }
  ];

  return (
    <MotionSection className="bg-white py-20 sm:py-24" delay={0.6} id="pricing">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Tarification</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Des plans adaptés à chaque besoin
          </p>
          <p className="mt-5 max-w-3xl text-xl text-gray-500 mx-auto">
            Commencez gratuitement et évoluez selon vos besoins.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl shadow-lg overflow-hidden border ${
                plan.featured
                  ? "border-blue-500 ring-2 ring-blue-500 transform md:-translate-y-6"
                  : "border-gray-200"
              }`}
            >
              <div className={`px-6 py-8 ${
                plan.featured ? "bg-gradient-to-r from-blue-600 to-cyan-600" : "bg-white"
              }`}>
                <h3 className={`text-lg font-medium ${
                  plan.featured ? "text-white" : "text-gray-900"
                }`}>
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className={`text-4xl font-extrabold ${
                    plan.featured ? "text-white" : "text-gray-900"
                  }`}>
                    {plan.price}
                  </span>
                  {plan.price !== "0€" && plan.price !== "Personnalisé" && (
                    <span className={`ml-1 text-lg font-medium ${
                      plan.featured ? "text-blue-100" : "text-gray-500"
                    }`}>
                      /mois
                    </span>
                  )}
                </div>
                <p className={`mt-2 text-sm ${
                  plan.featured ? "text-blue-100" : "text-gray-500"
                }`}>
                  {plan.description}
                </p>
              </div>
              <div className="bg-gray-50 px-6 pt-8 pb-8">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href={plan.name === "Institution" ? "/contact" : "/register"}
                    className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium ${
                      plan.featured
                        ? "bg-white text-blue-600 hover:bg-gray-50"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Questions fréquentes
          </h3>
          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            {[
              {
                question: "Puis-je passer d'un plan à un autre ?",
                answer: "Oui, vous pouvez changer de plan à tout moment. Le changement prend effet immédiatement et nous ajusterons votre facture proportionnellement."
              },
              {
                question: "Y a-t-il des frais cachés ?",
                answer: "Non, tous nos prix sont transparents. Le seul coût additionnel serait si vous dépassez votre quota de stockage sur les plans payants, auquel cas nous vous contacterons pour discuter des options."
              },
              {
                question: "Quelle est la politique d'annulation ?",
                answer: "Vous pouvez annuler à tout moment. Aucun remboursement n'est effectué pour la période en cours, mais vous continuerez à avoir accès aux fonctionnalités jusqu'à la fin de votre cycle de facturation."
              },
              {
                question: "Proposez-vous des tarifs éducation ?",
                answer: "Oui, nous offrons des réductions importantes pour les établissements d'enseignement et les étudiants. Contactez-nous pour plus d'informations."
              }
            ].map((faq, index) => (
              <Disclosure key={index}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex justify-between items-center w-full px-6 py-4 text-left text-gray-700 hover:bg-gray-50">
                      <span className="font-medium">{faq.question}</span>
                      {open ? (
                        <MinusIcon className="h-5 w-5 text-blue-600" />
                      ) : (
                        <PlusIcon className="h-5 w-5 text-blue-600" />
                      )}
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-6 py-4 text-gray-500">
                      {faq.answer}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </div>
        </div>
      </div>
    </MotionSection>
  );
};

// --- CTA Section (Enhanced) ---
const CTASection = () => {
  return (
    <div className="bg-gradient-to-r from-cyan-700 to-blue-800">
      <MotionSection className="max-w-5xl mx-auto text-center py-20 px-4 sm:py-28 sm:px-6 lg:px-8" delay={0.2}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl leading-tight"
        >
          <span className="block">Prêt à révolutionner</span>
          <span className="block text-cyan-200 mt-2">votre approche de l'imagerie médicale ?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-xl leading-8 text-blue-100 max-w-2xl mx-auto"
        >
          Rejoignez Orthanc dès aujourd'hui. Inscrivez-vous gratuitement et commencez à explorer, collaborer et innover sans attendre.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-semibold rounded-lg text-blue-700 bg-white hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 sm:w-auto"
          >
            Créer mon compte gratuit
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center px-10 py-4 border border-white text-lg font-semibold rounded-lg text-white hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl sm:w-auto"
          >
            Demander une démo
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 text-sm text-blue-200"
        >
          <p>Aucune carte de crédit requise • Essai de 14 jours pour les plans payants</p>
        </motion.div>
      </MotionSection>
    </div>
  );
};

// --- Footer (Enhanced) ---
const Footer = () => {
  const links = [
    { 
      title: 'Plateforme', 
      items: [ 
        { name: 'Fonctionnalités', href: '/features' }, 
        { name: 'Visualiseur DICOM', href: '/viewer' }, 
        { name: 'Notebooks IA', href: '/notebooks' }, 
        { name: 'Sécurité & Conformité', href: '/security' }, 
        { name: 'Tarifs', href: '/pricing' } 
      ] 
    },
    { 
      title: 'Solutions', 
      items: [ 
        { name: 'Recherche Clinique', href: '/solutions/research' }, 
        { name: 'Développement IA', href: '/solutions/ai-dev' }, 
        { name: 'Enseignement Médical', href: '/solutions/education' }, 
        { name: 'Collaboration Hospitalière', href: '/solutions/hospitals' } 
      ] 
    },
    { 
      title: 'Ressources', 
      items: [ 
        { name: 'Documentation API', href: '/docs/api' }, 
        { name: 'Tutoriels Vidéo', href: '/tutorials' }, 
        { name: 'Blog Technique', href: '/blog' }, 
        { name: 'Études de Cas', href: '/case-studies' }, 
        { name: 'Support', href: '/support' } 
      ] 
    },
    { 
      title: 'Communauté', 
      items: [ 
        { name: 'Forum Utilisateurs', href: '/community/forum' }, 
        { name: 'Événements & Webinars', href: '/events' }, 
        { name: 'Programme Partenaires', href: '/partners' }, 
        { name: 'Contribuer (Open Source)', href: '/contribute' } 
      ] 
    },
    { 
      title: 'Entreprise', 
      items: [ 
        { name: 'À Propos de Nous', href: '/about' }, 
        { name: 'Carrières', href: '/careers' }, 
        { name: 'Contactez-nous', href: '/contact' }, 
        { name: 'Presse & Médias', href: '/press' } 
      ] 
    },
  ];

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: FaTwitter }, 
    { name: 'GitHub', href: '#', icon: FaGithub }, 
    { name: 'LinkedIn', href: '#', icon: FaLinkedin },
    { name: 'YouTube', href: '#', icon: FaYoutube }, 
    { name: 'Discord', href: '#', icon: FaDiscord }, 
    { name: 'Slack', href: '#', icon: FaSlack },
    { name: 'Medium', href: '#', icon: FaMedium },
    { name: 'Reddit', href: '#', icon: FaReddit },
    { name: 'Stack Overflow', href: '#', icon: FaStackOverflow }
  ];

  const legalLinks = [
    { name: 'Conditions d\'utilisation', href: '/terms' }, 
    { name: 'Politique de confidentialité', href: '/privacy' }, 
    { name: 'Gestion des cookies', href: '/cookies' },
    { name: 'RGPD', href: '/gdpr' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-400" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Pied de page</h2>
      <div className="max-w-screen-xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
        {/* Top section with logo and social links */}
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            {/* Logo Area */}
            <Link href="/" className="inline-flex items-center space-x-3">
              <svg className="h-10 w-10 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-5 4 5h-3v4H11z"/>
              </svg>
              <span className="text-3xl font-bold text-cyan-400">Orthanc</span>
            </Link>
            <p className="text-gray-300 text-base leading-relaxed">
              Accélérer l'innovation en imagerie médicale grâce à la collaboration et l'intelligence artificielle.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
                Abonnez-vous à notre newsletter
              </h3>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-grow px-4 py-2 border border-gray-700 rounded-l-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-r-md bg-cyan-600 text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  S'abonner
                </button>
              </form>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
                Suivez-nous
              </h3>
              <div className="flex space-x-4">
                {socialLinks.slice(0, 6).map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <span className="sr-only">{link.name}</span>
                    <link.icon className="h-6 w-6" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2 md:grid-cols-3 lg:grid-cols-5">
            {links.map((section) => (
              <div key={section.title} className="md:grid md:grid-cols-1 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
                    {section.title}
                  </h3>
                  <ul role="list" className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <Link 
                          href={item.href} 
                          className="text-base text-gray-400 hover:text-white hover:underline transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom section with copyright and legal links */}
        <div className="mt-16 border-t border-gray-800 pt-8 sm:flex sm:items-center sm:justify-between">
          <div className="flex space-x-6 sm:order-2">
            {legalLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-500 sm:mt-0 sm:order-1">
            © {new Date().getFullYear()} Projet Orthanc. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

// --- Main Page Component ---
export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DatasetShowcase />
        <CommunitySection />
        <PricingSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}

// --- END OF FILE page.tsx ---