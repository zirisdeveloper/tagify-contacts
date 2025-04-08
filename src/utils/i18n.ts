
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { defaultTranslations, TranslationsType } from './translations';

// Initialize i18next with default configuration and translations
export const initializeI18n = () => {
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      debug: false,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      resources: formatResourcesForI18n(defaultTranslations),
    });

  return i18next;
};

// Convert our translations format to i18next's expected format
export const formatResourcesForI18n = (translations: TranslationsType) => {
  const resources: Record<string, { translation: Record<string, string> }> = {};
  
  Object.keys(translations).forEach(lang => {
    resources[lang] = {
      translation: translations[lang]
    };
  });
  
  return resources;
};

// Update i18n with new translations
export const updateI18nResources = (translations: TranslationsType, currentLanguage: string) => {
  Object.keys(translations).forEach(lang => {
    i18next.addResourceBundle(lang, 'translation', translations[lang], true, true);
  });
  
  if (currentLanguage) {
    i18next.changeLanguage(currentLanguage);
  }
};

export default i18next;
