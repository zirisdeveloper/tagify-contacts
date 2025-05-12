
import { Contact } from "@/types";
import { toast } from "sonner";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { findDuplicateContacts, handleDuplicateContacts } from "@/utils/fileSystem/importFile";

/**
 * Processes imported contact data and handles duplicates
 */
export const processImportedContacts = (
  importedData: any,
  addContact: (contact: Omit<Contact, "id">) => void,
  updateContact: (id: string, contact: Partial<Contact>) => void,
  findContactByName: (name: string, familyName?: string) => Contact | undefined,
  findContactByPhone: (phoneNumber: string) => Contact | undefined,
  fileInputRef: React.RefObject<HTMLInputElement>,
  t: (key: string) => string
): void => {
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
        // User chose to overwrite duplicates
        dupsToOverwrite.forEach(({ contact, existingContact }) => {
          // Add new tags that don't exist yet
          const newTags = contact.tags.filter(newTag => 
            !existingContact.tags.some(existingTag => 
              existingTag.name.toLowerCase() === newTag.name.toLowerCase()
            )
          );
          
          // Update the existing contact with new tags
          updateContact(existingContact.id, {
            tags: [...existingContact.tags, ...newTags]
          });
        });
        
        // Add all non-duplicate contacts
        uniqueContacts.forEach(contact => {
          try {
            addContact(contact);
          } catch (error) {
            console.error("Error importing contact:", error);
          }
        });

        // Show success message
        toast.success(`${uniqueContacts.length} ${t("contactsImported")}${duplicates.length > 0 ? `, ${duplicates.length} ${t("contactsOverwritten") || "contacts overwritten"}` : ''}`);
        
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
};

/**
 * Handles Web File API importing
 */
export const handleWebFileImport = async (
  file: File,
  addContact: (contact: Omit<Contact, "id">) => void,
  updateContact: (id: string, contact: Partial<Contact>) => void,
  findContactByName: (name: string, familyName?: string) => Contact | undefined,
  findContactByPhone: (phoneNumber: string) => Contact | undefined,
  fileInputRef: React.RefObject<HTMLInputElement>,
  t: (key: string) => string
): Promise<void> => {
  // Create a URL for the selected file
  const fileURL = URL.createObjectURL(file);
  console.log("Created URL for file:", fileURL);
  
  try {
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
        processImportedContacts(
          importedData, 
          addContact, 
          updateContact, 
          findContactByName, 
          findContactByPhone,
          fileInputRef,
          t
        );
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
  } catch (error) {
    console.error("Web file import error:", error);
    toast.error(`${t("importFailed")}: ${error instanceof Error ? error.message : t("unknownError")}`);
    URL.revokeObjectURL(fileURL);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
};

/**
 * Handles Capacitor (mobile) File API importing
 */
export const handleCapacitorFileImport = async (
  file: File,
  addContact: (contact: Omit<Contact, "id">) => void,
  updateContact: (id: string, contact: Partial<Contact>) => void,
  findContactByName: (name: string, familyName?: string) => Contact | undefined,
  findContactByPhone: (phoneNumber: string) => Contact | undefined,
  fileInputRef: React.RefObject<HTMLInputElement>,
  t: (key: string) => string
): Promise<void> => {
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
        processImportedContacts(
          importedData, 
          addContact, 
          updateContact, 
          findContactByName, 
          findContactByPhone,
          fileInputRef,
          t
        );

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
};
