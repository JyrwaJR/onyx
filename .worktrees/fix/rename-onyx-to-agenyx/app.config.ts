import { ExpoConfig, ConfigContext } from 'expo/config';

const getIdentifier = (): string => {
  switch (process.env.APP_VARIANT) {
    case 'development':
      return 'com.jyrwajr.agenyx.dev';
    case 'production':
      return 'com.jyrwajr.agenyx';
    case 'preview':
      return 'com.jyrwajr.agenyx.preview';
    default:
      return 'com.jyrwajr.agenyx.dev';
  }
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Agenyx',
  slug: 'agenyx',
  version: '1.0.0',
  scheme: 'agenyx',
  platforms: ['ios', 'android'],

  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './src/shared/assets/favicon.png',
  },

  plugins: [
    'expo-router',
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 36,
          targetSdkVersion: 36,
          buildToolsVersion: '36.0.0',
          architecture: 'arm64-v8a',
        },
        ios: {
          deploymentTarget: '16.4',
        },
      },
    ],
    [
      'expo-splash-screen',
      {
        image: './src/shared/assets/splash.png',
        backgroundColor: '#ffffff',
      },
    ],
    'expo-secure-store',
    'expo-font',
    'expo-status-bar',
    'expo-web-browser',
  ],

  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },

  orientation: 'portrait',

  icon: './src/shared/assets/icon-2.png',

  userInterfaceStyle: 'light',

  assetBundlePatterns: ['**/*'],

  ios: {
    supportsTablet: true,
    bundleIdentifier: getIdentifier(),
  },

  android: {
    adaptiveIcon: {
      foregroundImage: './src/shared/assets/icon-2.png',
      backgroundColor: '#ffffff',
    },
    softwareKeyboardLayoutMode: 'resize',
    package: getIdentifier(),
  },

  extra: {
    router: {},
    eas: {
      projectId: 'b9eba830-10c1-458d-a668-c52730909eb2',
    },
  },

  owner: 'jyrwajr',
});
