import { CapacitorConfig } from '@capacitor/cli';
import { Camera } from '@capacitor/camera';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Acua Report',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins:{
    Camera:{
      saveToGallery: true,
    }
  }
};

export default config;
