/**
 * @file SSE client wrapper for real-time event streaming.
 *
 * Uses `react-native-sse` to create a Server-Sent Events connection to the
 * OpenCode server's global v1 event stream (`/event`).
 *
 * The v1 stream emits `Event` objects serialized as JSON with the shape
 * `{ id, type, properties: { timestamp?, sessionID?, assistantMessageID?,
 * textID?, delta? } }`. Event types include `session.next.text.delta`,
 * `session.next.reasoning.delta` (live streaming deltas), and
 * `session.next.step.ended` (completion).
 */

import EventSource from 'react-native-sse';
import { getApiBaseUrl } from '@utils/http/constants';
import { GLOBAL_EVENT_STREAM } from './endpoints';

/** Callback type for SSE events. */
export type SSEEventHandler = (event: { type: string; data: string }) => void;

/** SSE connection handle. Call close() to disconnect. */
export interface SSEConnection {
  close: () => void;
}

/**
 * Creates an SSE connection to the global v1 event stream.
 * Receives all session events (including live streaming deltas).
 *
 * @param onEvent - Callback fired for each SSE event.
 * @param onError - Callback fired on connection errors.
 * @returns SSEConnection handle with close() method.
 */
export function createGlobalSSE(
  onEvent: SSEEventHandler,
  onError?: (error: Error) => void
): SSEConnection {
  const url = `${getApiBaseUrl()}${GLOBAL_EVENT_STREAM}`;
  const es = new EventSource(url, {
    headers: { Accept: 'text/event-stream' },
    pollingInterval: 2500,
  });

  es.addEventListener('message', (event: { type?: string; data?: unknown }) => {
    const raw = event.data as unknown;
    if (raw != null) {
      onEvent({ type: event.type ?? 'message', data: String(raw) });
    }
  });

  es.addEventListener('error', (event: unknown) => {
    if (onError) {
      onError(new Error(String(event)));
    }
  });

  return { close: () => es.close() };
}
