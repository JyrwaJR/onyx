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
    {
      data: { title: title || undefined },
    },
    {
      params: { projectID: projectId },
    }
  );
  return response.data.data;
}

/**
 * Fetches all messages for a session (V2 format).
 *
 * @param projectId - The project ID.
 * @param sessionId - The session to fetch messages for.
 * @returns Array of V2 messages sorted by creation time.
 */
export async function fetchMessages(projectId: string, sessionId: string): Promise<V2Message[]> {
  const response = await http.get<ApiData<V2Message[]>>(GET_SESSION_MESSAGES(sessionId), {
    params: { limit: 20 },
  });
  return response.data.data;
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
