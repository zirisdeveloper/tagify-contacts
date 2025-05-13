
import React, { createContext, useContext, useState, useEffect } from "react";
import { Contact, Tag } from "../types";
import { ContactContextType, LOCAL_STORAGE_KEY } from "../types/contactTypes";
import { createContactOperations } from "./contactOperations";
import { createContactQueries } from "./contactQueries";

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const { contacts: savedContacts, tags: savedTags } = JSON.parse(savedData);
        setContacts(savedContacts || []);
        setTags(savedTags || []);
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ contacts, tags }));
  }, [contacts, tags]);

  // Create contact operations
  const operations = createContactOperations(contacts, tags, setContacts, setTags);
  
  // Create contact queries
  const queries = createContactQueries(contacts, tags);

  return (
    <ContactContext.Provider
      value={{
        contacts,
        tags,
        ...operations,
        ...queries
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error("useContacts must be used within a ContactProvider");
  }
  return context;
};
