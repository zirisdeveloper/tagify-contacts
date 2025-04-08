
import React, { createContext, useContext, useState, useEffect } from 'react';
import i18next from '../utils/i18n';
import { initializeI18n, updateI18nResources } from '../utils/i18n';
import { TranslationsType, defaultTranslations } from '../utils/translations';

interface LanguageContextProps {
  language: string;
  t: (key: string) => string;
  setLanguage: (lang: string) => void;
  translations: TranslationsType;
  updateTranslations: (newTranslations: TranslationsType) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  t: (key: string) => key,
  setLanguage: () => {},
  translations: {},
  updateTranslations: () => {},
});

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState<TranslationsType>(defaultTranslations);

  useEffect(() => {
    // Initialize i18next
    const i18n = initializeI18n();
    
    // Set up language change listener
    i18n.on('languageChanged', (lng: string) => {
      setLanguage(lng);
      document.documentElement.setAttribute('lang', lng);
    });
    
    // Set initial language
    setLanguage(i18n.language);
    document.documentElement.setAttribute('lang', i18n.language);
    
    // Set initial translations
    setTranslations(defaultTranslations);
    
    // Clean up
    return () => {
      i18n.off('languageChanged');
    };
  }, []);

  const changeLanguage = (lang: string) => {
    i18next.changeLanguage(lang);
  };

  const updateTranslations = (newTranslations: TranslationsType) => {
    setTranslations(newTranslations);
    updateI18nResources(newTranslations, language);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        t: i18next.t,
        setLanguage: changeLanguage,
        translations,
        updateTranslations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
