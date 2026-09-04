/**
 * @file SSE client wrapper for real-time event streaming.
 *
 * Uses `react-native-sse` to create Server-Sent Events connections
 * to the OpenCode server's log and event streams.
 */

import EventSource from 'react-native-sse';
import { getApiBaseUrl } from '@utils/http/constants';
import { SESSION_LOG_STREAM, GLOBAL_EVENT_STREAM } from './endpoints';

/** Callback type for SSE events. */
export type SSEEventHandler = (event: { type: string; data: string }) => void;

/** SSE connection handle. Call close() to disconnect. */
export interface SSEConnection {
  close: () => void;
}

/**
 * Creates an SSE connection to a session's log stream.
 * Receives real-time events as the agent processes a prompt.
 *
 * @param sessionId - The session to subscribe to.
 * @param onEvent - Callback fired for each SSE event.
 * @param onError - Callback fired on connection errors.
 * @returns SSEConnection handle with close() method.
 */
export function createSessionSSE(
  sessionId: string,
  onEvent: SSEEventHandler,
  onError?: (error: Error) => void
): SSEConnection {
  const url = `${getApiBaseUrl()}${SESSION_LOG_STREAM(sessionId)}`;
  console.log('[SSE] Connecting to:', url);
  const es = new EventSource(url, {
    headers: { Accept: 'text/event-stream' },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  es.addEventListener('message', (event: any) => {
    console.log('[SSE] Received event:', event.type, event.data);
    if (event.data != null) {
      onEvent({ type: event.type, data: String(event.data) });
    }
  });

  es.addEventListener('error', (event: unknown) => {
    console.error('[SSE] Error:', event);
    if (onError) {
      onError(new Error(String(event)));
    }
  });

  return { close: () => es.close() };
}

/**
 * Creates an SSE connection to the global event stream.
 * Receives all server events across all sessions.
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
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  es.addEventListener('message', (event: any) => {
    if (event.data != null) {
      onEvent({ type: event.type, data: String(event.data) });
    }
  });

  es.addEventListener('error', (event: unknown) => {
    if (onError) {
      onError(new Error(String(event)));
    }
  });

  return { close: () => es.close() };
}
