
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
    
    // Header & Navigation
    contacts: "Contacts",
    addContact: "Add Contact",
    searchContacts: "Search Contacts",
    searchContactsByName: "Search contacts by name...",
    
    // Home Page
    myContacts: "My Contacts",
    recentContacts: "Recent Contacts",
    noContacts: "No contacts found",
    addYourFirstContact: "Add your first contact",
    searchByServiceOrTag: "Search by service or tag...",
    services: "Services",
    
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
    
    // Header & Navigation
    contacts: "Contacts",
    addContact: "Ajouter un contact",
    searchContacts: "Rechercher des contacts",
    searchContactsByName: "Rechercher des contacts par nom...",
    
    // Home Page
    myContacts: "Mes Contacts",
    recentContacts: "Contacts Récents",
    noContacts: "Aucun contact trouvé",
    addYourFirstContact: "Ajouter votre premier contact",
    searchByServiceOrTag: "Rechercher par service ou tag...",
    services: "Services",
    
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
    wereFound: "ont été trouvés",
    searchForContact: "Rechercher un contact",
    typeContactName: "Tapez un nom de contact pour trouver des correspondances",
    
    // Not Found Page
    pageNotFound: "Page non trouvée",
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

  // Function to update language and save to localStorage
  const changeLanguage = (newLanguage: Language) => {
    try {
      localStorage.setItem('language', newLanguage);
      setLanguage(newLanguage);
      // Force a re-render by updating the state
      console.log(`Language changed to: ${newLanguage}`);
    } catch (error) {
      console.error("Error saving language to localStorage:", error);
    }
  };

  // Save language to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('language', language);
      console.log(`Language saved to localStorage: ${language}`);
    } catch (error) {
      console.error("Error saving language to localStorage:", error);
    }
  }, [language]);

  const updateTranslations = (newTranslations: typeof defaultTranslations) => {
    try {
      setTranslations(newTranslations);
      localStorage.setItem('translations', JSON.stringify(newTranslations));
    } catch (error) {
      console.error("Error saving translations to localStorage:", error);
    }
  };

  const t = (key: TranslationKey): string => {
    if (!translations[language] || !translations[language][key]) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      // Fallback to English if translation is missing
      return translations.en[key] || key;
    }
    return translations[language][key];
  };

  // Create a new context value on each render to ensure subscribers get notified
  const contextValue = {
    language,
    setLanguage: changeLanguage, // Use the new function that ensures proper state updates
    t,
    translations,
    updateTranslations
  };

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
