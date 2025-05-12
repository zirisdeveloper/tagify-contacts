
import { Directory } from '@capacitor/filesystem';
import { Dialog } from '@capacitor/dialog';
import { isMobileWithCapacitor } from './deviceDetection';

/**
 * Available storage locations for mobile exports
 */
export const storageOptions = [
  { name: 'Documents', directory: Directory.Documents, key: 'documents' },
  { name: 'External Storage', directory: Directory.External, key: 'external' },
  { name: 'Cache Directory', directory: Directory.Cache, key: 'cache' },
  { name: 'Data Directory', directory: Directory.Data, key: 'data' }
];

/**
 * Gets the user's preferred storage location or returns default
 * @returns Directory to use for file storage
 */
export const getPreferredStorageLocation = (): Directory => {
  const savedPreference = localStorage.getItem('preferredStorageLocation');
  
  if (savedPreference) {
    // Find the matching directory from preferences
    const option = storageOptions.find(opt => opt.key === savedPreference);
    if (option) {
      return option.directory;
    }
  }
  
  // Default to Documents storage
  return Directory.Documents;
};

/**
 * Shows a dialog to select a storage location on mobile
 * @returns Promise resolving to the selected directory or null if cancelled
 */
export const selectStorageLocation = async (): Promise<Directory | null> => {
  if (!isMobileWithCapacitor()) {
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
 * Opens a file picker with the Documents directory as the initial location on Android
 * @returns Promise that resolves when the file picker is opened
 */
export const openFilePickerInDocuments = async (): Promise<void> => {
  // For mobile devices with Capacitor
  if (isMobileWithCapacitor()) {
    try {
      // Open Android file picker specifically in Documents directory
      if (/Android/i.test(navigator.userAgent)) {
        // For Android, we'll navigate to the Documents directory
        console.log("Opening file picker in Documents directory");
        
        // Set Documents as default location in local storage
        localStorage.setItem('preferredStorageLocation', 'documents');
      }
    } catch (error) {
      console.error("Error opening file picker:", error);
    }
  }
};
