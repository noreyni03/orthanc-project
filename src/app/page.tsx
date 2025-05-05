// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getRandomDate } from '@/utils/dateUtils';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DatasetShowcase from '@/components/DatasetShowcase';
import CommunitySection from '@/components/CommunitySection';
import PricingSection from '@/components/PricingSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  const [updatedDates, setUpdatedDates] = useState<string[]>([]);

  useEffect(() => {
    // Déplacez la logique de génération de dates côté client
    const dates = [
      getRandomDate(new Date(2022, 0, 1), new Date()),
      getRandomDate(new Date(2021, 0, 1), new Date()),
      getRandomDate(new Date(2021, 6, 1), new Date()),
      getRandomDate(new Date(2022, 3, 1), new Date()),
      getRandomDate(new Date(2021, 9, 1), new Date()),
      getRandomDate(new Date(2020, 11, 1), new Date()),
    ];
    setUpdatedDates(dates);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DatasetShowcase updatedDates={updatedDates} />
        <CommunitySection />
        <PricingSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}