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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMessages, useSendMessage } from '../hooks';
import { useSSE } from '../hooks/use-sse';
import type { StreamingState } from '../types';
import type { MessageContentBlock, Message } from '../../../shared/api/types';
import { Loading } from '@/shared/components/screens';
import { useSession } from '@/features/sessions';
import { StackHeader } from '@components/ui/header';
import { MessageInput } from '../components/MessageInput';
import { ChatSelection } from '../components/ChatSelection';
import { ChatHeaderBar } from '../components/ChatHeaderBar';
import { ContextBar } from '../components/ContextBar';
import { UserMessage } from '../components/UserMessage';
import { AssistantMessage } from '../components/AssistantMessage';
import { Container } from '@/shared/components/layout/Container';
import EmptyChat from '../components/empty-chat';
import { Ternary } from '@/shared/components/ui/ternary';
import { SquareLoadingBar } from '../components/square-loading-bar';
import { useChatStore } from '../store/chat-store';
import { useSessionStatus } from '@/shared/hooks';

/**
 * Main chat screen with SSE streaming and message management.
 *
 * Receives `sessionId` and `projectId` from route params. Subscribes to the
 * global V2 SSE event stream and builds up assistant messages incrementally.
 * User messages are rendered optimistically at send time and reconciled with
 * the authoritative server list once the server confirms them.
 */

/**
 * Returns the optimistic pending user messages that are not yet confirmed by
 * the authoritative server message list.
 *
 * Matching is count-aware: for each trimmed text, the first N pending copies
 * (N = number of confirmed server messages with that text) are considered
 * mirrored and are dropped, so sending the same message twice cannot hide a
 * legitimately duplicated send.
 *
 * @param pendingMessages - Map of optimistic user messages keyed by temp id.
 * @param messages - Authoritative server message list (may be undefined).
 * @returns The pending messages still awaiting confirmation, keyed by temp id.
 */
function getUnconfirmedPending(
  pendingMessages: Map<string, Message>,
  messages: Message[] | undefined
): Map<string, Message> {
  const confirmedCountByText = new Map<string, number>();
  for (const m of messages ?? []) {
    if (m.type === 'user' && m.text) {
      confirmedCountByText.set(m.text, (confirmedCountByText.get(m.text) ?? 0) + 1);
    }
  }

  const pendingList = [...pendingMessages.values()].sort(
    (a, b) => (a.time?.created ?? 0) - (b.time?.created ?? 0)
  );

  const skippedByText = new Map<string, number>();
  const kept = new Map<string, Message>();
  for (const pendingMsg of pendingList) {
    const text = pendingMsg.text ?? '';
    const skipped = skippedByText.get(text) ?? 0;
    if (skipped < (confirmedCountByText.get(text) ?? 0)) {
      skippedByText.set(text, skipped + 1);
      continue;
    }
    kept.set(pendingMsg.id, pendingMsg);
  }
  return kept;
}

