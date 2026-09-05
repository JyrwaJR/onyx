import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createGlobalSSE, type SSEConnection } from '../../../shared/api/sse';
import { queryKeys } from '../../../shared/api/query-keys';
import { type Event, type PermissionRequest } from '../types';
import { useChatStore } from '../store/chat-store';

/** Callback invoked when a streaming delta arrives. */
export type OnDelta = (event: {
  sessionId: string;
  assistantMessageID: string;
  delta: string;
}) => void;

/**
 * Subscribes to the global v1 SSE event stream for a given session.
 *
 * Handles `session.next.text.delta`, `session.next.reasoning.delta`,
 * `session.next.step.ended`, and `permission.requested` events.
 * Automatically invalidates the messages query cache when a step completes.
 *
 * @param sessionId - The session to subscribe to.
 * @param onDelta - Called on each text/reasoning delta event.
 */
export function useSSE(sessionId: string | undefined, onDelta: OnDelta) {
  const queryClient = useQueryClient();
  const addPermissionRequest = useChatStore((state) => state.addPermissionRequest);
  // Keep the latest callback without re-subscribing to SSE on every render.
  const onDeltaRef = useRef(onDelta);
  useEffect(() => {
    onDeltaRef.current = onDelta;
  }, [onDelta]);

  useEffect(() => {
    if (!sessionId) return;

    const handleEvent = (event: { type: string; data: string }) => {
      let eventPayload: Event;
      try {
        eventPayload = JSON.parse(event.data) as Event;
      } catch {
        return;
      }

      const { payload } = eventPayload;
      if (!payload) return;

      if (
        payload.type === 'session.next.text.delta' ||
        payload.type === 'session.next.reasoning.delta'
      ) {
        const { sessionID, assistantMessageID, delta } = payload.properties as {
          sessionID: string;
          assistantMessageID: string;
          delta: string;
        };

        if (sessionID !== sessionId || !assistantMessageID) return;

        onDeltaRef.current({
          sessionId,
          assistantMessageID,
          delta: delta ?? '',
        });
      } else if (payload.type === 'session.next.step.ended') {
        const { sessionID } = payload.properties as { sessionID: string };
        if (sessionID !== sessionId) return;

        queryClient.invalidateQueries({
          queryKey: queryKeys.messages.bySession(sessionId),
        });
      } else if (payload.type === 'permission.requested') {
        const { request } = payload.properties as { request: PermissionRequest };
        if (request.sessionId !== sessionId) return;

        addPermissionRequest(request);
      }
    };

    const handleError = (err: Error) => {
      console.warn('SSE error:', err.message);
    };

    const sse: SSEConnection = createGlobalSSE(handleEvent, handleError);

    return () => {
      sse.close();
    };
  }, [sessionId, queryClient, addPermissionRequest]);
}
