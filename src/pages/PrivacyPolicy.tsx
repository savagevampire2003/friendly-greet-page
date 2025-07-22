import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, Lock, Eye, Database } from 'lucide-react';

const PrivacyPolicy = () => {
  const { language, t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h1 className={`text-4xl font-bold text-gray-900 mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t('privacyTitle')}
            </h1>
            <p className={`text-lg text-gray-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t('lastUpdated')}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('informationWeCollect')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Database className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className={`font-semibold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('medicalImages')}</h3>
                    <p className={`text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {t('medicalImagesDesc')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Eye className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className={`font-semibold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>{t('usageData')}</h3>
                    <p className={`text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {t('usageDataDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('howWeUse')}
              </h2>
              <div className={`space-y-2 text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('howWeUseList').split('\n').map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </div>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('dataSecurity')}
              </h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <Lock className="w-8 h-8 text-blue-600 mb-3" />
                <p className={`text-gray-800 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('dataSecurityDesc')}
                </p>
              </div>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('dataRetention')}
              </h2>
              <p className={`text-gray-700 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('dataRetentionDesc')}
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('dataSharing')}
              </h2>
              <p className={`text-gray-700 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('dataSharingDesc')}
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('yourRights')}
              </h2>
              <div className={`space-y-2 text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('yourRightsList').split('\n').map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </div>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('contactUs')}
              </h2>
              <p className={`text-gray-700 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('contactDesc')}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
