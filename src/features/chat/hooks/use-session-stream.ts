import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createGlobalSSE, type SSEConnection } from '../../../shared/api/sse';
import { queryKeys } from '../../../shared/api/query-keys';
import { type Event, type PermissionRequest, type QuestionRequest } from '../types';
import { useChatStore } from '../store/chat-store';
import { useSubagentStore } from '../store/subagent-store';
import { normalizeSessionCreated, normalizeSubagentToolPart } from '../utils/subagent-events';

export type SSEConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error';

export type OnDelta = (event: {
  sessionId: string;
  assistantMessageID: string;
  delta: string;
}) => void;

export type OnQuestion = (request: QuestionRequest) => void;
export type OnComplete = (messageId: string | null) => void;

interface UseSessionStreamOptions {
  sessionId: string | undefined;
  onDelta?: OnDelta;
  onQuestion?: OnQuestion;
  onComplete?: OnComplete;
  enabled?: boolean;
}

function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

type ParsedEvent = {
  type: string;
  properties: Record<string, unknown>;
};

function parseSSEEvent(rawData: string): ParsedEvent | null {
  try {
    const raw = JSON.parse(rawData) as Event;
    const isLegacy = raw.payload != null && typeof raw.payload.type === 'string';
    const type = isLegacy ? raw.payload?.type : raw.type;
    const properties = isLegacy ? raw.payload?.properties : raw.properties;

    if (!type || !properties) return null;
    return { type, properties };
  } catch {
    return null;
  }
}

export function useSessionStream({
  sessionId,
  onDelta,
  onQuestion,
  onComplete,
  enabled = true,
}: UseSessionStreamOptions) {
  const queryClient = useQueryClient();
  const [connectionState, setConnectionState] = useState<SSEConnectionStatus>('connecting');
  const [error, setError] = useState<Error | null>(null);

  // Derive 'idle' state during render instead of calling setState in effect
  const status: SSEConnectionStatus = !sessionId || !enabled ? 'idle' : connectionState;

  // Zustand Store Actions
  const addPermissionRequest = useChatStore((state) => state.addPermissionRequest);
  const removePermissionRequest = useChatStore((state) => state.removePermissionRequest);
  const startStreaming = useChatStore((state) => state.startStreaming);
  const finishStreaming = useChatStore((state) => state.finishStreaming);
  const registerChildSession = useSubagentStore((state) => state.registerChildSession);
  const registerToolPartStatus = useSubagentStore((state) => state.registerToolPartStatus);

  // Stable callback references
  const onDeltaRef = useLatest(onDelta);
  const onQuestionRef = useLatest(onQuestion);
  const onCompleteRef = useLatest(onComplete);

  // Fix 1: Environment-agnostic timer type (Browser / React Native compatible)
  const invalidationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleQueryInvalidation = useCallback(() => {
    if (!sessionId) return;
    if (invalidationTimerRef.current) return;

    invalidationTimerRef.current = setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
      invalidationTimerRef.current = null;
    }, 150);
  }, [sessionId, queryClient]);

  useEffect(() => {
    // Fix 2: Early return without synchronous setState
    if (!sessionId || !enabled) return;

    // Queue connection state update asynchronously to avoid cascading render warnings
    queueMicrotask(() => {
      setConnectionState('connecting');
      setError(null);
    });

    const handleEvent = (event: { type: string; data: string }) => {
      setConnectionState('connected');

      const parsed = parseSSEEvent(event.data);
      if (!parsed) return;

      const { type, properties } = parsed;

      switch (type) {
        case 'session.next.text.delta':
        case 'session.next.reasoning.delta': {
          const sessionID = properties.sessionID as string;
          const assistantMessageID = properties.assistantMessageID as string;
          const delta = (properties.delta as string) ?? '';

          if (sessionID !== sessionId || !assistantMessageID) return;

          startStreaming(sessionId, assistantMessageID);
          onDeltaRef.current?.({ sessionId, assistantMessageID, delta });
          break;
        }

        case 'message.part.delta': {
          const sessionID = properties.sessionID as string;
          const messageID = properties.messageID as string;
          const field = properties.field as string;
          const delta = properties.delta;

          if (sessionID !== sessionId || !messageID || field !== 'text' || delta == null) return;

          startStreaming(sessionId, messageID);
          onDeltaRef.current?.({
            sessionId,
            assistantMessageID: messageID,
            delta: String(delta),
          });
          break;
        }

        case 'session.next.step.ended':
        case 'message.updated': {
          const finalMessageId = useChatStore.getState().streamingMessageId;
          finishStreaming();
          scheduleQueryInvalidation();

          if (type === 'message.updated') {
            onCompleteRef.current?.(finalMessageId);
          }
          break;
        }

        case 'question.asked': {
          const request = properties as unknown as QuestionRequest;
          if (request.sessionID === sessionId) {
            onQuestionRef.current?.(request);
          }
          break;
        }

        case 'permission.asked': {
          const request = properties as unknown as PermissionRequest;
          if (request.sessionID === sessionId) {
            addPermissionRequest(request);
          }
          break;
        }

        case 'permission.replied': {
          const requestID = properties.requestID as string;
          removePermissionRequest(requestID);
          scheduleQueryInvalidation();
          break;
        }

        case 'session.created': {
          const child = normalizeSessionCreated(properties);
          if (child && child.parentID === sessionId) {
            registerChildSession(child);
          }
          break;
        }

        case 'message.part.updated': {
          const part = normalizeSubagentToolPart(properties);
          if (part && part.sessionID === sessionId) {
            registerToolPartStatus(sessionId, part);
            scheduleQueryInvalidation();
          }
          break;
        }
      }
    };

    const handleError = (err: Error) => {
      setConnectionState('error');
      setError(err);
      console.warn(`[SSE Stream Error] Session (${sessionId}):`, err.message);
    };

    const sse: SSEConnection = createGlobalSSE(handleEvent, handleError);

    return () => {
      if (invalidationTimerRef.current) {
        clearTimeout(invalidationTimerRef.current);
        invalidationTimerRef.current = null;
      }

      finishStreaming();
      sse.close();
    };
  }, [
    sessionId,
    enabled,
    addPermissionRequest,
    removePermissionRequest,
    startStreaming,
    finishStreaming,
    registerChildSession,
    registerToolPartStatus,
    scheduleQueryInvalidation,
    onDeltaRef,
    onQuestionRef,
    onCompleteRef,
  ]);

  return {
    status,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    isError: status === 'error',
    error,
  };
}
