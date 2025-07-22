
import { useState, useEffect } from 'react';
import type { Language } from '../types/language';

export const useLanguageStorage = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('meddx-language') as Language;
    return savedLanguage || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('meddx-language', lang);
  };

  useEffect(() => {
    const isRTL = language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return { language, setLanguage };
};
