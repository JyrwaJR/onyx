import { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

interface StackHeaderProps {
  /** Header title text. */
  title?: string;
  /** Whether to show the back button. Defaults to true. */
  showBack?: boolean;
}

/**
 * Custom stack header with back button and title.
 *
 * Renders inside the screen content (not as the native Stack header).
 * Uses the app's earthy color palette: stone-50 background, #8f482f accent.
 *
 * @param title - The title text to display.
 * @param showBack - Whether to show the back arrow button.
 */
export const StackHeader = memo(({ title, showBack = true }: StackHeaderProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = useCallback(() => router.back(), [router]);
  const canGoBack = router.canGoBack();
  const isShowBack = showBack && canGoBack;

  return (
    <View className="border-b border-[#dac1ba] bg-[#fcf9f6]" style={{ paddingTop: insets.top }}>
      <View className="min-h-[52px] flex-row items-center gap-x-3 px-4">
        <TouchableOpacity
          onPress={handleBack}
          disabled={!canGoBack}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          className="flex-1 flex-row gap-x-3"
          activeOpacity={0.7}>
          {isShowBack && <MaterialIcons name="arrow-back-ios" size={22} color="#54433e" />}
          <Text className="flex-1 text-lg font-semibold text-[#1c1c1a]" numberOfLines={1}>
            {title ?? ''}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

StackHeader.displayName = 'StackHeader';
