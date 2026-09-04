import { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Static sub-header bar showing the active model, branch, and socket latency.
 *
 * Fixed below the StackHeader, above the message list.
 */
export const ChatHeaderBar = memo(function ChatHeaderBar() {
  return (
    <View className="flex-row items-center justify-between bg-[#f6f3f1] px-4 py-2">
      <View className="flex-1 flex-row items-center gap-1.5 pr-2">
        <View className="h-2 w-2 rounded-full bg-[#8f482f]" />
        <Text className="text-xs font-medium text-[#54433e]" numberOfLines={1}>
          Onyx-7B (Local) <Text className="text-[#5e5c54]">·</Text> feature/jwt-auth
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <View className="rounded bg-[#f0edeb] px-1.5 py-0.5">
          <Text className="text-[11px] text-[#5e5c54]">12ms socket</Text>
        </View>
        <TouchableOpacity
          className="h-7 w-7 items-center justify-center"
          accessibilityLabel="Terminal output">
          <MaterialIcons name="terminal" size={18} color="#54433e" />
        </TouchableOpacity>
      </View>
    </View>
  );
});
