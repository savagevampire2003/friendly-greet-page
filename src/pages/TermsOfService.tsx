import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { FileText, AlertTriangle, Scale, Users } from 'lucide-react';

const TermsOfService = () => {
  const { language, t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <FileText className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h1 className={`text-4xl font-bold text-gray-900 mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('termsTitle')}
              </h1>
              <p className={`text-lg text-gray-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('lastUpdated')}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                <div className="flex items-center mb-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                  <h2 className={`text-xl font-semibold text-yellow-800 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t('medicalDisclaimer')}
                  </h2>
                </div>
                <p className={`text-yellow-800 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('disclaimerDesc')}
                </p>
              </div>

              <section>
                <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('acceptanceOfTerms')}
                </h2>
                <p className={`text-gray-700 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('acceptanceDesc')}
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('intendedUse')}
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className={`font-semibold mb-2 text-green-700 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('intendedUseFor')}</h3>
                    <div className={`space-y-1 text-gray-700 ml-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {t('intendedUseList').split('\n').map((item, index) => (
                        <div key={index}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-2 text-red-700 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('notIntendedFor')}</h3>
                    <div className={`space-y-1 text-gray-700 ml-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {t('notIntendedList').split('\n').map((item, index) => (
                        <div key={index}>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('userResponsibilities')}
                </h2>
                <div className={`space-y-2 text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('userResponsibilitiesList').split('\n').map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('serviceAvailability')}
                </h2>
                <p className={`text-gray-700 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('serviceAvailabilityDesc')}
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('intellectualProperty')}
                </h2>
                <p className={`text-gray-700 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('intellectualPropertyDesc')}
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('limitationOfLiability')}
                </h2>
                <div className="bg-red-50 p-6 rounded-lg">
                  <Scale className="w-8 h-8 text-red-600 mb-3" />
                  <p className={`text-red-800 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t('limitationOfLiabilityDesc')}
                  </p>
                </div>
              </section>

              <section>
                <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('professionalStandards')}
                </h2>
                <p className={`text-gray-700 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('professionalStandardsDesc')}
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('governingLaw')}
                </h2>
                <p className={`text-gray-700 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('governingLawDesc')}
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('termsContactUs')}
                </h2>
                <p className={`text-gray-700 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('termsContactDesc')}
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
