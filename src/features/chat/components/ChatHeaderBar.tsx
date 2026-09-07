import { memo } from 'react';
import { View, Text } from 'react-native';

import { useSession } from '@/shared/hooks';
import { useChatStore } from '../store/chat-store';

/**
 * Static sub-header bar showing the active model, branch, and socket latency.
 *
 * Fixed below the StackHeader, above the message list.
 */
export const ChatHeaderBar = memo(function ChatHeaderBar() {
  const sessionId = useChatStore((s) => s.context.activeSessionId);
  const { data: session, isFetching } = useSession();

  if (!sessionId) return null;

  return (
    <View className="flex-row items-center justify-between bg-[#f6f3f1] px-4 py-2">
      <View className="flex-1 flex-row items-center gap-1.5 pr-2">
        <View className="h-2 w-2 rounded-full bg-[#8f482f]" />
        <Text className="text-xs font-medium text-[#54433e]" numberOfLines={1}>
          {isFetching
            ? 'Loading...'
            : `${session?.agent ?? 'Onyx'} - ${session?.model?.id || '-'} - (${session?.model?.variant ?? '-'})`}
        </Text>
      </View>
    </View>
  );
});
