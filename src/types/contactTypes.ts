
import { Contact, Tag } from "../types";

export interface ContactContextType {
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

export const LOCAL_STORAGE_KEY = "tagify-contacts";
