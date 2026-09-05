import { useEffect } from 'react';
import '../../global.css';
import '@/shared/lib/nativewind-interop';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/query-client';
import { useConnectionStore } from '@/shared/stores';

export default function RootLayout() {
  useEffect(() => {
    useConnectionStore.getState().hydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
