import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMessages, useSendMessage } from '../hooks';
import { useSessionStream } from '../hooks/use-session-stream';
import type { StreamingState, QuestionRequest } from '../types';
import type { MessageContentBlock, Message } from '../../../shared/api/types';
import { Loading } from '@/shared/components/screens';
import { useSession } from '@/features/sessions';
import { StackHeader } from '@components/ui/header';
import { MessageInput } from '../components/MessageInput';
import { ChatSelection } from '../components/ChatSelection';
import { PermissionRequestCard } from '../components/PermissionRequestCard';
import { ChatHeaderBar } from '../components/ChatHeaderBar';
import { ContextBar } from '../components/ContextBar';
import { UserMessage } from '../components/UserMessage';
import { AssistantMessage } from '../components/AssistantMessage';
import { ParentSessionNotice } from '../components/ParentSessionNotice';
import { Container } from '@/shared/components/layout/Container';
import EmptyChat from '../components/empty-chat';
import { SquareLoadingBar } from '../components/square-loading-bar';
import { useChatStore } from '../store/chat-store';
import { useSessionStatus } from '@/shared/hooks';
import {
  replyToQuestion,
  rejectQuestion,
  listPendingQuestions,
  listPendingPermissions,
} from '../api/chat-api';
import { useChatScroll } from '../components/providers/chat-scroll';

