import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ParentSessionNoticeProps {
  /** The parent (spawning) session ID. */
  parentSessionId: string;
  /** Project ID used to navigate back to the parent chat. */
  projectId: string;
}

/**
 * Thin banner shown at the top of a subagent session's chat that navigates
 * back to the parent session. Rendered only when the current session has a
 * `parentID` (i.e. it is a child/subagent session).
 *
 * @param parentSessionId - Parent session ID to navigate to.
 * @param projectId - Project ID for the `/chat` route.
 */
export function ParentSessionNotice({ parentSessionId, projectId }: ParentSessionNoticeProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between border-b border-[#dac1ba]/30 bg-[#f6f3f1] px-4 py-2">
      <View className="flex-1 flex-row items-center gap-2 pr-2">
        <MaterialIcons name="account-tree" size={16} color="#5e5c54" />
        <Text className="text-xs text-[#54433e]" numberOfLines={1}>
          Viewing a subagent session
        </Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          router.replace(`/chat?sessionId=${parentSessionId}&projectId=${projectId}` as never)
        }
        activeOpacity={0.7}
        className="flex-row items-center gap-1 rounded-full bg-[#e6e2da] px-2.5 py-1">
        <MaterialIcons name="arrow-back" size={14} color="#54433e" />
        <Text className="text-xs font-medium text-[#54433e]">Back to parent</Text>
      </TouchableOpacity>
    </View>
  );
}
