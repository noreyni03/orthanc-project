import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';
import { 
  FaTwitter, FaGithub, FaLinkedin, FaYoutube, 
  FaDiscord, FaSlack, FaMedium, FaReddit, FaStackOverflow 
} from 'react-icons/fa';

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
    <motion.section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20 sm:py-24 overflow-hidden" id="community">
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
    </motion.section>
  );
};

export default CommunitySection;