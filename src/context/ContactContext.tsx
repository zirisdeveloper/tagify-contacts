
import React, { createContext, useContext, useState, useEffect } from "react";
import { Contact, Tag } from "../types";
import { toast } from "sonner";
import { generateId } from "@/utils/idGenerator";

// Helper function to remove accents from a string
const removeAccents = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

interface ContactContextType {
  contacts: Contact[];
  tags: Tag[];
  addContact: (contact: Omit<Contact, "id">) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addTagToContact: (contactId: string, tag: Omit<Tag, "id">) => void;
  removeTagFromContact: (contactId: string, tagId: string) => void;
  findContactsByTag: (tagName: string) => Contact[];
  getAllTags: () => Tag[];
  findContactByName: (name: string, familyName?: string) => Contact | undefined;
  findContactByPhone: (phoneNumber: string) => Contact | undefined;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

const localStorageKey = "tagify-contacts";

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem(localStorageKey);
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

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify({ contacts, tags }));
  }, [contacts, tags]);

  const addContact = (contact: Omit<Contact, "id">) => {
    const newContact = {
      ...contact,
      id: generateId(),
    };
    
    setContacts((prev) => [...prev, newContact]);
    
    const newTags = contact.tags.filter(
      (tag) => !tags.some((t) => t.name.toLowerCase() === tag.name.toLowerCase())
    );
    
    if (newTags.length > 0) {
      setTags((prev) => [...prev, ...newTags]);
    }
    
    toast.success("Contact added successfully");
  };

  const updateContact = (id: string, updatedFields: Partial<Contact>) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, ...updatedFields } : contact
      )
    );

    if (updatedFields.tags) {
      const allContactTags = contacts.flatMap((contact) => contact.tags);
      const uniqueTags = Array.from(
        new Set([...allContactTags, ...updatedFields.tags].map((tag) => tag.name))
      ).map((name) => {
        const existingTag = tags.find((t) => t.name === name);
        return existingTag || { id: generateId(), name };
      });
      
      setTags(uniqueTags);
    }
    
    toast.success("Contact updated successfully");
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
    toast.success("Contact deleted successfully");
  };

  const addTagToContact = (contactId: string, tag: Omit<Tag, "id">) => {
    let tagToAdd = tags.find((t) => t.name.toLowerCase() === tag.name.toLowerCase());
    
    if (!tagToAdd) {
      tagToAdd = { id: generateId(), name: tag.name };
      setTags((prev) => [...prev, tagToAdd as Tag]);
    }
    
    setContacts((prev) =>
      prev.map((contact) => {
        if (contact.id === contactId) {
          const hasTag = contact.tags.some(
            (t) => t.name.toLowerCase() === tagToAdd!.name.toLowerCase()
          );
          
          if (!hasTag) {
            return {
              ...contact,
              tags: [...contact.tags, tagToAdd as Tag],
            };
          }
        }
        return contact;
      })
    );
  };

  const removeTagFromContact = (contactId: string, tagId: string) => {
    setContacts((prev) =>
      prev.map((contact) => {
        if (contact.id === contactId) {
          return {
            ...contact,
            tags: contact.tags.filter((tag) => tag.id !== tagId),
          };
        }
        return contact;
      })
    );
  };

  const findContactsByTag = (tagName: string): Contact[] => {
    if (!tagName.trim()) return [];
    
    const normalizedTagName = removeAccents(tagName.toLowerCase());
    
    return contacts.filter((contact) =>
      contact.tags.some((tag) => {
        const normalizedTag = removeAccents(tag.name.toLowerCase());
        return normalizedTag.includes(normalizedTagName);
      })
    );
  };
  
  const getAllTags = (): Tag[] => {
    return [...tags];
  };

  // New function to find a contact by name and family name
  const findContactByName = (name: string, familyName?: string): Contact | undefined => {
    if (!name) return undefined;
    
    return contacts.find(contact => 
      contact.name.toLowerCase() === name.toLowerCase() && 
      (!familyName || !contact.familyName || contact.familyName.toLowerCase() === familyName.toLowerCase())
    );
  };

  // New function to find a contact by phone number (primary or secondary)
  const findContactByPhone = (phoneNumber: string): Contact | undefined => {
    if (!phoneNumber) return undefined;
    
    return contacts.find(contact => 
      (contact.phoneNumber && contact.phoneNumber === phoneNumber) || 
      (contact.phoneNumber2 && contact.phoneNumber2 === phoneNumber)
    );
  };

  return (
    <ContactContext.Provider
      value={{
        contacts,
        tags,
        addContact,
        updateContact,
        deleteContact,
        addTagToContact,
        removeTagFromContact,
        findContactsByTag,
        getAllTags,
        findContactByName,
        findContactByPhone,
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
