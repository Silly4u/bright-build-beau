import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/homepage/HeroSection';
import WhySection from '@/components/homepage/WhySection';
import ServicesPreview from '@/components/homepage/ServicesPreview';
import TestimonialsSection from '@/components/homepage/TestimonialsSection';
import CtaSection from '@/components/homepage/CtaSection';

const Index: React.FC = () => {
  return (
    <main className="min-h-screen bg-navy grain-overlay">
      <Header />
      <HeroSection />
      <WhySection />
      <ServicesPreview />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </main>
  );
};

export default Index;