/** Ignore a re-send of identical text within this window (double-tap race guard). */
const SEND_DEDUPE_WINDOW_MS = 500;

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
  const [activeQuestion, setActiveQuestion] = useState<QuestionRequest | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<(string[] | null)[]>([]);
  // Index of the question currently shown. Advances forward as the user answers;
  // only one question is rendered at a time.
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isReasoningOpen, setIsReasoningOpen] = useState(true);

  const [pendingMessages, setPendingMessages] = useState<Map<string, Message>>(new Map());
  const pendingIdRef = useRef(0);
  const lastSentRef = useRef<{ text: string; at: number } | null>(null);
  // Tracks the latest activeQuestion for the restore effect below, so the
  // pending-question fetch does not need to re-run on every activeQuestion
  // change (avoids extra network calls on the SSE answer path).
  const activeQuestionRef = useRef(activeQuestion);
  useEffect(() => {
    activeQuestionRef.current = activeQuestion;
  }, [activeQuestion]);
  const insets = useSafeAreaInsets();
  const {
    data: messages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(sessionId);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const pendingPermissionRequests = useChatStore((state) => state.pendingPermissionRequests);
  const addPermissionRequest = useChatStore((state) => state.addPermissionRequest);
  const removePermissionRequest = useChatStore((state) => state.removePermissionRequest);

  const sessionPermissions = useMemo(
    () => pendingPermissionRequests.filter((r) => r.sessionID === sessionId),
    [pendingPermissionRequests, sessionId]
  );
  const activePermission = sessionPermissions[0] ?? null;

  const sendMessage = useSendMessage(sessionId);
  const mutateRef = useRef(sendMessage.mutate);
  // Keep the ref at the latest mutate. React Query's mutate is stable today,
  // but this guards against a future mutation-instance change (e.g. session switch).
  useEffect(() => {
    mutateRef.current = sendMessage.mutate;
  }, [sendMessage.mutate]);

  // Consume ChatScrollContext
  const {
    listRef,
    handleScroll: handleScrollContext,
    scrollToBottom,
    notifyContentChanged,
  } = useChatScroll<Message>();

  // Combine Context Scroll tracking with top-pagination trigger
  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      handleScrollContext(e);
      if (e.nativeEvent.contentOffset.y < 50 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [handleScrollContext, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

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

  // Auto-scroll when messages or streaming content update
  useEffect(() => {
    notifyContentChanged();
  }, [allMessages, notifyContentChanged]);

  const streamingIds = useMemo(() => new Set(streaming.keys()), [streaming]);

  const handleSend = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const now = Date.now();
      const last = lastSentRef.current;
      if (last && last.text === trimmed && now - last.at < SEND_DEDUPE_WINDOW_MS) {
        return; // Duplicate submission from the send-button double-tap race.
      }
      lastSentRef.current = { text: trimmed, at: now };

      pendingIdRef.current += 1;
      const tempId = `pending-${Date.now()}-${pendingIdRef.current}`;
      setPendingMessages((prev) => {
        const next = new Map(prev);
        next.set(tempId, {
          id: tempId,
          type: 'user',
          text: trimmed,
          status: 'pending',
          time: { created: Date.now() },
        });
        return next;
      });

      mutateRef.current(trimmed);
      scrollToBottom(true);
    },
    [scrollToBottom]
  );

  const handleToggleReasoning = useCallback(() => {
    setIsReasoningOpen((prev) => !prev);
  }, []);

  const handleQuestion = useCallback((request: QuestionRequest) => {
    setActiveQuestion(request);
    setQuestionAnswers(Array(request.questions.length).fill(null));
    setCurrentQuestionIndex(0);
  }, []);

  const handleQuestionSelect = useCallback(
    (questionIndex: number, labels: string[]) => {
      setQuestionAnswers((prev) => {
        const next = [...prev];
        next[questionIndex] = labels;
        return next;
      });
      if (!activeQuestion) return;
      // Single-select fires onSelect immediately on tap; multi/custom fire it via
      // their submit button. Either way advance to the next unanswered question;
      // on the last question the auto-submit effect posts the final reply.
      if (questionIndex < activeQuestion.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    },
    [activeQuestion]
  );

  const handleRejectQuestion = useCallback(() => {
    if (!activeQuestion) return;
    const requestId = activeQuestion.id;
    setActiveQuestion(null);
    rejectQuestion(requestId).catch((err) => console.warn('Failed to reject question:', err));
  }, [activeQuestion]);

  const FLUSH_INTERVAL_MS = 80;
  const pendingDeltasRef = useRef<Map<string, string>>(new Map());
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushDeltas = useCallback(() => {
    flushTimerRef.current = null;
    const pending = pendingDeltasRef.current;
    pendingDeltasRef.current = new Map();
    if (pending.size === 0) return;
    setStreaming((prev) => {
      const next = new Map(prev);
      for (const [msgId, delta] of pending) {
        const cur = next.get(msgId) ?? { text: '', reasoning: '' };
        next.set(msgId, { ...cur, text: cur.text + delta });
      }
      return next;
    });
  }, []);

  const scheduleFlush = useCallback(() => {
    if (flushTimerRef.current != null) return;
    flushTimerRef.current = setTimeout(flushDeltas, FLUSH_INTERVAL_MS);
  }, [flushDeltas]);

  useEffect(() => {
    return () => {
      if (flushTimerRef.current != null) {
        clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
    };
  }, []);

  const handleComplete = useCallback((messageId: string | null) => {
    if (messageId == null) return;
    pendingDeltasRef.current.delete(messageId);
    setStreaming((prev) => {
      if (!prev.has(messageId)) return prev;
      const next = new Map(prev);
      next.delete(messageId);
      return next;
    });
  }, []);

  useSessionStream({
    sessionId,
    onDelta: ({ assistantMessageID, delta }) => {
      const pending = pendingDeltasRef.current;
      pending.set(assistantMessageID, (pending.get(assistantMessageID) ?? '') + delta);
      scheduleFlush();
    },
    onQuestion: handleQuestion,
    onComplete: handleComplete,
  });

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    listPendingQuestions()
      .then((requests) => {
        if (cancelled) return;
        const pending = requests.find((request) => request.sessionID === sessionId);
        if (!pending) return;

        // Reset the step flow to the first question when the restored request
        // differs from the one currently shown (or none is shown yet).
        if (!activeQuestionRef.current || activeQuestionRef.current.id !== pending.id) {
          setCurrentQuestionIndex(0);
        }
        setActiveQuestion((prev) => (prev && prev.id === pending.id ? prev : pending));
        setQuestionAnswers((prev) =>
          prev.length === pending.questions.length
            ? prev
            : Array(pending.questions.length).fill(null)
        );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [sessionId, messages]);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    listPendingPermissions()
      .then((requests) => {
        if (cancelled || !requests) return;
        for (const req of requests) {
          if (req.sessionID === sessionId) {
            addPermissionRequest(req);
          }
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [sessionId, addPermissionRequest]);

  useEffect(() => {
    if (!activeQuestion || activeQuestion.questions.length === 0) return;
    if (questionAnswers.length !== activeQuestion.questions.length) return;
    const allAnswered = questionAnswers.every((answer) => answer !== null && answer.length > 0);
    if (!allAnswered) return;

    const requestId = activeQuestion.id;
    const answers = questionAnswers as string[][];
    replyToQuestion(requestId, answers)
      .catch((err) => console.warn('Failed to reply to question:', err))
      .finally(() => setActiveQuestion(null));
  }, [activeQuestion, questionAnswers]);

  if (pendingMessages.size > 0) {
    const kept = getUnconfirmedPending(pendingMessages, messages);
    if (kept.size !== pendingMessages.size) {
      setPendingMessages(kept);
    }
  }

  // A failed send leaves no confirmed message: drop the optimistic pending
  // copy and clear the dedupe guard so the user can immediately retry.
  useEffect(() => {
    if (!sendMessage.isError) return;
    const failedText = lastSentRef.current?.text;
    lastSentRef.current = null;
    if (!failedText) return;
    setPendingMessages((prev) => {
      const next = new Map(prev);
      for (const [id, msg] of prev) {
        if (msg.type === 'user' && msg.text === failedText) {
          next.delete(id);
        }
      }
      return next;
    });
  }, [sendMessage.isError]);

  const keyExtractor = useCallback((item: Message) => item.id, []);
  const getItemType = useCallback((item: Message) => item.type, []);

  const renderMessage = useCallback(
    ({ item }: ListRenderItemInfo<Message>) =>
      item.type === 'user' ? (
        <UserMessage message={item} />
      ) : (
        <AssistantMessage
          message={item}
          isStreaming={streamingIds.has(item.id)}
          isReasoningOpen={isReasoningOpen}
          onToggleReasoning={handleToggleReasoning}
          sessionId={sessionId}
          projectId={projectId}
        />
      ),
    [streamingIds, isReasoningOpen, handleToggleReasoning, sessionId, projectId]
  );

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
          {session?.parentID ? (
            <ParentSessionNotice parentSessionId={session.parentID} projectId={projectId} />
          ) : null}
          {allMessages.length === 0 ? (
            <View className="flex-1 px-4 py-3">
              <EmptyChat />
            </View>
          ) : (
            <FlashList
              ref={listRef}
              style={{ flex: 1 }}
              data={allMessages}
              keyExtractor={keyExtractor}
              getItemType={getItemType}
              renderItem={renderMessage}
              extraData={streamingIds}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                paddingBottom: insets.bottom,
              }}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              ListHeaderComponent={
                isFetchingNextPage ? (
                  <View className="mb-4 items-center py-2">
                    <ActivityIndicator size="small" color="#8f482f" />
                    <Text className="mt-1 text-xs text-[#5e5c54]">Loading older messages…</Text>
                  </View>
                ) : null
              }
              keyboardShouldPersistTaps="handled"
            />
          )}
          <View className="gap-2 border-t border-[#dac1ba]/30 bg-[#fcf9f6] pb-2">
            <View className="flex-row pt-2">
              <ContextBar sessionId={sessionId} onToggleAgent={(v) => setAgent(v)} />
              <SquareLoadingBar isLoading={isBusy} />
            </View>
            {activePermission ? (
              <View className="gap-2 px-4 pt-2">
                <PermissionRequestCard
                  request={activePermission}
                  onResolved={removePermissionRequest}
                />
              </View>
            ) : activeQuestion && currentQuestionIndex < activeQuestion.questions.length ? (
              <View className="gap-2 px-4 pt-2">
                <ChatSelection
                  key={`${activeQuestion.id}-${currentQuestionIndex}`}
                  question={activeQuestion.questions[currentQuestionIndex]}
                  stepLabel={`Question ${currentQuestionIndex + 1} of ${activeQuestion.questions.length}`}
                  onSelect={(labels) => handleQuestionSelect(currentQuestionIndex, labels)}
                  onReject={handleRejectQuestion}
                />
              </View>
            ) : !activeQuestion ? (
              <MessageInput
                sessionId={sessionId}
                agent={agent}
                disabled={sendMessage.isPaused}
                onSend={handleSend}
              />
            ) : null}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}
