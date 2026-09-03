/**
 * @file Error display with message and optional retry action.
 */

import { View, Text, Pressable } from 'react-native';

/** Error display with message and optional retry button. */
export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-4xl">⚠️</Text>
      <Text className="mt-4 text-center text-base text-gray-700">{message}</Text>
      {onRetry && (
        <Pressable onPress={onRetry} className="mt-6 rounded-lg bg-indigo-600 px-6 py-3">
          <Text className="text-base font-semibold text-white">Retry</Text>
        </Pressable>
      )}
    </View>
  );
}
