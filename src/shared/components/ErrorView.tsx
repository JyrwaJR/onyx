/**
 * @file Error display with message and optional retry action.
 */

import { View, Text, Pressable } from 'react-native';

/**
 * Error display with message and optional retry button.
 *
 * @param message - Error description to display.
 * @param onRetry - Optional callback when retry button is pressed.
 */
export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View className="flex-1 items-center justify-center bg-canvas px-6">
      <Text className="text-4xl">⚠️</Text>
      <Text className="mt-4 text-center text-base text-body">{message}</Text>
      {onRetry && (
        <Pressable onPress={onRetry} className="mt-6 rounded-lg bg-primary px-6 py-3">
          <Text className="text-base font-semibold text-on-primary">Retry</Text>
        </Pressable>
      )}
    </View>
  );
}
