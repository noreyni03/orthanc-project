import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-gray-50 pt-24 md:pt-32 lg:pt-40 pb-20 md:pb-24 overflow-hidden">
      <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 opacity-10">
        <div className="w-96 h-96 rounded-full bg-cyan-300 blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 opacity-10">
        <div className="w-80 h-80 rounded-full bg-blue-300 blur-3xl"></div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
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
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="mt-10 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link
                href="/auth/signup"
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

export default HeroSection;