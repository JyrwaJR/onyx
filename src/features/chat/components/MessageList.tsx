import { useRef, useEffect } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import type { V2Message } from '../../../shared/api/types';
import { MessageBubble } from './MessageBubble';
import { EmptyState } from '../../../shared/components/EmptyState';

interface MessageListProps {
  messages: V2Message[];
  isLoading?: boolean;
  onDelete?: (messageId: string) => void;
}

/**
 * Inverted FlatList displaying messages with auto-scroll to bottom.
 *
 * @param messages - The messages to display.
 * @param isLoading - Whether messages are currently loading.
 * @param onDelete - Optional callback for deleting messages.
 */
export function MessageList({ messages, isLoading, onDelete }: MessageListProps) {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#cc785c" />
      </View>
    );
  }

  if (messages.length === 0) {
    return (
      <EmptyState icon="💬" title="No messages yet" subtitle="Send a message to start chatting" />
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MessageBubble message={item} onDelete={onDelete} />}
      contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
    />
  );
}
