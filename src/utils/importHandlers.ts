
import { Contact } from "@/types";
import { openFilePickerInDocuments } from "@/utils/fileSystem";
import { 
  handleWebFileImport,
  handleCapacitorFileImport
} from "@/utils/fileSystem/fileImportHelpers";

// Function to handle file import
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
    await handleWebFileImport(
      file, 
      addContact, 
      updateContact, 
      findContactByName, 
      findContactByPhone, 
      fileInputRef, 
      t
    );
  } catch (webError) {
    console.error("Web File API error:", webError);
    
    // Try Capacitor Filesystem API as fallback for Android
    if ('Capacitor' in window) {
      await handleCapacitorFileImport(
        file, 
        addContact, 
        updateContact, 
        findContactByName, 
        findContactByPhone, 
        fileInputRef, 
        t
      );
    } else {
      // No Capacitor available
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      console.error("No file handling method available");
    }
  }
};

// Function to trigger the file picker
export const handleImportClick = async (fileInputRef: React.RefObject<HTMLInputElement>) => {
  // First, try to open the file picker in the Documents directory
  await openFilePickerInDocuments();
  
  if (fileInputRef.current) {
    // Reset the file input value before showing the picker
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  }
};
