import http from '@utils/http/client';
import {
  CREATE_SESSION,
  GET_SESSION_MESSAGES,
  SEND_SESSION_PROMPT,
  GET_SESSION_BY_ID,
} from '../../../shared/api/endpoints';
import type { ApiData, Session, V2Message } from '../../../shared/api/types';

/** Generate a unique message id in the server's expected `msg_` format. */
function newMessageId(): string {
  return `msg_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Creates a new session for a project.
 *
 * Uses V2 `POST /api/session` with `{ data: { title } }` body per http/03-session.http.
 * Project association is passed as a query parameter.
 *
 * @param projectId - The project to create the session in.
 * @param title - Optional session title.
 * @returns The newly created session.
 */
export async function createSession(projectId: string, title?: string): Promise<Session> {
  const response = await http.post<ApiData<Session>>(
    CREATE_SESSION,
    { data: { title: title || undefined } },
    { params: { projectID: projectId } }
  );
  return response.data.data;
}

/** Result from fetching messages with cursor-based pagination. */
export interface FetchMessagesResult {
  /** Messages in descending chronological order (newest first). */
  messages: V2Message[];
  /** Pagination cursor. Pass `next` value as cursor to fetch older messages. */
  cursor: { previous: string | null; next: string | null } | null;
}

/**
 * Fetches messages for a session (V2 format) with cursor-based pagination.
 *
 * Returns messages in descending order (newest first) by default.
 * Pass the `cursor.next` value from a previous call to fetch older messages.
 *
 * @param projectId - The project ID.
 * @param sessionId - The session to fetch messages for.
 * @param cursor - Optional cursor value for fetching the next page.
 * @returns Messages array and pagination cursor.
 */
export async function fetchMessages(
  projectId: string,
  sessionId: string,
  cursor?: string
): Promise<FetchMessagesResult> {
  const params: Record<string, string> = { order: 'desc' };
  if (cursor) {
    params.cursor = cursor;
  }
  const response = await http.get<ApiData<V2Message[]>>(GET_SESSION_MESSAGES(sessionId), {
    params,
  });
  return {
    messages: response.data.data,
    cursor: response.data.cursor ?? null,
  };
}

/**
 * Deletes a specific message from a session.
 *
 * @param projectId - The project ID.
 * @param sessionId - The session ID.
 * @param messageId - The message to delete.
 */
export async function deleteMessage(
  projectId: string,
  sessionId: string,
  messageId: string
): Promise<void> {
  await http.delete(`${GET_SESSION_MESSAGES(sessionId)}/${messageId}`, {
    params: { projectID: projectId },
  });
}

/**
 * Sends a message to a session, triggering the AI agent.
 *
 * Uses the V2 `/api/session/:id/prompt` endpoint with a `msg_` prefixed id.
 * Body format per http/03-session.http: `{ id, data: { type: "user", text } }`.
 *
 * @param sessionId - The session to send the message to.
 * @param content - The message text content.
 */
export async function sendMessage(sessionId: string, content: string): Promise<void> {
  await http.post(SEND_SESSION_PROMPT(sessionId), {
    id: newMessageId(),
    data: { type: 'user', text: content },
  });
}

/**
 * Fetches a single session by ID.
 *
 * @param sessionId - The session ID to fetch.
 * @returns The session details.
 */
export async function fetchSession(sessionId: string): Promise<Session> {
  const response = await http.get<ApiData<Session>>(GET_SESSION_BY_ID(sessionId));
  return response.data.data;
}
