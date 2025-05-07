'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { Disclosure } from '@headlessui/react';
import { motion } from 'framer-motion'; // Added this import

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
  VideoCameraIcon,
  ClockIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlusIcon,
  MinusIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { FaTwitter, FaGithub, FaLinkedin, FaYoutube, FaDiscord, FaSlack, FaMedium, FaReddit, FaStackOverflow } from 'react-icons/fa';
import {
  FiCpu, FiUsers, FiDatabase, FiBarChart2, FiLock, FiEye, FiShare2, FiEdit,
  FiTrendingUp, FiFolderPlus, FiLifeBuoy, FiMessageSquare, FiGrid, FiLayers,
  FiSettings, FiSearch, FiHelpCircle
} from 'react-icons/fi';
import { useSession, signIn, signOut } from 'next-auth/react';
import { StarIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        { name: 'Forum général', href: '/discussions/forum', icon: FiMessageSquare },
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
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 mr-8 group">
              <svg className="h-8 w-8 text-cyan-600 group-hover:text-blue-700 transition-colors duration-200" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-5 4 5h-3v4H11z"/>
              </svg>
              <span className="text-2xl md:text-3xl font-bold text-cyan-600 group-hover:text-blue-700 transition-colors duration-200">
                Orthanc
              </span>
            </Link>
            
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

          <div className="flex items-center">
            <button className="hidden lg:flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 mr-2">
              <FiSearch className="h-5 w-5" />
            </button>

            <div className="hidden lg:flex items-center space-x-5">
              {status === 'loading' && <AuthLoadingSkeleton />}

              {status === 'unauthenticated' && (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-600 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-gray-100"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/signup"
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
            <div className="px-4 pt-3 pb-2">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
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
                    href="/auth/signup"
                    className="w-full text-center inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Inscription Gratuite
                  </Link>
                </div>
              )}

              {status === 'authenticated' && user && (
                <div className="px-5">
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

export default Navbar;