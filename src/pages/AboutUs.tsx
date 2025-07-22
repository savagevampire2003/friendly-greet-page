import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { Users, Target, Eye, Stethoscope, Heart, Microscope, Activity } from 'lucide-react';

const AboutUs = () => {
  const { language, t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Users className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h1 className={`text-4xl font-bold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('aboutTitle')}
              </h1>
              <p className={`text-xl text-gray-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('aboutSubtitle')}
              </p>
            </div>

            <section className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Target className="w-12 h-12 text-green-600 mb-4" />
                  <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t('ourMission')}
                  </h2>
                  <p className={`text-gray-700 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t('missionText')}
                  </p>
                </div>
                <div>
                  <Eye className="w-12 h-12 text-blue-600 mb-4" />
                  <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t('ourVision')}
                  </h2>
                  <p className={`text-gray-700 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t('visionText')}
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-16">
              <h2 className={`text-3xl font-semibold text-gray-900 mb-8 text-center ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('whatWeOffer')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <Stethoscope className="w-10 h-10 text-red-600 mb-4" />
                  <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t('xrayAnalysis')}
                  </h3>
                  <p className={`text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('xrayAnalysisDesc')}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <Heart className="w-10 h-10 text-pink-600 mb-4" />
                  <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t('cbcAnalysis')}
                  </h3>
                  <p className={`text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('cbcAnalysisDesc')}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <Activity className="w-10 h-10 text-yellow-600 mb-4" />
                  <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t('ecgAnalysis')}
                  </h3>
                  <p className={`text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('ecgAnalysisDesc')}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <Microscope className="w-10 h-10 text-purple-600 mb-4" />
                  <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t('microscopyAnalysis')}
                  </h3>
                  <p className={`text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('microscopyAnalysisDesc')}</p>
                </div>
              </div>
            </section>

            <section>
              <div className="text-center">
                <h2 className={`text-3xl font-semibold text-gray-900 mb-8 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('ourTeam')}
                </h2>
                <p className={`text-gray-700 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('teamText')}
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
