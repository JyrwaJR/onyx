import { View, Text, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useConnectionStore } from '../../../features/connection/store/connection-store';

export default function SettingsIndex() {
  const router = useRouter();
  const { serverUrl, disconnect } = useConnectionStore();

  const handleDisconnect = () => {
    disconnect();
    router.replace('/(connection)');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />
      <View className="flex-1 bg-white px-6 pt-6">
        <View className="mb-8">
          <Text className="text-sm font-medium text-gray-500">Server URL</Text>
          <Text className="mt-1 text-base text-gray-900">{serverUrl || 'Not connected'}</Text>
        </View>

        <Pressable
          onPress={handleDisconnect}
          className="items-center rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <Text className="text-base font-medium text-red-600">Disconnect</Text>
        </Pressable>

        <View className="mt-auto items-center pb-6">
          <Text className="text-xs text-gray-400">Onyx v1.0.0</Text>
        </View>
      </View>
    </>
  );
}
