import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createGlobalSSE, type SSEConnection } from '../../../shared/api/sse';
import { queryKeys } from '../../../shared/api/query-keys';

/** Callback invoked when a streaming delta arrives. */
export type OnDelta = (event: {
  sessionId: string;
  assistantMessageID: string;
  delta: string;
}) => void;

/**
 * Subscribes to the global v1 SSE event stream for a given session.
 *
 * Handles `session.next.text.delta`, `session.next.reasoning.delta`, and
 * `session.next.step.ended` events. Automatically invalidates the messages
 * query cache when a step completes.
 *
 * @param sessionId - The session to subscribe to.
 * @param onDelta - Called on each text/reasoning delta event.
 */
export function useSSE(sessionId: string | undefined, onDelta: OnDelta) {
  const queryClient = useQueryClient();
  // Keep the latest callback without re-subscribing to SSE on every render.
  const onDeltaRef = useRef(onDelta);
  useEffect(() => {
    onDeltaRef.current = onDelta;
  }, [onDelta]);

  useEffect(() => {
    if (!sessionId) return;

    const handleEvent = (event: { type: string; data: string }) => {
      let payload: {
        type?: string;
        properties?: {
          sessionID?: string;
          assistantMessageID?: string;
          delta?: string;
        };
      };
      try {
        payload = JSON.parse(event.data) as typeof payload;
      } catch {
        return;
      }
      // v1 events carry their fields in `properties` (not `data`).
      if (!payload?.properties) return;
      const { sessionID, assistantMessageID, delta } = payload.properties;
      if (sessionID !== sessionId || !assistantMessageID) return;

      const eventType = payload.type;

      if (eventType === 'session.next.text.delta' || eventType === 'session.next.reasoning.delta') {
        onDeltaRef.current({
          sessionId,
          assistantMessageID,
          delta: delta ?? '',
        });
      } else if (eventType === 'session.next.step.ended') {
        queryClient.invalidateQueries({
          queryKey: queryKeys.messages.bySession(sessionId),
        });
      }
    };

    const handleError = (err: Error) => {
      console.warn('SSE error:', err.message);
    };

    const sse: SSEConnection = createGlobalSSE(handleEvent, handleError);

    return () => {
      sse.close();
    };
  }, [sessionId, queryClient]);
}
