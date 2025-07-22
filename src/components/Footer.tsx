
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { language, t, isRTL } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className={`flex items-center space-x-3 mb-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden">
                <img 
                  src="/IMG_5657.jpeg.jpg" 
                  alt="NashMed AI Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('appName')}
              </h3>
            </div>
            <p className={`text-gray-400 mb-4 max-w-md ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t('tagline')} - Advanced AI technology for accurate medical image analysis and diagnosis support.
            </p>
            <div className="flex space-x-4">
              <div className="bg-gray-800 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div className="bg-gray-800 p-2 rounded-lg">
                <Heart className="w-5 h-5 text-red-400" />
              </div>
              <div className="bg-gray-800 p-2 rounded-lg">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t('services')}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li className={language === 'ar' ? 'font-arabic' : ''}>{t('xrayAnalysis')}</li>
              <li className={language === 'ar' ? 'font-arabic' : ''}>{t('cbcAnalysis')}</li>
              <li className={language === 'ar' ? 'font-arabic' : ''}>{t('ecgAnalysis')}</li>
              <li className={language === 'ar' ? 'font-arabic' : ''}>{t('microscopyAnalysis')}</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t('company')}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/about" className={`hover:text-white transition-colors ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={`hover:text-white transition-colors ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className={`hover:text-white transition-colors ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('termsOfService')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`hover:text-white transition-colors ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h4 className={`text-lg font-semibold mb-2 text-yellow-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t('disclaimer')}
            </h4>
            <p className={`text-gray-300 text-sm leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t('disclaimerText')}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className={`border-t border-gray-800 pt-8 text-center text-gray-400 ${language === 'ar' ? 'font-arabic' : ''}`}>
          <p>&copy; {t('copyrightText')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
