import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MatrixHero from '@/components/homepage/matrix/MatrixHero';
import MatrixLiveTicker from '@/components/homepage/matrix/MatrixLiveTicker';
import MatrixSignalStream from '@/components/homepage/matrix/MatrixSignalStream';
import MatrixStats from '@/components/homepage/matrix/MatrixStats';
import MatrixContentDiscovery from '@/components/homepage/matrix/MatrixContentDiscovery';
import MatrixStickyBar from '@/components/homepage/matrix/MatrixStickyBar';
import MatrixActivityTicker from '@/components/homepage/matrix/MatrixActivityTicker';
import WhySection from '@/components/homepage/WhySection';
import TestimonialsSection from '@/components/homepage/TestimonialsSection';
import CtaSection from '@/components/homepage/CtaSection';

const Index: React.FC = () => {
  return (
    <main className="min-h-screen bg-navy text-foreground relative overflow-x-hidden">
      <Header />

      {/* Matrix neon ambient layer */}
      <div className="absolute inset-0 matrix-grid-bg pointer-events-none z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square matrix-glow-uv pointer-events-none rounded-full z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] aspect-square matrix-glow-cyan pointer-events-none rounded-full z-0" />

      <div className="relative z-10">
        {/* Hero + Live Widgets side-by-side */}
        <div className="max-w-7xl mx-auto pt-24 lg:pt-28 grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 lg:px-12">
          <div className="lg:col-span-7">
            <MatrixHero />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-5 pt-6 lg:pt-24">
            <MatrixLiveTicker />
            <MatrixSignalStream />
          </div>
        </div>

        {/* Stats counter + trust badges */}
        <div className="max-w-7xl mx-auto">
          <MatrixStats />
        </div>

        {/* Content discovery: News, Calendar, How-it-works, FAQ */}
        <div className="max-w-7xl mx-auto">
          <MatrixContentDiscovery />
        </div>

        {/* Existing sections preserved */}
        <WhySection />
        <TestimonialsSection />
        <CtaSection />
        <Footer />
      </div>

      {/* Floating elements */}
      <MatrixStickyBar />
      <MatrixActivityTicker />
    </main>
  );
};

export default Index;
