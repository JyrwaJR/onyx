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
import type { Message, MessagePart } from '../../../shared/api/types';

/**
 * Main chat screen with SSE streaming and message management.
 *
 * Receives `sessionId` and `projectId` from route params. Streams real-time
 * updates from the OpenCode session log stream and merges in-progress
 * assistant messages with the fetched history.
 */
export default function ChatScreen() {
  const { sessionId, projectId } = useLocalSearchParams<{
    sessionId: string;
    projectId: string;
  }>();
  const queryClient = useQueryClient();
  const sseRef = useRef<SSEConnection | null>(null);
  const [streamingMessages, setStreamingMessages] = useState<Map<string, Message>>(new Map());

  const { data: messages, isLoading, isError, error } = useMessages(projectId, sessionId);
  const sendMessage = useSendMessage(projectId, sessionId);
  const deleteMessage = useDeleteMessage(projectId, sessionId);

  // Merge streaming messages with fetched messages
  const allMessages: Message[] = messages ? [...messages] : [];
  streamingMessages.forEach((streamMsg, msgId) => {
    const existingIndex = allMessages.findIndex((m) => m.info.id === msgId);
    if (existingIndex >= 0) {
      allMessages[existingIndex] = streamMsg;
    } else {
      allMessages.push(streamMsg);
    }
  });

  // Sort by creation time
  allMessages.sort((a, b) => (a.info.time.created ?? 0) - (b.info.time.created ?? 0));

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
    console.log('[Chat] SSE effect triggered, sessionId:', sessionId);
    if (!sessionId) return;

    const handleEvent = (event: { type: string; data: string }) => {
      console.log('[Chat] SSE event received:', event.type);
      try {
        const payload = JSON.parse(event.data as string) as {
          type?: string;
          id?: string;
          sessionID?: string;
          role?: string;
          time?: { created?: number };
          parts?: Message['parts'];
        };

        console.log('[Chat] Parsed payload:', JSON.stringify(payload).substring(0, 200));

        // Message updates arrive as complete message objects in the SSE stream.
        if (payload.id && Array.isArray(payload.parts)) {
          console.log('[Chat] Updating streaming message:', payload.id);
          const msgId = payload.id;
          setStreamingMessages((prev) => {
            const next = new Map(prev);
            next.set(msgId, {
              info: {
                id: payload.id as string,
                sessionID: payload.sessionID as string,
                role: (payload.role as Message['info']['role']) ?? 'assistant',
                time: { created: payload.time?.created ?? Date.now() },
              },
              parts: payload.parts as MessagePart[],
            });
            return next;
          });
        } else {
          console.log('[Chat] Event did not match message format (missing id or parts)');
        }
      } catch (e) {
        console.error('[Chat] Failed to parse SSE event:', e);
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
      <ErrorView message={error instanceof Error ? error.message : 'Failed to load messages.'} />
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Chat' }} />
      <View className="flex-1 bg-white">
        <MessageList messages={allMessages} onDelete={handleDelete} />
        <MessageInput onSend={handleSend} sending={sendMessage.isPending} />
      </View>
    </>
  );
}
