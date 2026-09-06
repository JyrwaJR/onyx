import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createGlobalSSE, type SSEConnection } from '../../../shared/api/sse';
import { queryKeys } from '../../../shared/api/query-keys';
import { type Event, type PermissionRequest, type QuestionRequest } from '../types';
import { useChatStore } from '../store/chat-store';
import { useSubagentStore } from '../store/subagent-store';
import { normalizeSessionCreated, normalizeSubagentToolPart } from '../utils/subagent-events';

/** Callback invoked when a streaming delta arrives. */
export type OnDelta = (event: {
  sessionId: string;
  assistantMessageID: string;
  delta: string;
}) => void;

/** Callback invoked when the assistant asks an interactive question. */
export type OnQuestion = (request: QuestionRequest) => void;

/**
 * Callback invoked when a message finishes streaming (the authoritative
 * `message.updated` event). Receives the message ID that was streaming, or
 * `null` when no stream was tracked. Consumers use it to drop local streaming
 * state so the refetched server copy takes over.
 */
export type OnComplete = (messageId: string | null) => void;

/**
 * Subscribes to the global v1 SSE event stream for a given session.
 *
 * Handles the live v1 wire events (`message.part.delta`,
 * `message.updated`, `question.asked`) plus the legacy
 * `session.next.*` events and `permission.requested`. Automatically
 * invalidates the messages query cache when a message is updated or a
 * step completes.
 *
 * @param sessionId - The session to subscribe to.
 * @param onDelta - Called on each text/reasoning delta event.
 * @param onQuestion - Called when the assistant asks an interactive question.
 * @param onComplete - Called when a message is finalized (`message.updated`).
 */
export function useSSE(
  sessionId: string | undefined,
  onDelta: OnDelta,
  onQuestion?: OnQuestion,
  onComplete?: OnComplete
) {
  const queryClient = useQueryClient();
  const addPermissionRequest = useChatStore((state) => state.addPermissionRequest);
  const startStreaming = useChatStore((state) => state.startStreaming);
  const finishStreaming = useChatStore((state) => state.finishStreaming);
  const registerChildSession = useSubagentStore((state) => state.registerChildSession);
  const registerToolPartStatus = useSubagentStore((state) => state.registerToolPartStatus);

  // Keep the latest callback without re-subscribing to SSE on every render.
  const onDeltaRef = useRef(onDelta);
  useEffect(() => {
    onDeltaRef.current = onDelta;
  }, [onDelta]);

  const onQuestionRef = useRef(onQuestion);
  useEffect(() => {
    onQuestionRef.current = onQuestion;
  }, [onQuestion]);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!sessionId) return;

    const handleEvent = (event: { type: string; data: string }) => {
      let raw: Event;
      try {
        raw = JSON.parse(event.data) as Event;
      } catch {
        return;
      }

      // Live v1 wire format: `{ id, type, properties }` at the top level.
      // Legacy GlobalEvent format: `{ directory?, payload: { type, properties } }`.
      const isLegacy = raw.payload != null && typeof raw.payload.type === 'string';
      const type = isLegacy ? raw.payload?.type : raw.type;
      const properties = isLegacy ? raw.payload?.properties : raw.properties;
      if (!type || !properties) return;

      if (type === 'session.next.text.delta' || type === 'session.next.reasoning.delta') {
        const { sessionID, assistantMessageID, delta } = properties as {
          sessionID: string;
          assistantMessageID: string;
          delta: string;
        };

        if (sessionID !== sessionId || !assistantMessageID) return;

        // Mark the AI response as streaming so the busy indicator and the
        // refetch intervals reflect that a generation is in flight.
        startStreaming(sessionId, assistantMessageID);

        onDeltaRef.current({
          sessionId,
          assistantMessageID,
          delta: delta ?? '',
        });
      } else if (type === 'message.part.delta') {
        const { sessionID, messageID, field, delta } = properties as {
          sessionID: string;
          messageID: string;
          field: string;
          delta: string;
        };

        // Only live text tokens are forwarded; reasoning/tool parts arrive
        // as full `message.part.updated` payloads and surface on refetch.
        if (sessionID !== sessionId || !messageID || field !== 'text') return;
        if (delta == null) return;

        startStreaming(sessionId, messageID);

        onDeltaRef.current({
          sessionId,
          assistantMessageID: messageID,
          delta: String(delta),
        });
      } else if (type === 'session.next.step.ended' || type === 'message.updated') {
        // Completion signal: legacy step.ended or the current message.updated.
        // Capture the streamed message ID before `finishStreaming()` nulls it.
        const finalMessageId = useChatStore.getState().streamingMessageId;
        finishStreaming();
        queryClient.invalidateQueries({
          queryKey: queryKeys.messages.bySession(sessionId),
        });
        // Only the authoritative `message.updated` finalizes the message;
        // legacy `step.ended` may be followed by further deltas for the same
        // or a new message, so it must not drop local streaming state.
        if (type === 'message.updated') {
          onCompleteRef.current?.(finalMessageId);
        }
      } else if (type === 'question.asked') {
        const request = properties as QuestionRequest;
        if (request.sessionID !== sessionId) return;

        onQuestionRef.current?.(request);
      } else if (type === 'permission.requested') {
        const { request } = properties as { request: PermissionRequest };
        if (request.sessionId !== sessionId) return;

        addPermissionRequest(request);
      } else if (type === 'session.created') {
        // Authoritative signal that a subagent spawned: the new session's
        // `info.parentID` points back to this chat's session.
        const child = normalizeSessionCreated(properties);
        if (child && child.parentID === sessionId) {
          registerChildSession(child);
        }
      } else if (type === 'message.part.updated') {
        // Tool parts for task/agent carry the subagent's name, description,
        // and status; claim/update the matching child session.
        const part = normalizeSubagentToolPart(properties);
        if (part && part.sessionID === sessionId) {
          registerToolPartStatus(sessionId, part);
          // Refresh the message list so the mid-run tool block appears live
          // (not only after the step completes / next `message.updated`).
          queryClient.invalidateQueries({ queryKey: queryKeys.messages.bySession(sessionId) });
        }
      }
    };

    const handleError = (err: Error) => {
      console.warn('SSE error:', err.message);
    };

    const sse: SSEConnection = createGlobalSSE(handleEvent, handleError);

    return () => {
      sse.close();
    };
  }, [
    sessionId,
    queryClient,
    addPermissionRequest,
    startStreaming,
    finishStreaming,
    registerChildSession,
    registerToolPartStatus,
  ]);
}
