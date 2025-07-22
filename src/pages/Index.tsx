
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import MedicalCategories from '../components/MedicalCategories';
import UploadSection from '../components/UploadSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <MedicalCategories />
        <UploadSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
