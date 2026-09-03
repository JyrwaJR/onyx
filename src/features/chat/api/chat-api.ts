import http from '@utils/http/client';
import {
  CREATE_SESSION,
  GET_SESSION_MESSAGES,
  SEND_SESSION_PROMPT,
  GET_SESSION_BY_ID,
} from '../../../shared/api/endpoints';
import type { Message, Session } from '../../../shared/api/types';

/**
 * Creates a new session for a project.
 *
 * @param projectId - The project to create the session in.
 * @param title - Optional session title.
 * @returns The newly created session.
 */
export async function createSession(projectId: string, title?: string): Promise<Session> {
  const response = await http.post<Session>(CREATE_SESSION, {
    projectID: projectId,
    title: title || undefined,
  });
  return response.data;
}

/**
 * Fetches all messages for a session.
 *
 * @param projectId - The project ID.
 * @param sessionId - The session to fetch messages for.
 * @returns Array of messages (each `{ info, parts }`) sorted by creation time.
 */
export async function fetchMessages(projectId: string, sessionId: string): Promise<Message[]> {
  const response = await http.get<Message[]>(GET_SESSION_MESSAGES(sessionId), {
    params: { projectID: projectId },
  });
  return response.data;
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
 * Sends a message to a session, triggering the AI agent asynchronously.
 *
 * Uses the `/session/:id/prompt_async` endpoint which returns HTTP 204.
 * The response is delivered asynchronously via the session log SSE stream.
 *
 * @param sessionId - The session to send the message to.
 * @param content - The message text content.
 */
export async function sendMessage(sessionId: string, content: string): Promise<void> {
  await http.post(SEND_SESSION_PROMPT(sessionId), {
    parts: [{ type: 'text', text: content }],
  });
}

/**
 * Fetches a single session by ID.
 *
 * @param sessionId - The session ID to fetch.
 * @returns The session details.
 */
export async function fetchSession(sessionId: string): Promise<Session> {
  const response = await http.get<Session>(GET_SESSION_BY_ID(sessionId));
  return response.data;
}