export default function ChatScreen() {
  const [agent, setAgent] = useState<'build' | 'plan'>('build');
  const { sessionId, projectId } = useLocalSearchParams<{
    sessionId: string;
    projectId: string;
  }>();

  const { data: session, isFetching } = useSession(sessionId);
  const { isBusy: isSessionBusy } = useSessionStatus({ sessionId });

  const [streaming, setStreaming] = useState<Map<string, StreamingState>>(new Map());
  const [activeInteraction, setActiveInteraction] = useState<{
    type: 'selection';
    question: string;
    options: string[];
  } | null>(null);
  const processedSelectionId = useRef<string | null>(null);
  const [isReasoningOpen, setIsReasoningOpen] = useState(true);

  // User messages rendered optimistically before the server confirms them.
  const [pendingMessages, setPendingMessages] = useState<Map<string, Message>>(new Map());
  const pendingIdRef = useRef(0);
  const insets = useSafeAreaInsets();
  const {
    data: messages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(sessionId);
  const { isStreaming } = useChatStore();

  const sendMessage = useSendMessage(sessionId);

  // Stable reference to the mutate function.
  const mutateRef = useRef(sendMessage.mutate);

  // Ref for auto-scrolling to bottom
  const scrollViewRef = useRef<ScrollView>(null);

  // --- Derived state ---

  const allMessages: Message[] = useMemo(() => {
    if (!messages && streaming.size === 0 && pendingMessages.size === 0) return [];

    const merged: Message[] = messages ? [...messages] : [];

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
      const streamMsg: Message = {
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

    // Append optimistic user messages the server has not confirmed yet.
    const unconfirmedPending = getUnconfirmedPending(pendingMessages, messages);
    for (const pendingMsg of unconfirmedPending.values()) {
      merged.push(pendingMsg);
    }

    merged.sort((a, b) => {
      const timeA = a.time?.created ?? 0;
      const timeB = b.time?.created ?? 0;
      if (timeA !== timeB) {
        return timeA - timeB;
      }
      return (a.id ?? '').localeCompare(b.id ?? '');
    });
    return merged;
  }, [messages, streaming, pendingMessages]);

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
    const trimmed = content.trim();
    if (!trimmed) return;

    // Optimistically render the user message so it appears immediately, even
    // though the server confirms it asynchronously (its message list is not
    // updated until the agent pipeline commits the message).
    pendingIdRef.current += 1;
    const tempId = `pending-${Date.now()}-${pendingIdRef.current}`;
    setPendingMessages((prev) => {
      const next = new Map(prev);
      next.set(tempId, {
        id: tempId,
        type: 'user',
        text: trimmed,
        time: { created: Date.now() },
      });
      return next;
    });

    mutateRef.current(trimmed);
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

  // Handle incoming selection blocks
  useEffect(() => {
    const lastMessage = allMessages[allMessages.length - 1];
    if (lastMessage?.type === 'assistant' && lastMessage.content) {
      const selectionBlock = lastMessage.content.find((b) => b.type === 'selection');
      if (
        selectionBlock &&
        selectionBlock.type === 'selection' &&
        processedSelectionId.current !== lastMessage.id
      ) {
        processedSelectionId.current = lastMessage.id;
        setActiveInteraction({
          type: 'selection',
          question: selectionBlock.question,
          options: selectionBlock.options,
        });
      }
    }
  }, [allMessages]);

  // Prune pending messages once the server confirms them. This is a
  // render-phase state adjustment (React re-renders immediately with the
  // pruned map); the equality bail-out prevents an update loop.
  if (pendingMessages.size > 0) {
    const kept = getUnconfirmedPending(pendingMessages, messages);
    if (kept.size !== pendingMessages.size) {
      setPendingMessages(kept);
    }
  }

  // --- Loading / error guards ---

  if (isLoading) return <Loading />;

  if (!projectId || !sessionId) {
    return (
      <>
        <StackHeader title={isFetching ? 'Loading…' : session?.title} />
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

  const isBusy = isStreaming || isSessionBusy;

  return (
    <>
      <StackHeader title={isFetching ? 'Loading…' : session?.title} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        className="flex-1">
        <SafeAreaView edges={['right', 'left', 'bottom']} className="flex-1 bg-[#fcf9f6]">
          <ChatHeaderBar sessionId={sessionId} />
          {/* Messages Stream */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 py-3"
            contentContainerStyle={{ paddingBottom: insets.bottom }}
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
            <Ternary
              condition={allMessages.length === 0}
              truthy={<EmptyChat />}
              falsy={allMessages.map((message) => (
                <Ternary
                  key={message.id}
                  condition={message.type === 'user'}
                  truthy={<UserMessage message={message} />}
                  falsy={
                    <AssistantMessage
                      key={message.id}
                      message={message}
                      isStreaming={streamingIds.has(message.id)}
                      isReasoningOpen={isReasoningOpen}
                      onToggleReasoning={handleToggleReasoning}
                    />
                  }
                />
              ))}
            />
          </ScrollView>
          {/* Bottom Input Area wrapped in bottom edge SafeAreaView */}
          <View className="gap-2 border-t border-[#dac1ba]/30 bg-[#fcf9f6] pb-2">
            <View className="flex-row pt-2">
              <ContextBar onToggleAgent={(v) => setAgent(v)} />
              <SquareLoadingBar isLoading={isBusy} />
            </View>
            <Ternary
              condition={activeInteraction ? true : false}
              truthy={
                <>
                  {activeInteraction && (
                    <ChatSelection
                      question={activeInteraction?.question}
                      options={activeInteraction?.options}
                      onSelect={(option) => {
                        handleSend(option);
                        setActiveInteraction(null);
                      }}
                    />
                  )}
                </>
              }
              falsy={
                <MessageInput
                  sessionId={sessionId}
                  agent={agent}
                  disabled={sendMessage.isPaused}
                  sending={sendMessage.isPending}
                  onSend={handleSend}
                />
              }
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}
