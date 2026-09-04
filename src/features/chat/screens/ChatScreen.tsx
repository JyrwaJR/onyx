import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMessages, useSendMessage } from '../hooks/use-chat';
import { useSSE } from '../hooks/useSSE';
import type { StreamingState } from '../types';
import type { MessageContentBlock, V2Message } from '../../../shared/api/types';
import { Loading } from '@/shared/components/screens';
import { useSession } from '@/features/sessions';
import { StackHeader } from '@components/ui/header';
import { MessageInput } from '../components/MessageInput';
import { ChatHeaderBar } from '../components/ChatHeaderBar';
import { ContextBar } from '../components/ContextBar';
import { UserMessage } from '../components/UserMessage';
import { AssistantMessage } from '../components/AssistantMessage';
import { Container } from '@/shared/components/layout/Container';

/**
 * Main chat screen with SSE streaming and message management.
 *
 * Receives `sessionId` and `projectId` from route params. Subscribes to the
 * global V2 SSE event stream and builds up assistant messages incrementally.
 */
export default function ChatScreen() {
  const { sessionId, projectId } = useLocalSearchParams<{
    sessionId: string;
    projectId: string;
  }>();
  const { data, isFetching } = useSession(sessionId);

  const [streaming, setStreaming] = useState<Map<string, StreamingState>>(new Map());
  const [isReasoningOpen, setIsReasoningOpen] = useState(true);

  const {
    data: messages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(sessionId);

  const sendMessage = useSendMessage(sessionId);

  // Stable reference to the mutate function.
  const mutateRef = useRef(sendMessage.mutate);

  // Ref for auto-scrolling to bottom
  const scrollViewRef = useRef<ScrollView>(null);

  // --- Derived state ---

  const allMessages: V2Message[] = useMemo(() => {
    if (!messages && streaming.size === 0) return [];

    const merged: V2Message[] = messages ? [...messages] : [];

    streaming.forEach((state, msgId) => {
      const existingIndex = merged.findIndex((m) => m.id === msgId);
      const blocks: MessageContentBlock[] = [];
      if (state.reasoning) {
        blocks.push({ type: 'reasoning', id: 'reasoning-0', text: state.reasoning });
      }
      if (state.text) {
        blocks.push({ type: 'text', id: 'text-0', text: state.text });
      }
      const existing = existingIndex >= 0 ? merged[existingIndex] : undefined;
      const streamMsg: V2Message = {
        id: msgId,
        type: 'assistant',
        time: { created: existing?.time?.created ?? 0 },
        content: blocks,
      };
      if (existingIndex >= 0) {
        merged[existingIndex] = streamMsg;
      } else {
        merged.push(streamMsg);
      }
    });

    merged.sort(
      (a, b) => (a.time?.created ?? 0) - (b.time?.created ?? 0) || a.id.localeCompare(b.id)
    );
    return merged;
  }, [messages, streaming]);

  const streamingIds = useMemo(() => new Set(streaming.keys()), [streaming]);

  // Auto-scroll to the bottom whenever the message list changes size. This
  // ensures the most recent messages are visible on first load and when new
  // content (including streaming deltas) arrives.
  useEffect(() => {
    if (allMessages.length > 0) {
      const timeoutId = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [allMessages.length]);

  // --- Stable callbacks ---

  const handleSend = useCallback((content: string) => {
    mutateRef.current(content);
  }, []);

  const handleToggleReasoning = useCallback(() => {
    setIsReasoningOpen((prev) => !prev);
  }, []);

  const handleScroll = useCallback(
    (e: { nativeEvent: { contentOffset: { y: number } } }) => {
      if (e.nativeEvent.contentOffset.y < 50 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // --- SSE subscription ---

  useSSE(sessionId, ({ assistantMessageID, delta }) => {
    setStreaming((prev) => {
      const next = new Map(prev);
      const cur = next.get(assistantMessageID) ?? { text: '', reasoning: '' };
      next.set(assistantMessageID, { ...cur, text: cur.text + delta });
      return next;
    });
  });

  // --- Loading / error guards ---

  if (isLoading) return <Loading />;

  if (!projectId || !sessionId) {
    return (
      <>
        <StackHeader title={isFetching ? 'Loading…' : data?.title} />
        <Container>
          <SafeAreaView
            edges={['right', 'left', 'bottom']}
            className="flex-1 items-center justify-center bg-[#fcf9f6]">
            <MaterialIcons name="warning" size={48} color="#8f482f" />
            <Text className="mt-4 text-base font-medium text-[#54433e]">Missing session info</Text>
            <Text className="mt-2 text-sm text-[#5e5c54]">
              projectId={projectId ?? 'undefined'} sessionId={sessionId ?? 'undefined'}
            </Text>
          </SafeAreaView>
        </Container>
      </>
    );
  }

  // --- Render ---
  return (
    <>
      <StackHeader title={isFetching ? 'Loading…' : data?.title} />
      <SafeAreaView edges={['right', 'left', 'bottom']} className="flex-1 bg-[#fcf9f6]">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1">
          <ChatHeaderBar sessionId={sessionId} />

          {/* Messages Stream */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 py-3"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
            scrollEventThrottle={400}>
            {isFetchingNextPage && (
              <View className="mb-4 items-center py-2">
                <ActivityIndicator size="small" color="#8f482f" />
                <Text className="mt-1 text-xs text-[#5e5c54]">Loading older messages…</Text>
              </View>
            )}

            {allMessages.map((message) =>
              message?.type === 'user' ? (
                <UserMessage key={message.id} message={message} />
              ) : (
                <AssistantMessage
                  key={message.id}
                  message={message}
                  isStreaming={streamingIds.has(message.id)}
                  isReasoningOpen={isReasoningOpen}
                  onToggleReasoning={handleToggleReasoning}
                />
              )
            )}
          </ScrollView>

          {/* Bottom Input Area */}
          <View className="border-t border-[#dac1ba]/30 bg-[#fcf9f6]/95 pb-2">
            <ContextBar />
            <MessageInput
              disabled={sendMessage.isPaused}
              sending={sendMessage.isPending}
              onSend={handleSend}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
