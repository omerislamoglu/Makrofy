import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.omerislamoglu.makrofy',
  appName: 'Makrofy',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#000000',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000',
      overlaysWebView: true,
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true,
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#ffffff',
      sound: 'beep.wav',
    },
    Camera: {
      permissions: {
        camera: 'Makrofy, yemeklerinizin fotoğrafını çekerek besin değerlerini analiz eder.',
        photos: 'Makrofy, galeri fotoğraflarınızı besin analizi için kullanır.',
      },
    },
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['apple.com', 'google.com'],
    },
  },
  ios: {
    contentInset: 'never',
    backgroundColor: '#000000',
    preferredContentMode: 'mobile',
    scrollEnabled: true,
    limitsNavigationsToAppBoundDomains: false,
  },
}

export default config
