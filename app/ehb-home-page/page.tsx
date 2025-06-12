import React from 'react';
import HeroSection from '@/components/EHB-Home-Page/HeroSection';
import AIEntrySearch from '@/components/EHB-Home-Page/AIEntrySearch';
import QuickAccessCards from '@/components/EHB-Home-Page/QuickAccessCards';
import NewsTicker from '@/components/EHB-Home-Page/NewsTicker';
import ServicesPreview from '@/components/EHB-Home-Page/ServicesPreview';
import FranchiseHighlight from '@/components/EHB-Home-Page/FranchiseHighlight';
import TopBrandsSlider from '@/components/EHB-Home-Page/TopBrandsSlider';
import MobileAppCTA from '@/components/EHB-Home-Page/MobileAppCTA';
import Footer from '@/components/EHB-Home-Page/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NewsTicker />
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <AIEntrySearch />
      </div>
      <QuickAccessCards />
      <ServicesPreview />
      <FranchiseHighlight />
      <TopBrandsSlider />
      <MobileAppCTA />
      <Footer />
    </div>
  );
}
