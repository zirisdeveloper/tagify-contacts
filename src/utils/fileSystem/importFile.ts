
import { Contact } from "@/types";
import { toast } from "sonner";
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

// Function to check for duplicate contacts
export const findDuplicateContacts = (
  newContacts: Omit<Contact, "id">[],
  findContactByName: (name: string, familyName?: string) => Contact | undefined,
  findContactByPhone: (phoneNumber: string) => Contact | undefined
): { contact: Omit<Contact, "id">, existingContact: Contact }[] => {
  const duplicates: { contact: Omit<Contact, "id">, existingContact: Contact }[] = [];

  newContacts.forEach(contact => {
    // Check for duplicate by name
    const nameMatch = findContactByName(contact.name, contact.familyName);
    if (nameMatch) {
      duplicates.push({ contact, existingContact: nameMatch });
      return;
    }

    // Check for duplicate by phone number (primary or secondary)
    if (contact.phoneNumber) {
      const phoneMatch = findContactByPhone(contact.phoneNumber);
      if (phoneMatch) {
        duplicates.push({ contact, existingContact: phoneMatch });
        return;
      }
    }

    // Check secondary phone if it exists
    if (contact.phoneNumber2) {
      const phone2Match = findContactByPhone(contact.phoneNumber2);
      if (phone2Match) {
        duplicates.push({ contact, existingContact: phone2Match });
        return;
      }
    }
  });

  return duplicates;
};

// Function to handle duplicate contact resolution with dialog
export const handleDuplicateContacts = (
  duplicates: { contact: Omit<Contact, "id">, existingContact: Contact }[],
  onOverwrite: (duplicates: { contact: Omit<Contact, "id">, existingContact: Contact }[]) => void,
  onSkip: () => void,
  t: (key: string) => string
) => {
  // Create and render a dialog element
  const dialogRoot = document.createElement('div');
  dialogRoot.id = 'duplicate-dialog-root';
  document.body.appendChild(dialogRoot);

  const cleanupDialog = () => {
    // Remove the dialog from DOM when finished
    if (dialogRoot && dialogRoot.parentNode) {
      dialogRoot.parentNode.removeChild(dialogRoot);
    }
  };

  // Create a React root and render the dialog
  const root = ReactDOM.createRoot(dialogRoot);
  
  // Render the AlertDialog component directly without requiring it
  root.render(
    React.createElement(AlertDialog, { defaultOpen: true, onOpenChange: (open) => {
      if (!open) {
        onSkip();
        cleanupDialog();
      }
    }}, 
    React.createElement(AlertDialogContent, {}, 
      React.createElement(AlertDialogHeader, {}, 
        React.createElement(AlertDialogTitle, {}, 
          t("duplicateContactsFound") || "Duplicate Contacts Found"
        ),
        React.createElement(AlertDialogDescription, {}, 
          duplicates.length === 1 
            ? t("singleDuplicateContactMessage") || "A contact with the same name or phone number already exists."
            : `${duplicates.length} ${t("multipleDuplicateContactsMessage") || "contacts with the same name or phone number already exist."}`,
          " ",
          t("whatWouldYouLikeToDo") || "What would you like to do?"
        )
      ),
      React.createElement(AlertDialogFooter, {}, 
        React.createElement(AlertDialogCancel, { 
          onClick: () => {
            onSkip();
            cleanupDialog();
          }
        }, 
        t("skipDuplicates") || "Skip Duplicates"
        ),
        React.createElement(AlertDialogAction, { 
          onClick: () => {
            onOverwrite(duplicates);
            cleanupDialog();
          }
        }, 
        t("overwriteContacts") || "Overwrite Contacts"
        )
      )
    ))
  );
};
