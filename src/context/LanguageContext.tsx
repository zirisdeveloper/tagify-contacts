import React, { createContext, useContext, useState, useEffect } from 'react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export interface TranslationsType {
  [language: string]: {
    [key: string]: string;
  };
}

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
  const [translations, setTranslations] = useState<TranslationsType>({});

  useEffect(() => {
    const resources = {
      en: {
        translation: {
          appName: 'Backdoor',
          newContact: 'New Contact',
          searchContacts: 'Search Contacts',
          exportContacts: 'Export Contacts',
          importContacts: 'Import Contacts',
          about: 'About',
          searchByServiceOrTag: 'Search by service or tag',
          noContactsFound: 'No Contacts Found',
          noContactsWithService: 'No contacts with the service',
          wereFound: 'were found',
          addContact: 'Add Contact',
          searchForService: 'Search for a service',
          typeServiceOrTag: 'Type a service or tag to search for contacts.',
          noContacts: 'No Contacts',
          addYourFirstContact: 'Add your first contact',
          contactsFound: 'contacts found',
          contactFound: 'contact found',
          searchingServices: 'searching services',
          typeNameToFind: 'Type a name to find',
          home: 'Home',
          menu: 'Menu',
          developedBy: 'Developed by',
          close: 'Close',
          noContactsToExport: 'No contacts to export',
          contactsExported: 'contacts exported',
          importFailed: 'Import failed',
          invalidFileFormat: 'Invalid file format',
          exportError: "Export failed. Please try again.",
          save: "Save",
          modifyTranslations: "Modify Translations",
          changeLanguage: "Change Language",
        },
      },
      fr: {
        translation: {
          appName: 'Piston',
          newContact: 'Nouveau Contact',
          searchContacts: 'Rechercher des Contacts',
          exportContacts: 'Exporter les Contacts',
          importContacts: 'Importer des Contacts',
          about: 'À propos',
          searchByServiceOrTag: 'Recherche par service ou tag',
          noContactsFound: 'Aucun Contact Trouvé',
          noContactsWithService: 'Aucun contact avec le service',
          wereFound: 'ont été trouvés',
          addContact: 'Ajouter un Contact',
          searchForService: 'Rechercher un service',
          typeServiceOrTag: 'Tapez un service ou un tag pour rechercher des contacts.',
          noContacts: 'Aucun Contact',
          addYourFirstContact: 'Ajouter votre premier contact',
          contactsFound: 'contacts trouvés',
          contactFound: 'contact trouvé',
          searchingServices: 'recherche de services',
          typeNameToFind: 'Tapez un nom à trouver',
          home: 'Accueil',
          menu: 'Menu',
          developedBy: 'Développé par',
          close: 'Fermer',
          noContactsToExport: 'Aucun contact à exporter',
          contactsExported: 'contacts exportés',
          importFailed: 'Échec de l\'importation',
          invalidFileFormat: 'Format de fichier invalide',
          exportError: "Échec de l'exportation. Veuillez réessayer.",
          save: "Enregistrer",
          modifyTranslations: "Modifier les Traductions",
          changeLanguage: "Changer de Langue",
        },
      },
      ar: {
        translation: {
          appName: 'Piston',
          newContact: 'جهة اتصال جديدة',
          searchContacts: 'البحث عن جهات الاتصال',
          exportContacts: 'تصدير جهات الاتصال',
          importContacts: 'استيراد جهات الاتصال',
          about: 'حول',
          searchByServiceOrTag: 'البحث عن طريق الخدمة أو العلامة',
          noContactsFound: 'لم يتم العثور على جهات اتصال',
          noContactsWithService: 'لم يتم العثور على جهات اتصال بهذه الخدمة',
          wereFound: 'تم العثور عليها',
          addContact: 'إضافة جهة اتصال',
          searchForService: 'البحث عن خدمة',
          typeServiceOrTag: 'اكتب خدمة أو علامة للبحث عن جهات الاتصال.',
          noContacts: 'لا توجد جهات اتصال',
          addYourFirstContact: 'أضف جهة الاتصال الأولى الخاصة بك',
          contactsFound: 'جهات الاتصال التي تم العثور عليها',
          contactFound: 'جهة الاتصال التي تم العثور عليها',
          searchingServices: 'البحث عن الخدمات',
          typeNameToFind: 'اكتب اسما للعثور عليه',
          home: 'الرئيسية',
          menu: 'القائمة',
          developedBy: 'تم التطوير بواسطة',
          close: 'إغلاق',
          noContactsToExport: 'لا توجد جهات اتصال للتصدير',
          contactsExported: 'جهات الاتصال المصدرة',
          importFailed: 'فشل الاستيراد',
          invalidFileFormat: 'تنسيق ملف غير صالح',
          exportError: "فشلت عملية التصدير. حاول مرة اخرى.",
        },
      },
      es: {
        translation: {
          appName: 'Piston',
          newContact: 'Nuevo Contacto',
          searchContacts: 'Buscar Contactos',
          exportContacts: 'Exportar Contactos',
          importContacts: 'Importar Contactos',
          about: 'Acerca de',
          searchByServiceOrTag: 'Buscar por servicio o etiqueta',
          noContactsFound: 'No se encontraron contactos',
          noContactsWithService: 'No se encontraron contactos con el servicio',
          wereFound: 'fueron encontrados',
          addContact: 'Añadir Contacto',
          searchForService: 'Buscar un servicio',
          typeServiceOrTag: 'Escribe un servicio o etiqueta para buscar contactos.',
          noContacts: 'Sin contactos',
          addYourFirstContact: 'Añade tu primer contacto',
          contactsFound: 'contactos encontrados',
          contactFound: 'contacto encontrado',
          searchingServices: 'buscando servicios',
          typeNameToFind: 'Escribe un nombre para encontrar',
          home: 'Inicio',
          menu: 'Menú',
          developedBy: 'Desarrollado por',
          close: 'Cerrar',
          noContactsToExport: 'No hay contactos para exportar',
          contactsExported: 'contactos exportados',
          importFailed: 'Importación fallida',
          invalidFileFormat: 'Formato de archivo inválido',
          exportError: "Error en la exportación. Inténtalo de nuevo.",
        },
      },
    };

    i18next
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        debug: false,
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
        resources: resources,
      });

    setTranslations({
      en: resources.en.translation,
      fr: resources.fr.translation,
      ar: resources.ar.translation,
      es: resources.es.translation,
    });

    i18next.on('languageChanged', (lng) => {
      setLanguage(lng);
      document.documentElement.setAttribute('lang', lng);
    });

    setLanguage(i18next.language);
    document.documentElement.setAttribute('lang', i18next.language);

    return () => {
      i18next.off('languageChanged');
    };
  }, []);

  const changeLanguage = (lang: string) => {
    i18next.changeLanguage(lang);
  };

  const updateTranslations = (newTranslations: TranslationsType) => {
    setTranslations(newTranslations);
    
    Object.keys(newTranslations).forEach(lang => {
      i18next.addResourceBundle(lang, 'translation', newTranslations[lang], true, true);
    });
    
    if (language) {
      i18next.changeLanguage(language);
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      t: i18next.t, 
      setLanguage: changeLanguage,
      translations,
      updateTranslations
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
