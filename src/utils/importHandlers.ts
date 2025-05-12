
import { Contact } from "@/types";
import { toast } from "sonner";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { openFilePickerInDocuments } from "@/utils/fileSystem";
import { Dialog } from "@radix-ui/react-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import React, { useState } from "react";

// Function to handle duplicate contact resolution
const handleDuplicateContacts = (
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

    root.render(
      <AlertDialog defaultOpen={true} onOpenChange={(open) => {
        if (!open) {
          onSkip();
          cleanupDialog();
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("duplicateContactsFound") || "Duplicate Contacts Found"}</AlertDialogTitle>
            <AlertDialogDescription>
              {duplicates.length === 1 
                ? t("singleDuplicateContactMessage") || `A contact with the same name or phone number already exists.`
                : `${duplicates.length} ${t("multipleDuplicateContactsMessage") || `contacts with the same name or phone number already exist.`}`
              }
              {t("whatWouldYouLikeToDo") || "What would you like to do?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              onSkip();
              cleanupDialog();
            }}>
              {t("skipDuplicates") || "Skip Duplicates"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              onOverwrite(duplicates);
              cleanupDialog();
            }}>
              {t("mergeTags") || "Merge Tags"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  // Initialize the dialog
  DialogComponent();
};

// Function to check for duplicate contacts
const findDuplicateContacts = (
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

export const handleFileChange = async (
  event: React.ChangeEvent<HTMLInputElement>,
  fileInputRef: React.RefObject<HTMLInputElement>,
  addContact: (contact: Omit<Contact, "id">) => void,
  updateContact: (id: string, contact: Partial<Contact>) => void,
  findContactByName: (name: string, familyName?: string) => Contact | undefined,
  findContactByPhone: (phoneNumber: string) => Contact | undefined,
  t: (key: string) => string
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  console.log("Selected file:", file.name, "Type:", file.type, "Size:", file.size);
  
  // First try with Web File API
  try {
    // Create a URL for the selected file
    const fileURL = URL.createObjectURL(file);
    console.log("Created URL for file:", fileURL);
    
    // Read the file content
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (!content || typeof content !== 'string') {
          throw new Error("Failed to read file content");
        }
        
        console.log("File content length:", content.length);
        
        // Try to parse as JSON regardless of extension
        const importedData = JSON.parse(content);

        if (
          !importedData ||
          !importedData.contacts ||
          !Array.isArray(importedData.contacts)
        ) {
          throw new Error("Invalid file format");
        }

        console.log("Found contacts array with", importedData.contacts.length, "items");

        const validContacts = importedData.contacts.filter(
          (contact: any) =>
            contact &&
            typeof contact.name === "string" &&
            Array.isArray(contact.tags)
        );

        if (validContacts.length === 0) {
          throw new Error("No valid contacts found in the file");
        }

        // Check for duplicate contacts
        const duplicates = findDuplicateContacts(validContacts, findContactByName, findContactByPhone);
        
        // Determine which contacts are unique (not duplicates)
        const uniqueContacts = validContacts.filter(contact => 
          !duplicates.some(dup => 
            (dup.contact.name === contact.name && dup.contact.familyName === contact.familyName) ||
            (contact.phoneNumber && dup.contact.phoneNumber === contact.phoneNumber) || 
            (contact.phoneNumber2 && dup.contact.phoneNumber2 === contact.phoneNumber2)
          )
        );

        // Handle import based on whether duplicates were found
        if (duplicates.length > 0) {
          // Show confirmation dialog for duplicates
          handleDuplicateContacts(
            duplicates,
            (dupsToOverwrite) => {
              // User chose to merge tags for duplicates
              dupsToOverwrite.forEach(({ contact, existingContact }) => {
                // Get new tags that don't exist in the current contact
                const newTags = contact.tags.filter(newTag => 
                  !existingContact.tags.some(existingTag => 
                    existingTag.name.toLowerCase() === newTag.name.toLowerCase()
                  )
                );
                
                // Update the existing contact with merged tags if there are new tags
                if (newTags.length > 0) {
                  updateContact(existingContact.id, {
                    tags: [...existingContact.tags, ...newTags]
                  });
                }
              });
              
              // Add all non-duplicate contacts
              let importedCount = uniqueContacts.length;
              uniqueContacts.forEach(contact => {
                try {
                  addContact(contact);
                } catch (error) {
                  console.error("Error importing contact:", error);
                  importedCount--;
                }
              });

              // Show success message
              toast.success(`${importedCount} ${t("contactsImported")}${duplicates.length > 0 ? `, ${duplicates.length} ${t("contactsMerged") || "contacts merged"}` : ''}`);
              
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            },
            () => {
              // User chose to skip duplicates, only add unique contacts
              let importedCount = 0;
              uniqueContacts.forEach(contact => {
                try {
                  addContact(contact);
                  importedCount++;
                } catch (error) {
                  console.error("Error importing contact:", error);
                }
              });

              toast.success(`${importedCount} ${t("contactsImported")}${duplicates.length > 0 ? `, ${duplicates.length} ${t("contactsSkipped") || "duplicates skipped"}` : ''}`);
              
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            },
            t
          );
        } else {
          // No duplicates, proceed with normal import
          let importedCount = 0;
          validContacts.forEach((contact: Omit<Contact, "id">) => {
            try {
              addContact(contact);
              importedCount++;
            } catch (error) {
              console.error("Error importing contact:", error);
            }
          });

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          toast.success(`${importedCount} ${t("contactsImported")}`);
        }
      } catch (error) {
        console.error("Import error during parsing:", error);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        toast.error(
          `${t("importFailed")}: ${
            error instanceof Error ? error.message : t("invalidFileFormat")
          }`
        );
      } finally {
        // Clean up the object URL
        URL.revokeObjectURL(fileURL);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file with FileReader:", error);
      toast.error(t("errorReadingFile"));
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    // Start reading the file
    reader.readAsText(file);
  } catch (webError) {
    console.error("Web File API error:", webError);
    
    // Try Capacitor Filesystem API as fallback for Android
    if ('Capacitor' in window) {
      try {
        console.log("Trying Capacitor Filesystem for file:", file.name);
        
        // For Android 10+ we need a different approach
        // The file object doesn't have a direct path we can use
        // We will try to save the file first to a known location, then read from there
        
        // Step 1: Convert file to base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = async (e) => {
          try {
            if (!e.target?.result) {
              throw new Error("Failed to read file content");
            }
            
            const result = e.target.result;
            if (typeof result !== 'string') {
              throw new Error("Invalid file content format");
            }
            
            const base64Data = result.split(',')[1];
            const tempFileName = `temp_import_${Date.now()}.json`;
            
            console.log("Saving file temporarily to read it");
            
            // Step 2: Write the file to Documents directory
            await Filesystem.writeFile({
              path: tempFileName,
              data: base64Data,
              directory: Directory.Cache,
              encoding: Encoding.UTF8
            });
            
            console.log("File saved temporarily, now reading it");
            
            // Step 3: Read the file back
            const fileResult = await Filesystem.readFile({
              path: tempFileName,
              directory: Directory.Cache,
              encoding: Encoding.UTF8
            });
            
            // Step 4: Process the content
            const fileContent = fileResult.data;
            if (typeof fileContent !== 'string') {
              throw new Error("Invalid file content format");
            }
            
            console.log("File content read successfully, length:", fileContent.length);
            
            // Parse the content
            const importedData = JSON.parse(fileContent);
            
            if (!importedData || !importedData.contacts || !Array.isArray(importedData.contacts)) {
              throw new Error("Invalid file format");
            }
            
            const validContacts = importedData.contacts.filter(
              (contact: any) =>
                contact &&
                typeof contact.name === "string" &&
                Array.isArray(contact.tags)
            );
            
            if (validContacts.length === 0) {
              throw new Error("No valid contacts found in the file");
            }

            // Check for duplicate contacts
            const duplicates = findDuplicateContacts(validContacts, findContactByName, findContactByPhone);
            
            // Determine which contacts are unique (not duplicates)
            const uniqueContacts = validContacts.filter(contact => 
              !duplicates.some(dup => 
                (dup.contact.name === contact.name && dup.contact.familyName === contact.familyName) ||
                (contact.phoneNumber && dup.contact.phoneNumber === contact.phoneNumber) || 
                (contact.phoneNumber2 && dup.contact.phoneNumber2 === contact.phoneNumber2)
              )
            );

            // Handle import based on whether duplicates were found
            if (duplicates.length > 0) {
              // Show confirmation dialog for duplicates
              handleDuplicateContacts(
                duplicates,
                (dupsToOverwrite) => {
                  // User chose to merge tags for duplicates
                  dupsToOverwrite.forEach(({ contact, existingContact }) => {
                    // Get new tags that don't exist in the current contact
                    const newTags = contact.tags.filter(newTag => 
                      !existingContact.tags.some(existingTag => 
                        existingTag.name.toLowerCase() === newTag.name.toLowerCase()
                      )
                    );
                    
                    // Update the existing contact with merged tags if there are new tags
                    if (newTags.length > 0) {
                      updateContact(existingContact.id, {
                        tags: [...existingContact.tags, ...newTags]
                      });
                    }
                  });
                  
                  // Add all non-duplicate contacts
                  let importedCount = uniqueContacts.length;
                  uniqueContacts.forEach(contact => {
                    try {
                      addContact(contact);
                    } catch (error) {
                      console.error("Error importing contact:", error);
                      importedCount--;
                    }
                  });

                  // Show success message
                  toast.success(`${importedCount} ${t("contactsImported")}${duplicates.length > 0 ? `, ${duplicates.length} ${t("contactsMerged") || "contacts merged"}` : ''}`);
                  
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                },
                () => {
                  // User chose to skip duplicates, only add unique contacts
                  let importedCount = 0;
                  uniqueContacts.forEach(contact => {
                    try {
                      addContact(contact);
                      importedCount++;
                    } catch (error) {
                      console.error("Error importing contact:", error);
                    }
                  });

                  toast.success(`${importedCount} ${t("contactsImported")}${duplicates.length > 0 ? `, ${duplicates.length} ${t("contactsSkipped") || "duplicates skipped"}` : ''}`);
                  
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                },
                t
              );
            } else {
              // No duplicates, proceed with normal import
              let importedCount = 0;
              validContacts.forEach((contact: Omit<Contact, "id">) => {
                try {
                  addContact(contact);
                  importedCount++;
                } catch (error) {
                  console.error("Error importing contact:", error);
                }
              });
            }

            // Step 5: Clean up temporary file
            try {
              await Filesystem.deleteFile({
                path: tempFileName,
                directory: Directory.Cache
              });
              console.log("Temporary file deleted");
            } catch (deleteErr) {
              console.log("Failed to delete temporary file:", deleteErr);
              // Non-critical error, we can still proceed
            }
            
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            
            if (!duplicates.length) {
              toast.success(`${validContacts.length} ${t("contactsImported")}`);
            }
          } catch (processingError) {
            console.error("Error processing file:", processingError);
            toast.error(`${t("importFailed")}: ${processingError instanceof Error ? processingError.message : t("processingError")}`);
            
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        };
        
        reader.onerror = (readerError) => {
          console.error("Error reading file as base64:", readerError);
          toast.error(t("errorReadingFile"));
          
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        };
      } catch (capacitorError) {
        console.error("Capacitor Filesystem error:", capacitorError);
        toast.error(`${t("importFailed")}: ${capacitorError instanceof Error ? capacitorError.message : t("capacitorReadError")}`);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } else {
      // No Capacitor available
      toast.error(t("importFailed"));
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }
};

export const handleImportClick = async (fileInputRef: React.RefObject<HTMLInputElement>) => {
  // First, try to open the file picker in the Documents directory
  await openFilePickerInDocuments();
  
  if (fileInputRef.current) {
    // Reset the file input value before showing the picker
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  }
};
