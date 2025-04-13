
import { toast } from "sonner";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Dialog } from '@capacitor/dialog';

/**
 * Checks if the app is running on a mobile device
 * @returns boolean indicating if the app is running on mobile
 */
const isMobileDevice = (): boolean => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.matchMedia('(max-width: 767px)').matches
  );
};

/**
 * Available storage locations for mobile exports
 */
const storageOptions = [
  { name: 'Documents', directory: Directory.Documents, key: 'documents' },
  { name: 'External Storage', directory: Directory.External, key: 'external' },
  { name: 'Cache Directory', directory: Directory.Cache, key: 'cache' },
  { name: 'Data Directory', directory: Directory.Data, key: 'data' }
];

/**
 * Gets the user's preferred storage location or returns default
 * @returns Directory to use for file storage
 */
const getPreferredStorageLocation = (): Directory => {
  const savedPreference = localStorage.getItem('preferredStorageLocation');
  
  if (savedPreference) {
    // Find the matching directory from preferences
    const option = storageOptions.find(opt => opt.key === savedPreference);
    if (option) {
      return option.directory;
    }
  }
  
  // Default to Documents
  return Directory.Documents;
};

/**
 * Shows a dialog to select a storage location on mobile
 * @returns Promise resolving to the selected directory or null if cancelled
 */
const selectStorageLocation = async (): Promise<Directory | null> => {
  if (!isMobileDevice() || !('Capacitor' in window)) {
    return null;
  }
  
  try {
    // Build the options string
    const optionsText = storageOptions.map((option, index) => 
      `${index + 1}. ${option.name}`
    ).join('\n');
    
    // Get the default directory name
    const preferredDirectory = getPreferredStorageLocation();
    const defaultOption = storageOptions.find(opt => opt.directory === preferredDirectory);
    const defaultName = defaultOption ? defaultOption.name : 'Documents';
    
    const { value } = await Dialog.prompt({
      title: 'Select Storage Location',
      message: `Choose where to save your file:\n${optionsText}\n\nPress Cancel to use ${defaultName} folder.`,
      inputPlaceholder: 'Enter number (1-4)',
      okButtonTitle: 'Select',
      cancelButtonTitle: `Use ${defaultName}`
    });
    
    const selectedIndex = parseInt(value, 10);
    if (!isNaN(selectedIndex) && selectedIndex >= 1 && selectedIndex <= storageOptions.length) {
      return storageOptions[selectedIndex - 1].directory;
    }
    
    // Default to preferred location if invalid input or cancelled
    return getPreferredStorageLocation();
  } catch (error) {
    console.log('Dialog cancelled, using preferred folder', error);
    return getPreferredStorageLocation();
  }
};

/**
 * Exports JSON data to a file and allows folder selection where supported
 * @param data The data to export as JSON
 * @param filename Suggested filename 
 * @param successMessage Message to show on successful export
 * @param errorMessage Message to show on failed export
 * @returns Promise that resolves when export is complete
 */
export const exportJsonToFile = async (
  data: any,
  filename: string,
  successMessage: string,
  errorMessage: string
): Promise<void> => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    
    // Check if running on mobile with Capacitor
    if (isMobileDevice() && 'Capacitor' in window) {
      try {
        // Show location selection dialog
        const selectedDirectory = await selectStorageLocation();
        
        if (selectedDirectory) {
          // Use Capacitor's Filesystem API for mobile devices
          const result = await Filesystem.writeFile({
            path: filename,
            data: jsonString,
            directory: selectedDirectory,
            encoding: Encoding.UTF8,
            recursive: true,
          });
          
          let locationMessage = '';
          const dirOption = storageOptions.find(opt => opt.directory === selectedDirectory);
          if (dirOption) {
            locationMessage = ` to ${dirOption.name}`;
          }

          console.log('File written successfully with Capacitor:', result);
          toast.success(`${successMessage}${locationMessage}`);
          return;
        }
      } catch (err) {
        console.error('Capacitor filesystem error:', err);
        // Fall back to browser methods if Capacitor fails
      }
    }
    
    // For desktop browsers or as fallback for mobile
    const blob = new Blob([jsonString], { type: "application/json" });
    
    // Check if the File System Access API is available (modern browsers)
    if ('showSaveFilePicker' in window) {
      try {
        // Try to set default directory to Downloads folder 
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'JSON File',
            accept: { 'application/json': ['.json'] },
          }],
          // This opens the file dialog so user can navigate to any folder they want
        });
        
        // Once user selects a location, write the file there
        const writableStream = await fileHandle.createWritable();
        await writableStream.write(blob);
        await writableStream.close();
        
        toast.success(successMessage);
        return;
      } catch (err) {
        console.error('File system access error:', err);
        // Only fall back if there's a real error, not if user canceled the dialog
        if ((err as Error)?.name !== 'AbortError') {
          // Fall back to traditional download
          console.log('Falling back to traditional download method');
          fallbackDownload(blob, filename, successMessage);
        } else {
          // User canceled the save dialog
          console.log('User canceled the save dialog');
        }
      }
    } else {
      // Browser doesn't support File System Access API
      console.log('File System Access API not supported, using fallback method');
      fallbackDownload(blob, filename, successMessage);
    }
  } catch (error) {
    console.error('Export error:', error);
    toast.error(errorMessage);
  }
};

/**
 * Fallback method for browsers that don't support the File System Access API
 */
const fallbackDownload = (blob: Blob, filename: string, successMessage: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 100);
  
  toast.success(successMessage);
};
