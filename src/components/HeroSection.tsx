
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, Brain, Shield } from 'lucide-react';

const HeroSection = () => {
  const { language, t, isRTL } = useLanguage();

  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className={`text-4xl md:text-6xl font-bold text-gray-900 mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t('welcomeTitle')}
          </h1>
          
          {/* Subtitle */}
          <p className={`text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t('welcomeSubtitle')}
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Button 
              size="lg" 
              className="medical-gradient text-white px-8 py-3 text-lg"
              onClick={scrollToUpload}
            >
              <Upload className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span className={language === 'ar' ? 'font-arabic' : ''}>{t('getStarted')}</span>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-3 text-lg"
              onClick={scrollToFeatures}
            >
              <span className={language === 'ar' ? 'font-arabic' : ''}>{t('learnMore')}</span>
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-lg medical-card-hover">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 mx-auto">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                AI-Powered Analysis
              </h3>
              <p className={`text-gray-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
                Advanced machine learning algorithms for accurate medical image analysis
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg medical-card-hover">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 mx-auto">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                Secure & Private
              </h3>
              <p className={`text-gray-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
                Your medical data is encrypted and stored securely with privacy protection
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg medical-card-hover">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 mx-auto">
                <Upload className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                Easy Upload
              </h3>
              <p className={`text-gray-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
                Simple drag-and-drop interface for uploading medical images
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
