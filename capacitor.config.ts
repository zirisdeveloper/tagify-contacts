
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
    useLegacyStorage: true
  }
};

export default config;
