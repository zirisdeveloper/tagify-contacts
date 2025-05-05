
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zirisdeveloper.piston',
  appName: 'Piston',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
    Filesystem: {
      androidPermissions: true
    }
  },
  android: {
    useLegacyStorage: true,
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    backgroundColor: "#ffffff",
    // Set the initial directory for file pickers
    initialDir: "DEFAULT_DIRECTORY"
  },
  permissions: {
    // Request all needed permissions
    READ_EXTERNAL_STORAGE: true,
    WRITE_EXTERNAL_STORAGE: true,
    MANAGE_EXTERNAL_STORAGE: true,
    READ_MEDIA_IMAGES: true,
    READ_MEDIA_VIDEO: true, 
    READ_MEDIA_AUDIO: true
  }
};

export default config;
