
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1b4623686e0d4997adf7a98686ac342c',
  appName: 'dell-parking-runner-interface',
  webDir: 'dist',
  server: {
    url: 'https://1b462368-6e0d-4997-adf7-a98686ac342c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
      releaseType: undefined
    }
  }
};

export default config;
