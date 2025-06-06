
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
    allowMixedContent: true
  },
  permissions: {
    READ_EXTERNAL_STORAGE: true,
    WRITE_EXTERNAL_STORAGE: true,
    MANAGE_EXTERNAL_STORAGE: true,
    READ_MEDIA_IMAGES: true,
    READ_MEDIA_VIDEO: true, 
    READ_MEDIA_AUDIO: true
  },
  server: {
    cleartext: true,
    androidScheme: "https"
  }
};

export default config;
