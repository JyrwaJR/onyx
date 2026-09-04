import { memo } from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ActiveContextNoticeProps {
  /** The file name currently active as context. */
  fileName: string;
}

/**
 * Banner shown inside the message list when a file context is attached.
 *
 * Displays the active file name with a data-object icon.
 *
 * @param fileName - The file name to display.
 */
export const ActiveContextNotice = memo(function ActiveContextNotice({
  fileName,
}: ActiveContextNoticeProps) {
  return (
    <View className="mb-4 flex-row items-center justify-between rounded-lg bg-[#f0edeb] p-2">
      <View className="mr-2 flex-1 flex-row items-center gap-1.5">
        <MaterialIcons name="data-object" size={16} color="#8f482f" />
        <Text className="text-xs font-semibold text-[#54433e]" numberOfLines={1}>
          {fileName}
        </Text>
      </View>
      <Text className="text-xs text-[#5e5c54]">Active Context</Text>
    </View>
  );
});
