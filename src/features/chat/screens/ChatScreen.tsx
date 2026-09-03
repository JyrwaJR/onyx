import { useEffect, useRef, useCallback, useState } from 'react';
import { View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

import { useMessages, useSendMessage, useDeleteMessage } from '../hooks/use-chat';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';
import { LoadingScreen } from '../../../shared/components/LoadingScreen';
import { ErrorView } from '../../../shared/components/ErrorView';
import { createSessionSSE, type SSEConnection } from '../../../shared/api/sse';
import { queryKeys } from '../../../shared/api/query-keys';
import type { ContentBlock, Message } from '../../../shared/api/types';

/**
 * Main chat screen with SSE streaming and message management.
 * Receives sessionId and projectId from route params.
 */
export default function ChatScreen() {
  const { sessionId, projectId } = useLocalSearchParams<{
    sessionId: string;
    projectId: string;
  }>();
  const queryClient = useQueryClient();
  const sseRef = useRef<SSEConnection | null>(null);
  const [streamingMessages, setStreamingMessages] = useState<Map<string, ContentBlock[]>>(new Map());

  const { data: messages, isLoading, isError, error } = useMessages(projectId, sessionId);
  const sendMessage = useSendMessage(projectId, sessionId);
  const deleteMessage = useDeleteMessage(projectId, sessionId);

  // Merge streaming messages with fetched messages
  const allMessages: Message[] = [];
  if (messages) {
    allMessages.push(...messages);
  }

  // Add any in-progress streaming messages
  streamingMessages.forEach((contentBlocks, msgId) => {
    const existingIndex = allMessages.findIndex((m) => m.id === msgId);
    if (existingIndex >= 0) {
      allMessages[existingIndex] = {
        ...allMessages[existingIndex],
        content: contentBlocks,
      };
    } else {
      allMessages.push({
        id: msgId,
        sessionId,
        role: 'assistant',
        content: contentBlocks,
        createdAt: new Date().toISOString(),
      });
    }
  });

  // Sort by creation time
  allMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const handleSend = useCallback(
    (content: string) => {
      sendMessage.mutate(content);
    },
    [sendMessage]
  );

  const handleDelete = useCallback(
    (messageId: string) => {
      deleteMessage.mutate(messageId);
    },
    [deleteMessage]
  );

  // SSE connection for real-time streaming
  useEffect(() => {
    if (!sessionId) return;

    const handleEvent = (event: { type: string; data: string }) => {
      try {
        const data = JSON.parse(event.data);

        if (event.type === 'message.updated' || event.type === 'message.created') {
          const msgId = data.id;
          if (msgId) {
            setStreamingMessages((prev) => {
              const next = new Map(prev);
              if (data.content) {
                next.set(msgId, data.content);
              }
              return next;
            });
          }
        }

        if (event.type === 'message.completed') {
          const msgId = data.id;
          if (msgId) {
            setStreamingMessages((prev) => {
              const next = new Map(prev);
              next.delete(msgId);
              return next;
            });
            queryClient.invalidateQueries({
              queryKey: queryKeys.messages.bySession(sessionId),
            });
          }
        }
      } catch {
        // Ignore parse errors for non-JSON events
      }
    };

    const handleError = (err: Error) => {
      console.warn('SSE error:', err.message);
    };

    sseRef.current = createSessionSSE(sessionId, handleEvent, handleError);

    return () => {
      sseRef.current?.close();
      sseRef.current = null;
    };
  }, [sessionId, queryClient]);

  if (isLoading) {
    return <LoadingScreen message="Loading messages..." />;
  }

  if (isError) {
    return (
      <ErrorView
        message={error instanceof Error ? error.message : 'Failed to load messages.'}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Chat' }} />
      <View className="flex-1 bg-white">
        <MessageList
          messages={allMessages}
          onDelete={handleDelete}
        />
        <MessageInput
          onSend={handleSend}
          sending={sendMessage.isPending}
        />
      </View>
    </>
  );
}
