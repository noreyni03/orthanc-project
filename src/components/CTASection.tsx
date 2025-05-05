import { motion } from 'framer-motion';
import Link from 'next/link';

const CTASection = () => {
  return (
    <div className="bg-gradient-to-r from-cyan-700 to-blue-800">
      <div className="max-w-5xl mx-auto text-center py-20 px-4 sm:py-28 sm:px-6 lg:px-8">
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
      </div>
    </div>
  );
};

export default CTASection;