import { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { CheckCircleIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import MotionSection from './MotionSection';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
    <MotionSection className="bg-white py-20 sm:py-24" id="pricing">
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

export default PricingSection;