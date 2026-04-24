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
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <Header />

      <div className="relative z-10">
        <section className="relative min-h-[92svh] overflow-hidden border-b border-primary/10">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
            src="/videos/financial-market-hero.mp4"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--background))_0%,hsl(var(--background)/0.86)_38%,hsl(var(--background)/0.54)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,hsl(var(--primary)/0.22),transparent_34%),radial-gradient(circle_at_22%_78%,hsl(var(--secondary)/0.18),transparent_30%)]" />
          <div className="absolute inset-0 matrix-grid-bg opacity-35" />

          <div className="relative max-w-7xl mx-auto min-h-[92svh] pt-28 lg:pt-32 pb-12 px-5 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
            <div className="lg:col-span-7 xl:col-span-8">
              <MatrixHero />
            </div>
            <aside className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 lg:gap-5 lg:translate-y-8">
              <MatrixLiveTicker />
              <MatrixSignalStream />
            </aside>
          </div>
        </section>

        {/* Stats counter + trust badges */}
        <div className="max-w-7xl mx-auto -mt-1">
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
