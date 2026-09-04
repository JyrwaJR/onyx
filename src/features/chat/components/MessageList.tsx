import { useRef, useEffect } from 'react';
import { FlatList, TouchableOpacity, ActivityIndicator, Text, View } from 'react-native';
import type { V2Message } from '../../../shared/api/types';
import { MessageBubble } from './MessageBubble';
import { Loading, NotFoundSessionsScreen } from '../../../shared/components/screens';

interface MessageListProps {
  messages: V2Message[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onDelete?: (messageId: string) => void;
}

/**
 * FlatList displaying messages with auto-scroll to bottom and optional
 * "load earlier messages" pagination.
 *
 * Messages are rendered in ascending chronological order (oldest first,
 * newest at bottom). When `hasMore` is true, a tappable indicator appears
 * above the list to fetch older pages.
 *
 * @param messages - The messages to display in chronological order.
 * @param isLoading - Whether the initial message load is in progress.
 * @param isLoadingMore - Whether an older page is currently being fetched.
 * @param hasMore - Whether older messages are available to load.
 * @param onLoadMore - Callback to fetch the next (older) page of messages.
 * @param onDelete - Optional callback for deleting messages.
 */
export function MessageList({
  messages,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
  onDelete,
}: MessageListProps) {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  if (isLoading) {
    return <Loading />;
  }

  if (messages.length === 0) {
    return <NotFoundSessionsScreen screenTitle="No Messages" />;
  }

  return (
    <View className="flex-1">
      {hasMore && (
        <TouchableOpacity
          onPress={onLoadMore}
          disabled={isLoadingMore}
          className="items-center py-3">
          {isLoadingMore ? (
            <ActivityIndicator size="small" color="#666" />
          ) : (
            <Text className="text-sm text-ink/50">Load earlier messages</Text>
          )}
        </TouchableOpacity>
      )}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} onDelete={onDelete} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
    </View>
  );
}
