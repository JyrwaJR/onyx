/**
 * @file Full-screen centered loading spinner with optional message.
 */

import { View, ActivityIndicator, Text } from 'react-native';

/**
 * Full-screen centered loading spinner with optional message.
 *
 * @param message - Optional loading message to display (default: 'Loading...').
 */
export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-canvas">
      <ActivityIndicator size="large" color="#cc785c" />
      <Text className="mt-4 text-base text-muted">{message}</Text>
    </View>
  );
}
