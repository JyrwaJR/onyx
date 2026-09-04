import '../../global.css';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/shared/api/query-client';
import { useConnectionStore } from '@features/connection/store/connection-store';
import { ConnectionErrorScreen } from '@/shared/components/screens';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [error, setError] = useState<string | null>(null);
  const hydrate = useConnectionStore((s) => s.hydrate);
  const hydrated = useConnectionStore((s) => s.hydrated);

  useEffect(() => {
    hydrate().catch((e) => setError(String(e)));
  }, [hydrate]);

  useEffect(() => {
    if (hydrated) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [hydrated]);

  if (error) {
    return <ConnectionErrorScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="/(connection)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
