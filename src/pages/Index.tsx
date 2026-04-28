import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VertexHero from '@/components/homepage/vertex/VertexHero';
import VertexLivePrices from '@/components/homepage/vertex/VertexLivePrices';
import VertexFeatures from '@/components/homepage/vertex/VertexFeatures';
import VertexHowItWorks from '@/components/homepage/vertex/VertexHowItWorks';
import VertexStats from '@/components/homepage/vertex/VertexStats';
import VertexTestimonials from '@/components/homepage/vertex/VertexTestimonials';
import VertexCTA from '@/components/homepage/vertex/VertexCTA';
import MatrixContentDiscovery from '@/components/homepage/matrix/MatrixContentDiscovery';
import MatrixActivityTicker from '@/components/homepage/matrix/MatrixActivityTicker';
import MatrixStickyBar from '@/components/homepage/matrix/MatrixStickyBar';

const Index: React.FC = () => {
  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <Header />

      <div className="relative z-10">
        <VertexHero />
        <VertexLivePrices />
        <VertexFeatures />
        <VertexHowItWorks />
        <VertexStats />

        {/* Existing News / Calendar / FAQ discovery preserved */}
        <div className="max-w-7xl mx-auto">
          <MatrixContentDiscovery />
        </div>

        <VertexTestimonials />
        <VertexCTA />
        <Footer />
      </div>

      {/* Floating elements */}
      <MatrixStickyBar />
      <MatrixActivityTicker />
    </main>
  );
};

export default Index;
