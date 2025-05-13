
import { Contact, Tag } from "../types";
import { removeAccents } from "@/utils/contactUtils";

export const createContactQueries = (contacts: Contact[], tags: Tag[]) => {
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

  const findContactByName = (name: string, familyName?: string): Contact | undefined => {
    if (!name) return undefined;
    
    return contacts.find(contact => 
      contact.name.toLowerCase() === name.toLowerCase() && 
      (!familyName || !contact.familyName || contact.familyName.toLowerCase() === familyName.toLowerCase())
    );
  };

  const findContactByPhone = (phoneNumber: string): Contact | undefined => {
    if (!phoneNumber) return undefined;
    
    return contacts.find(contact => 
      (contact.phoneNumber && contact.phoneNumber === phoneNumber) || 
      (contact.phoneNumber2 && contact.phoneNumber2 === phoneNumber)
    );
  };

  return {
    findContactsByTag,
    getAllTags,
    findContactByName,
    findContactByPhone
  };
};
