import Link from 'next/link';
import Image from 'next/image';
import { 
  FaTwitter, FaGithub, FaLinkedin, FaYoutube, 
  FaDiscord, FaSlack, FaMedium, FaReddit, FaStackOverflow 
} from 'react-icons/fa';

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
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="inline-flex items-center space-x-3">
              <svg className="h-10 w-10 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-5 4 5h-3v4H11z"/>
              </svg>
              <span className="text-3xl font-bold text-cyan-400">Orthanc</span>
            </Link>
            <p className="text-gray-300 text-base leading-relaxed">
              Accélérer l'innovation en imagerie médicale grâce à la collaboration et l'intelligence artificielle.
            </p>
            
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

export default Footer;