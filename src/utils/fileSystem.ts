
import { toast } from "sonner";

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
    const blob = new Blob([jsonString], { type: "application/json" });
    
    // Check if the File System Access API is available (modern browsers)
    if ('showSaveFilePicker' in window) {
      try {
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'JSON File',
            accept: { 'application/json': ['.json'] },
          }],
        });
        
        const writableStream = await fileHandle.createWritable();
        await writableStream.write(blob);
        await writableStream.close();
        
        toast.success(successMessage);
        return;
      } catch (err) {
        // User canceled the save dialog or browser doesn't properly support the API
        if ((err as Error)?.name !== 'AbortError') {
          console.error('File system error:', err);
          // Fall back to traditional download
        }
      }
    }
    
    // Fallback method for browsers without File System Access API
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success(successMessage);
  } catch (error) {
    console.error('Export error:', error);
    toast.error(errorMessage);
  }
};
