import '../../global.css';
import '@/shared/lib/nativewind-interop';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/query-client';
import { ConnectionProvider } from '@/shared/components/providers/connection';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <ConnectionProvider>
            <SafeAreaProvider>
              <StatusBar style="auto" />
              <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaProvider>
          </ConnectionProvider>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
