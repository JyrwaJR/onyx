import http from '@utils/http/client';
import {
  CREATE_SESSION,
  GET_SESSION_MESSAGES,
  SEND_SESSION_PROMPT,
  GET_SESSION_BY_ID,
} from '../../../shared/api/endpoints';
import type { ApiData, SessionT, V2Message } from '../../../shared/api/types';

/**
 * Creates a new session for a project.
 *
 * Uses V2 `POST /api/session` per the OpenCode OpenAPI spec.
 * Body: `{ id?, agent?, model?, location?, metadata? }` (no title in create).
 * If a title is provided, the session is renamed via POST /api/session/:id/rename
 * immediately after creation.
 *
 * @param projectId - The project to create the session in.
 * @param title - Optional session title (set via rename after creation).
 * @returns The newly created session.
 */
export async function createSession(projectId: string, title?: string): Promise<SessionT> {
  const response = await http.post<ApiData<SessionT>>(
    CREATE_SESSION,
    {},
    { params: { projectID: projectId } }
  );
  const session = response.data.data;

  // If a title was provided, rename the session after creation
  if (title) {
    const renameResponse = await http.post<ApiData<SessionT>>(`/api/session/${session.id}/rename`, {
      title,
    });
    return renameResponse.data.data;
  }

  return session;
}

/** Default number of messages to load per page. */
export const MESSAGES_PAGE_SIZE = 20;

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
 * Returns the most recent `limit` messages in descending order (newest first)
 * by default. Pass the `cursor.next` value from a previous call to fetch
 * older messages.
 *
 * @param projectId - The project ID.
 * @param sessionId - The session to fetch messages for.
 * @param cursor - Optional cursor value for fetching the next page.
 * @param limit - Maximum messages per page (default 20).
 * @returns Messages array and pagination cursor.
 */
export async function fetchMessages(
  projectId: string,
  sessionId: string,
  cursor?: string,
  limit: number = MESSAGES_PAGE_SIZE
): Promise<FetchMessagesResult> {
  const params: Record<string, string | number> = {
    order: 'desc',
    limit,
  };
  if (cursor) {
    params.cursor = cursor;
  }

  console.log(
    `[chat-api] fetchMessages session=${sessionId} limit=${limit} cursor=${cursor ?? 'none'}`
  );

  const response = await http.get<ApiData<V2Message[]>>(GET_SESSION_MESSAGES(sessionId), {
    params,
  });

  console.log(`[chat-api] fetchMessages got ${response.data.data?.length ?? 0} messages`);

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
 * Uses the V2 `POST /api/session/:id/prompt` endpoint with a `PromptInput`
 * body per the OpenCode OpenAPI spec:
 *
 * ```json
 * { "prompt": { "text": "message content" } }
 * ```
 *
 * @param sessionId - The session to send the message to.
 * @param content - The message text content.
 */
export async function sendMessage(sessionId: string, content: string): Promise<void> {
  await http.post(SEND_SESSION_PROMPT(sessionId), {
    prompt: { text: content },
  });
}

/**
 * Fetches a single session by ID.
 *
 * @param sessionId - The session ID to fetch.
 * @returns The session details.
 */
export async function fetchSession(sessionId: string): Promise<SessionT> {
  const response = await http.get<ApiData<SessionT>>(GET_SESSION_BY_ID(sessionId));
  return response.data.data;
}
