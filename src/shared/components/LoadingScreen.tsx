/**
 * @file Full-screen centered loading spinner with optional message.
 */

import { View, ActivityIndicator, Text } from 'react-native';

/** Full-screen centered loading spinner with optional message. */
export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#4F46E5" />
      <Text className="mt-4 text-base text-gray-500">{message}</Text>
    </View>
  );
}
