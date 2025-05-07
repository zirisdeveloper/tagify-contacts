
import { toast } from "sonner";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { isMobileWithCapacitor, isMobileDevice } from './deviceDetection';
import { getPreferredStorageLocation, storageOptions } from './storageLocations';

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
    if (isMobileWithCapacitor()) {
      try {
        // Get the preferred storage location without asking
        const preferredDirectory = getPreferredStorageLocation();
        
        // Use Capacitor's Filesystem API for mobile devices
        const result = await Filesystem.writeFile({
          path: filename,
          data: jsonString,
          directory: preferredDirectory,
          encoding: Encoding.UTF8,
          recursive: true,
        });
        
        // Find the directory name for the success message
        const directoryOption = storageOptions.find(opt => opt.directory === preferredDirectory);
        const locationMessage = directoryOption ? ` to ${directoryOption.name}` : '';

        console.log('File written successfully with Capacitor:', result);
        toast.success(`${successMessage}${locationMessage}`);
        return;
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
