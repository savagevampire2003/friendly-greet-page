
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Languages, LogOut } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Header = () => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { user, userProfile, signOut } = useAuth();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

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
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden">
              <img 
                src="/IMG_5657.jpeg.jpg" 
                alt="NashMed AI Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className={`text-xl font-bold text-gray-900 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('appName')}
              </h1>
              <p className={`text-xs text-gray-500 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('tagline')}
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className={`hidden md:flex items-center space-x-8 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Link to="/" className={`text-gray-700 hover:text-blue-600 transition-colors ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t('home')}
            </Link>
            {!user && (
              <button 
                onClick={scrollToUpload}
                className={`text-gray-700 hover:text-blue-600 transition-colors ${language === 'ar' ? 'font-arabic' : ''}`}
              >
                {t('upload')}
              </button>
            )}
            {user && userProfile?.role === 'doctor' && (
              <Link to="/doctor" className={`text-gray-700 hover:text-blue-600 transition-colors ${language === 'ar' ? 'font-arabic' : ''}`}>
                Doctor Portal
              </Link>
            )}
            {user && userProfile?.role === 'patient' && (
              <Link to="/patient" className={`text-gray-700 hover:text-blue-600 transition-colors ${language === 'ar' ? 'font-arabic' : ''}`}>
                Consultations
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            {/* Notifications - only for logged in users */}
            {user && <NotificationBell />}
            
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}
            >
              <Languages className="w-4 h-4" />
              <span className={language === 'ar' ? 'font-arabic' : ''}>
                {language === 'en' ? 'العربية' : 'English'}
              </span>
            </Button>
            
            {/* User Actions */}
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}
              >
                <LogOut className="w-4 h-4" />
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  Sign Out
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
