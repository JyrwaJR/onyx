/**
 * @file Empty list placeholder with icon and message.
 */

import { View, Text } from 'react-native';

/**
 * Empty list placeholder with icon and message.
 *
 * @param icon - Emoji or icon to display (default: 📭).
 * @param title - Primary heading text.
 * @param subtitle - Optional secondary description text.
 */
export function EmptyState({
  icon = '📭',
  title,
  subtitle,
}: {
  icon?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-5xl">{icon}</Text>
      <Text className="mt-4 text-lg font-semibold text-ink">{title}</Text>
      {subtitle && <Text className="mt-2 text-center text-sm text-muted">{subtitle}</Text>}
    </View>
  );
}
