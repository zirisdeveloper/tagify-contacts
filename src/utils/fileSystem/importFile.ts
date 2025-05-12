
import { Contact } from "@/types";
import { toast } from "sonner";

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

  // Using AlertDialog from shadcn/ui
  const DialogComponent = () => {
    // Create a React root and render the dialog
    const createRoot = require('react-dom/client').createRoot;
    const root = createRoot(dialogRoot);

    const AlertDialog = require('@/components/ui/alert-dialog').AlertDialog;
    const AlertDialogContent = require('@/components/ui/alert-dialog').AlertDialogContent;
    const AlertDialogHeader = require('@/components/ui/alert-dialog').AlertDialogHeader;
    const AlertDialogTitle = require('@/components/ui/alert-dialog').AlertDialogTitle;
    const AlertDialogDescription = require('@/components/ui/alert-dialog').AlertDialogDescription;
    const AlertDialogFooter = require('@/components/ui/alert-dialog').AlertDialogFooter;
    const AlertDialogCancel = require('@/components/ui/alert-dialog').AlertDialogCancel;
    const AlertDialogAction = require('@/components/ui/alert-dialog').AlertDialogAction;
    const React = require('react');

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

  // Initialize the dialog
  DialogComponent();
};
