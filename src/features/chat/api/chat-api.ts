import http from '@utils/http/client';
import { isAxiosError } from 'axios';
import {
  CREATE_SESSION,
  DELETE_SESSION_MESSAGE,
  GET_SESSION_BY_ID,
  GET_SESSION_MESSAGES,
  SEND_SESSION_MESSAGE,
} from '../../../shared/api/endpoints';
import { mapV1MessageToV2Message } from '../../../shared/api/types';
import type { Message, SessionT, V2Message } from '../../../shared/api/types';

/**
 * Creates a new session.
 *
 * Uses the bare v1 `POST /session` endpoint. The title is set in the
 * request body at creation time — v1 has no separate rename endpoint.
 *
 * @param title - Optional session title.
 * @returns The newly created session.
 */
export async function createSession(title?: string): Promise<SessionT> {
  const response = await http.post<SessionT>(CREATE_SESSION, title ? { title } : {});
  return response.data;
}

/** Default number of messages to load per page. */
export const MESSAGES_PAGE_SIZE = 50;

/** Result from fetching a page of messages. */
export interface FetchMessagesResult {
  /** Messages in ascending chronological order (oldest first within the page). */
  messages: V2Message[];
  /**
   * Pagination cursor for loading older messages: the oldest message ID in
   * this page. Pass it as `before` to fetch the previous page. `null` when
   * no older messages exist (or when the fallback full fetch was used).
   */
  before: string | null;
  /**
   * True when the server rejected the `before` cursor (HTTP 400) and this
   * call fell back to fetching the complete message list without pagination.
   */
  usedFallback: boolean;
}

/**
 * Fetches messages for a session using the v1 `GET /session/:id/message`
 * endpoint.
 *
 * The v1 server returns a plain `Message[]` array in ascending order and
 * only supports `limit` + `before` cursoring; it rejects `before` with
 * HTTP 400 on versions where the field is unimplemented. When that happens
 * this function falls back to fetching the complete list (no pagination),
 * which is a superset of any previously loaded pages.
 *
 * @param sessionId - The session to fetch messages for.
 * @param before - Optional oldest message ID to page before (older messages).
 * @param limit - Maximum messages per page (default 50).
 * @returns The page of mapped messages plus the next `before` cursor.
 */
export async function fetchMessages(
  sessionId: string,
  before?: string,
  limit: number = MESSAGES_PAGE_SIZE
): Promise<FetchMessagesResult> {
  const params: Record<string, string | number> = { limit };
  if (before) {
    params.before = before;
  }

  try {
    const response = await http.get<Message[]>(GET_SESSION_MESSAGES(sessionId), { params });
    const messages = response.data.map(mapV1MessageToV2Message);

    return {
      messages,
      before: messages.length === limit ? (messages[0]?.id ?? null) : null,
      usedFallback: false,
    };
  } catch (error) {
    // The v1 server rejects the `before` cursor with HTTP 400 on versions
    // where paging is not implemented. Fall back to the full message list.
    if (isAxiosError(error) && error.response?.status === 400 && before) {
      const response = await http.get<Message[]>(GET_SESSION_MESSAGES(sessionId));
      return {
        messages: response.data.map(mapV1MessageToV2Message),
        before: null,
        usedFallback: true,
      };
    }
    throw error;
  }
}

/**
 * Deletes a specific message from a session.
 *
 * Uses the bare v1 `DELETE /session/:id/message/:messageID` endpoint.
 *
 * @param sessionId - The session ID.
 * @param messageId - The message to delete.
 */
export async function deleteMessage(sessionId: string, messageId: string): Promise<void> {
  await http.delete(DELETE_SESSION_MESSAGE(sessionId, messageId));
}

/**
 * Sends a message to a session, triggering the AI agent.
 *
 * Uses the v1 `POST /session/:id/message` endpoint with a `{ parts }`
 * message body:
 *
 * ```json
 * { "parts": [{ "type": "text", "text": "message content" }] }
 * ```
 *
 * @param sessionId - The session to send the message to.
 * @param content - The message text content.
 */
export async function sendMessage(sessionId: string, content: string): Promise<void> {
  await http.post(SEND_SESSION_MESSAGE(sessionId), {
    parts: [{ type: 'text', text: content }],
  });
}

/**
 * Fetches a single session by ID.
 *
 * @param sessionId - The session ID to fetch.
 * @returns The session details.
 */
export async function fetchSession(sessionId: string): Promise<SessionT> {
  const response = await http.get<SessionT>(GET_SESSION_BY_ID(sessionId));
  return response.data;
}
