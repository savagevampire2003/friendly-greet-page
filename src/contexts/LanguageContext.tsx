
import React, { createContext, useContext } from 'react';
import type { LanguageContextType } from '../types/language';
import { getTranslation } from '../translations';
import { useLanguageStorage } from '../hooks/useLanguageStorage';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage } = useLanguageStorage();

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Return default values instead of throwing error to prevent crashes
    console.warn('useLanguage called outside LanguageProvider, using defaults');
    return {
      language: 'en' as const,
      setLanguage: () => {},
      t: (key: string) => key,
      isRTL: false
    };
  }
  return context;
};
