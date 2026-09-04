import { View, Text, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useConnectionStore } from '../../../features/connection/store/connection-store';
import { Card } from '@/shared/components/ui/card';

export default function SettingsIndex() {
  const router = useRouter();
  const { serverUrl, disconnect } = useConnectionStore();

  const handleDisconnect = () => {
    disconnect();
    router.replace('/(connection)');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerStyle: { backgroundColor: '#faf9f5' },
          headerTintColor: '#141413',
          headerTitleStyle: { fontWeight: '500', fontSize: 18, fontFamily: 'Inter' },
          headerShadowVisible: false,
        }}
      />
      <View className="flex-1 bg-canvas px-6 pt-6">
        <Card>
          <View className="mb-1">
            <Text className="text-sm font-medium text-muted">Server URL</Text>
            <Text className="mt-1 text-base text-ink">{serverUrl || 'Not connected'}</Text>
          </View>
        </Card>

        <Pressable
          onPress={handleDisconnect}
          className="items-center rounded-lg border border-error/20 bg-error/10 px-4 py-3">
          <Text className="text-base font-medium text-error">Disconnect</Text>
        </Pressable>

        <View className="mt-auto items-center pb-6">
          <Text className="text-xs text-muted-soft">Onyx v1.0.0</Text>
        </View>
      </View>
    </>
  );
}
