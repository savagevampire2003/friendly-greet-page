
import { enTranslations } from './en';
import { arTranslations } from './ar';
import type { Language } from '../types/language';

export const translations = {
  en: enTranslations,
  ar: arTranslations,
} as const;

export const getTranslation = (language: Language, key: string): string => {
  return translations[language][key as keyof typeof translations['en']] || key;
};
