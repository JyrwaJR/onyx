import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Onyx',
  slug: 'onyx',
  version: '1.0.0',
  scheme: 'onyx',
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
    bundleIdentifier: 'com.jyrwajr.onyx',
  },

  android: {
    adaptiveIcon: {
      foregroundImage: './src/shared/assets/icon-2.png',
      backgroundColor: '#ffffff',
    },
    softwareKeyboardLayoutMode: 'resize',
    package: 'com.jyrwajr.onyx',
  },

  extra: {
    router: {},
    eas: {
      projectId: '2373d389-fd22-4dd7-bc72-ecde8c570f5d',
    },
  },

  owner: 'jyrwajr',
});
