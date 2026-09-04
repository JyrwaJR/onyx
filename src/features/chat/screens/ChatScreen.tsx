import { useEffect, useRef, useCallback, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

import { useMessages, useSendMessage, useDeleteMessage } from '../hooks/use-chat';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';
import { createGlobalSSE, type SSEConnection } from '../../../shared/api/sse';
import { queryKeys } from '../../../shared/api/query-keys';
import type { MessageContentBlock, V2Message } from '../../../shared/api/types';
import { ConnectionErrorScreen, Loading } from '@/shared/components/screens';

/**
 * Back button component for chat screen header.
 * Renders a left arrow with "Back" text in ink color.
 */

/** A streaming assistant message being built from SSE deltas. */
interface StreamingState {
  text: string;
  reasoning: string;
}

/**
 * Main chat screen with SSE streaming and message management.
 *
 * Receives `sessionId` and `projectId` from route params. Subscribes to the
 * global V2 SSE event stream and builds up assistant messages incrementally
 * from `session.next.text.delta` / `session.next.reasoning.delta` events.
 */
export default function ChatScreen() {
  const { sessionId, projectId } = useLocalSearchParams<{
    sessionId: string;
    projectId: string;
  }>();
  const queryClient = useQueryClient();

  const sseRef = useRef<SSEConnection | null>(null);

  const [streaming, setStreaming] = useState<Map<string, StreamingState>>(new Map());

  const {
    data: messages,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(projectId, sessionId);

  const sendMessage = useSendMessage(projectId, sessionId);

  const deleteMessage = useDeleteMessage(projectId, sessionId);

  // Materialize streaming messages into the V2 message list shape.

  const allMessages: V2Message[] = messages ? [...messages] : [];

  streaming.forEach((state, msgId) => {
    const existingIndex = allMessages.findIndex((m) => m.id === msgId);
    const blocks: MessageContentBlock[] = [];
    if (state.reasoning) {
      blocks.push({ type: 'reasoning', id: 'reasoning-0', text: state.reasoning });
    }
    if (state.text) {
      blocks.push({ type: 'text', id: 'text-0', text: state.text });
    }
    const existing = existingIndex >= 0 ? allMessages[existingIndex] : undefined;
    const streamMsg: V2Message = {
      id: msgId,
      type: 'assistant',
      time: { created: existing?.time?.created ?? 0 },
      content: blocks,
    };
    if (existingIndex >= 0) {
      allMessages[existingIndex] = streamMsg;
    } else {
      allMessages.push(streamMsg);
    }
  });

  // Sort by creation time (stable for already-stored messages).
  allMessages.sort(
    (a, b) => (a.time?.created ?? 0) - (b.time?.created ?? 0) || a.id.localeCompare(b.id)
  );

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

  // Subscribe to the global V2 SSE event stream for this session.
  useEffect(() => {
    if (!sessionId) return;

    const handleEvent = (event: { type: string; data: string }) => {
      let payload: {
        type?: string;
        data?: {
          sessionID?: string;
          assistantMessageID?: string;
          delta?: string;
          text?: string;
          part?: { type?: string };
        };
      };
      try {
        payload = JSON.parse(event.data) as typeof payload;
      } catch {
        return;
      }
      if (!payload || !payload.data) return;
      const { sessionID, assistantMessageID, delta } = payload.data;
      if (sessionID !== sessionId || !assistantMessageID) return;

      const eventType = payload.type;
      const msgId = assistantMessageID;

      if (eventType === 'session.next.text.delta') {
        setStreaming((prev) => {
          const next = new Map(prev);
          const cur = next.get(msgId) ?? { text: '', reasoning: '' };
          next.set(msgId, { ...cur, text: cur.text + (delta ?? '') });
          return next;
        });
      } else if (eventType === 'session.next.reasoning.delta') {
        setStreaming((prev) => {
          const next = new Map(prev);
          const cur = next.get(msgId) ?? { text: '', reasoning: '' };
          next.set(msgId, { ...cur, reasoning: cur.reasoning + (delta ?? '') });
          return next;
        });
      } else if (eventType === 'session.next.step.ended') {
        // A step finished; pull the durable message and drop the local stream.
        setStreaming((prev) => {
          const next = new Map(prev);
          next.delete(msgId);
          return next;
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.messages.bySession(sessionId),
        });
      }
    };

    const handleError = (err: Error) => {
      console.warn('SSE error:', err.message);
    };

    sseRef.current = createGlobalSSE(handleEvent, handleError);

    return () => {
      sseRef.current?.close();
      sseRef.current = null;
    };
  }, [sessionId, queryClient]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ConnectionErrorScreen />;
  }

  return (
    <>
      <View className="flex-1 bg-surface">
        <MessageList
          messages={allMessages}
          onDelete={handleDelete}
          hasMore={hasNextPage ?? false}
          isLoadingMore={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
        <MessageInput onSend={handleSend} sending={sendMessage.isPending} />
      </View>
    </>
  );
}
