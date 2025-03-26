
import React, { createContext, useContext, useState, useEffect } from "react";
import { Contact, Tag } from "../types";
import { toast } from "sonner";

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
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

const localStorageKey = "tagify-contacts";

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // Load data from localStorage on mount
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

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify({ contacts, tags }));
  }, [contacts, tags]);

  const addContact = (contact: Omit<Contact, "id">) => {
    const newContact = {
      ...contact,
      id: crypto.randomUUID(),
    };
    
    setContacts((prev) => [...prev, newContact]);
    
    // Add any new tags to the global tag list
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

    // Update global tag list if needed
    if (updatedFields.tags) {
      const allContactTags = contacts.flatMap((contact) => contact.tags);
      const uniqueTags = Array.from(
        new Set([...allContactTags, ...updatedFields.tags].map((tag) => tag.name))
      ).map((name) => {
        const existingTag = tags.find((t) => t.name === name);
        return existingTag || { id: crypto.randomUUID(), name };
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
    // Check if tag already exists in global tags
    let tagToAdd = tags.find((t) => t.name.toLowerCase() === tag.name.toLowerCase());
    
    // If not, create a new tag
    if (!tagToAdd) {
      tagToAdd = { id: crypto.randomUUID(), name: tag.name };
      setTags((prev) => [...prev, tagToAdd as Tag]);
    }
    
    // Add tag to contact if it doesn't already have it
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
    
    return contacts.filter((contact) =>
      contact.tags.some((tag) => 
        tag.name.toLowerCase().includes(tagName.toLowerCase())
      )
    );
  };
  
  const getAllTags = (): Tag[] => {
    return [...tags];
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
