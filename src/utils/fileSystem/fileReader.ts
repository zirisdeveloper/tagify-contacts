
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { isMobileWithCapacitor } from './deviceDetection';
import { storageOptions } from './storageLocations';

/**
 * Reads file content from a path on a mobile device
 * This function can be used to read files from any location
 * @param path Path to the file
 * @param directory Directory where the file is located
 * @returns Promise resolving to the file content
 */
export const readFileFromStorage = async (
  path: string,
  directory: Directory = Directory.Documents
): Promise<string> => {
  console.log(`Attempting to read file: ${path} from directory: ${directory}`);
  
  if (isMobileWithCapacitor()) {
    try {
      // First, check if the file exists
      const fileInfo = await Filesystem.stat({
        path,
        directory
      });
      
      console.log('File exists:', fileInfo);
      
      // Read the file if it exists
      const result = await Filesystem.readFile({
        path,
        directory,
        encoding: Encoding.UTF8
      });
      
      console.log('File read result:', result);
      return result.data as string;
    } catch (err) {
      console.error('Error reading file with Capacitor:', err);
      throw new Error(`Failed to read file: ${err}`);
    }
  }
  
  throw new Error('File reading is only supported on mobile devices');
};

/**
 * Attempts to read a file from multiple possible storage directories
 * Useful when you don't know which directory the file is in
 * @param filename The filename to read
 * @returns Promise resolving to the file content if found
 */
export const readFileFromAllStorageLocations = async (filename: string): Promise<string> => {
  if (isMobileWithCapacitor()) {
    const errors: Error[] = [];
    
    // Try each directory in sequence
    for (const option of storageOptions) {
      try {
        console.log(`Trying to read ${filename} from ${option.name}`);
        const content = await readFileFromStorage(filename, option.directory);
        console.log(`Successfully read file from ${option.name}`);
        return content;
      } catch (err) {
        console.log(`Failed to read from ${option.name}:`, err);
        errors.push(err as Error);
      }
    }
    
    // If we get here, all attempts failed
    console.error('All read attempts failed:', errors);
    throw new Error(`Failed to read file from any location`);
  }
  
  throw new Error('File reading is only supported on mobile devices');
};
