import { memo } from 'react';
import { View, Text } from 'react-native';
import { useMcpStatus } from '@hooks/use-mcp-status';

import { AbortSessionButton } from './AbortSessionButton';
import { useSession } from '@/shared/hooks';

/**
 * Static sub-header bar showing the active model, branch, and socket latency.
 *
 * Fixed below the StackHeader, above the message list.
 */
type ChatHeaderBarProps = {
  sessionId: string;
};

export const ChatHeaderBar = memo(function ChatHeaderBar({ sessionId }: ChatHeaderBarProps) {
  const { data, isFetching } = useSession(sessionId);
  const { data: mcpServers, isLoading } = useMcpStatus();
  const totalServers = mcpServers?.length;
  const activeServers = mcpServers?.filter((s) => s.status === 'connected').length;
  return (
    <View className="flex-row items-center justify-between bg-[#f6f3f1] px-4 py-2">
      <View className="flex-1 flex-row items-center gap-1.5 pr-2">
        <View className="h-2 w-2 rounded-full bg-[#8f482f]" />
        <Text className="text-xs font-medium text-[#54433e]" numberOfLines={1}>
          {isFetching
            ? 'Loading...'
            : `${data?.agent ?? 'Onyx'} - ${data?.model?.id || '-'} - (${data?.model?.variant ?? '-'})`}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <AbortSessionButton sessionId={sessionId} />
        <View className="rounded bg-[#f0edeb] px-1.5 py-0.5">
          <Text className="text-[11px] text-[#5e5c54]">
            MCP: {isLoading ? '...' : `${activeServers}/${totalServers}`}
          </Text>
        </View>
      </View>
    </View>
  );
});
