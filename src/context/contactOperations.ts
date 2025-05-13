
import { Contact, Tag } from "../types";
import { generateId } from "@/utils/idGenerator";
import { toast } from "sonner";

export const createContactOperations = (
  contacts: Contact[],
  tags: Tag[],
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>,
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>
) => {
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

  return {
    addContact,
    updateContact,
    deleteContact,
    addTagToContact,
    removeTagFromContact
  };
};
