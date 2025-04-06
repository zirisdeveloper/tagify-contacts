
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from "react";

// Define all the translations
export const defaultTranslations = {
  en: {
    // Common
    search: "Search",
    add: "Add",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    back: "Back",
    name: "Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    notes: "Notes",
    changeLanguage: "Change language",
    home: "Home",
    menu: "Menu",
    about: "About",
    close: "Close",
    developedBy: "Developed by",
    
    // Header & Navigation
    contacts: "Contacts",
    addContact: "Add Contact",
    searchContacts: "Search Contacts",
    searchContactsByName: "Search contacts by name...",
    exportContacts: "Export Contacts",
    importContacts: "Import Contacts",
    contactsExported: "contacts exported successfully",
    noContactsToExport: "No contacts to export",
    typeNameToFind: "Type a name to find contacts",
    
    // Home Page
    myContacts: "My Contacts",
    recentContacts: "Recent Contacts",
    noContacts: "No contacts yet",
    addYourFirstContact: "Add your first contact to get started",
    searchByServiceOrTag: "Search by service or tag...",
    services: "Services",
    searchForService: "Search for a service",
    typeServiceOrTag: "Type a service or tag name to find contacts",
    searchingServices: "(searching services/tags)",
    noContactsWithService: "No contacts with service or tag",
    
    // Contact Details
    contactDetails: "Contact Details",
    phoneNumber: "Phone Number",
    emailAddress: "Email Address",
    familyName: "Family Name",
    
    // Add/Edit Contact
    newContact: "New Contact",
    editContact: "Edit Contact",
    
    // Search Page
    searchResults: "Search Results",
    contactsFound: "contacts found for",
    contactFound: "contact found for",
    noContactsFound: "No contacts found",
    noContactsWithName: "No contacts with name",
    wereFound: "were found",
    searchForContact: "Search for a contact",
    typeContactName: "Type a contact name to find matches",
    
    // Not Found Page
    pageNotFound: "Page Not Found",
    pageNotFoundDescription: "The page you're looking for couldn't be found. It might have been removed, renamed, or it never existed.",
    returnHome: "Return Home",
    
    // Translation Editor
    modifyTranslations: "Modify Translations",
  },
  fr: {
    // Common
    search: "Rechercher",
    add: "Ajouter",
    cancel: "Annuler",
    save: "Sauvegarder",
    delete: "Supprimer",
    edit: "Modifier",
    back: "Retour",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    address: "Adresse",
    notes: "Notes",
    changeLanguage: "Changer de langue",
    home: "Accueil",
    menu: "Menu",
    about: "À propos",
    close: "Fermer",
    developedBy: "Développé par",
    
    // Header & Navigation
    contacts: "Contacts",
    addContact: "Ajouter un contact",
    searchContacts: "Rechercher des contacts",
    searchContactsByName: "Rechercher des contacts par nom...",
    exportContacts: "Exporter les contacts",
    importContacts: "Importer des contacts",
    contactsExported: "contacts exportés avec succès",
    noContactsToExport: "Aucun contact à exporter",
    typeNameToFind: "Tapez un nom pour trouver des contacts",
    
    // Home Page
    myContacts: "Mes Contacts",
    recentContacts: "Contacts Récents",
    noContacts: "Aucun contact pour le moment",
    addYourFirstContact: "Ajoutez votre premier contact pour commencer",
    searchByServiceOrTag: "Rechercher par service ou tag...",
    services: "Services",
    searchForService: "Rechercher un service",
    typeServiceOrTag: "Tapez un service ou un tag pour trouver des contacts",
    searchingServices: "(recherche par services/tags)",
    noContactsWithService: "Aucun contact avec le service ou tag",
    
    // Contact Details
    contactDetails: "Détails du contact",
    phoneNumber: "Numéro de téléphone",
    emailAddress: "Adresse email",
    familyName: "Nom de famille",
    
    // Add/Edit Contact
    newContact: "Nouveau Contact",
    editContact: "Modifier le Contact",
    
    // Search Page
    searchResults: "Résultats de recherche",
    contactsFound: "contacts trouvés pour",
    contactFound: "contact trouvé pour",
    noContactsFound: "Aucun contact trouvé",
    noContactsWithName: "Aucun contact avec le nom",
    wereFound: "trouvé",
    searchForContact: "Rechercher un contact",
    typeContactName: "Tapez un nom de contact pour trouver des correspondances",
    
    // Not Found Page
    pageNotFound: "Page non trouvée",
    pageNotFoundDescription: "La page que vous recherchez n'a pas pu être trouvée. Elle a peut-être été supprimée, renommée ou n'a jamais existé.",
    returnHome: "Retourner à l'accueil",
    
    // Translation Editor
    modifyTranslations: "Modifier les Traductions",
  }
};

type Language = "en" | "fr";
type TranslationKey = keyof typeof defaultTranslations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
  translations: typeof defaultTranslations;
  updateTranslations: (newTranslations: typeof defaultTranslations) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Load translations from localStorage or use defaults
const loadTranslations = () => {
  try {
    const storedTranslations = localStorage.getItem('translations');
    return storedTranslations ? JSON.parse(storedTranslations) : defaultTranslations;
  } catch (error) {
    console.error("Error loading translations from localStorage:", error);
    return defaultTranslations;
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize language from localStorage or default to "fr"
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const storedLanguage = localStorage.getItem('language');
      return (storedLanguage as Language) || "fr";
    } catch (error) {
      console.error("Error reading language from localStorage:", error);
      return "fr";
    }
  });
  
  const [translations, setTranslations] = useState(loadTranslations());
  // Add a state to force re-renders
  const [forceUpdate, setForceUpdate] = useState(0);

  // Function to update language and save to localStorage
  const changeLanguage = useCallback((newLanguage: Language) => {
    try {
      localStorage.setItem('language', newLanguage);
      setLanguage(newLanguage);
      // Force a re-render
      setForceUpdate(prev => prev + 1);
      console.log(`Language changed to: ${newLanguage}`);
    } catch (error) {
      console.error("Error saving language to localStorage:", error);
    }
  }, []);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('language', language);
      console.log(`Language saved to localStorage: ${language}`);
    } catch (error) {
      console.error("Error saving language to localStorage:", error);
    }
  }, [language]);

  const updateTranslations = useCallback((newTranslations: typeof defaultTranslations) => {
    try {
      setTranslations(newTranslations);
      localStorage.setItem('translations', JSON.stringify(newTranslations));
      // Force a re-render
      setForceUpdate(prev => prev + 1);
    } catch (error) {
      console.error("Error saving translations to localStorage:", error);
    }
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    if (!translations[language] || !translations[language][key]) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      // Fallback to English if translation is missing
      return translations.en[key] || key;
    }
    return translations[language][key];
  }, [language, translations]);

  // Use useMemo to create a stable context value
  const contextValue = useMemo(() => ({
    language,
    setLanguage: changeLanguage,
    t,
    translations,
    updateTranslations
  }), [language, changeLanguage, t, translations, updateTranslations, forceUpdate]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
