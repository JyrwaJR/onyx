import http from '@utils/http/client';
import { isAxiosError } from 'axios';
import {
  CREATE_SESSION,
  DELETE_SESSION_MESSAGE,
  GET_SESSION_MESSAGES,
  GET_QUESTIONS,
  GET_SESSION_TODOS,
  SEND_SESSION_MESSAGE,
  INTERRUPT_SESSION,
  RUN_SHELL_COMMAND,
  QUESTION_REPLY,
  QUESTION_REJECT,
  GET_PERMISSIONS,
  PERMISSION_REPLY,
} from '../../../shared/api/endpoints';
import { mapRawMessageToMessage } from '../../../shared/api/types';
import type { Message, SessionT, RawMessage, Todo } from '../../../shared/api/types';
import type { PermissionReply, PermissionRequest, QuestionRequest } from '../types';

/**
 * Creates a new session.
 *
 * Uses the bare v1 `POST /session` endpoint. The title is set in the
 * request body at creation time — v1 has no separate rename endpoint.
 *
 * The working directory is sent as the v1 `directory` **query parameter**,
 * not in the body: the v1 body schema declares `additionalProperties: false`
 * and accepts no directory/location field, so a body `location` field is
 * silently ignored by the server. When `dir` is empty the param is omitted
 * and the server falls back to its default working directory.
 *
 * @param title - Optional session title.
 * @param dir - Optional absolute working directory for the session.
 * @returns The newly created session.
 */
export async function createSession(title?: string, dir?: string): Promise<SessionT> {
  const response = await http.post<SessionT>(
    CREATE_SESSION,
    title ? { title } : {},
    dir ? { params: { directory: dir } } : {}
  );
  return response.data;
}

/** Default number of messages to load per page. */
export const MESSAGES_PAGE_SIZE = 50;

/** Result from fetching a page of messages. */
export interface FetchMessagesResult {
  /** Messages in ascending chronological order (oldest first within the page). */
  messages: Message[];
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
    const response = await http.get<RawMessage[]>(GET_SESSION_MESSAGES(sessionId), { params });
    const messages = response.data.map(mapRawMessageToMessage);

    return {
      messages,
      before: messages.length === limit ? (messages[0]?.id ?? null) : null,
      usedFallback: false,
    };
  } catch (error) {
    // The v1 server rejects the `before` cursor with HTTP 400 on versions
    // where paging is not implemented. Fall back to the full message list.
    if (isAxiosError(error) && error.response?.status === 400 && before) {
      const response = await http.get<RawMessage[]>(GET_SESSION_MESSAGES(sessionId));
      return {
        messages: response.data.map(mapRawMessageToMessage),
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
 * Runs a shell command in a session.
 *
 * Uses the v1 `POST /session/:id/shell` endpoint.
 *
 * @param sessionId - The session ID.
 * @param command - The shell command to run.
 * @param agent - The agent to run the command with.
 */
export async function runShellCommand(
  sessionId: string,
  command: string,
  agent: string = 'build'
): Promise<void> {
  await http.post(RUN_SHELL_COMMAND(sessionId), {
    command,
    agent,
  });
}

/**
 * Interrupts an active session.
 *
 * Uses the v1 `POST /session/:id/abort` endpoint.
 *
 * @param sessionId - The session to interrupt.
 */
export async function abortSession(sessionId: string): Promise<void> {
  await http.post(INTERRUPT_SESSION(sessionId));
}

/**
 * Lists all pending question requests across all sessions.
 *
 * Uses the v1 `GET /question` endpoint. Pending requests are kept server-side
 * until answered or rejected, so this restores unanswered questions that were
 * asked before the app subscribed to the live SSE stream (e.g. when entering
 * an existing chat whose last message is an unanswered question).
 *
 * @returns The pending question requests across all sessions. Filter by
 * `sessionID` to find the requests belonging to one chat.
 */
export async function listPendingQuestions(): Promise<QuestionRequest[]> {
  const response = await http.get<QuestionRequest[]>(GET_QUESTIONS);
  return response.data;
}

/**
 * Replies to a pending question request from the assistant.
 *
 * Uses the v1 `POST /question/:id/reply` endpoint. `answers` must contain
 * exactly one entry per question (in the same order as the request), each
 * entry being an array of selected option labels.
 *
 * @param requestId - The question request ID (`^que`).
 * @param answers - Selected option labels per question, in question order.
 */
export async function replyToQuestion(requestId: string, answers: string[][]): Promise<void> {
  await http.post(QUESTION_REPLY(requestId), { answers });
}

/**
 * Rejects a pending question request from the assistant.
 *
 * Uses the v1 `POST /question/:id/reject` endpoint. The assistant continues
 * without an answer for the rejected question.
 *
 * @param requestId - The question request ID (`^que`).
 */
export async function rejectQuestion(requestId: string): Promise<void> {
  await http.post(QUESTION_REJECT(requestId));
}

/**
 * Lists all pending permission requests across all sessions.
 *
 * Uses the v1 `GET /permission` endpoint. Pending requests are kept
 * server-side until answered, so this restores unhandled permission requests
 * that arrived before the app subscribed to the live SSE stream (e.g. when
 * entering an existing chat whose last message is an unanswered permission).
 *
 * @returns The pending permission requests across all sessions. Filter by
 * `sessionID` to find the requests belonging to one chat.
 */
export async function listPendingPermissions(): Promise<PermissionRequest[]> {
  const response = await http.get<PermissionRequest[]>(GET_PERMISSIONS);
  return response.data;
}

/**
 * Replies to a pending permission request from the assistant.
 *
 * Uses the v1 `POST /permission/:id/reply` endpoint. `reply` controls how
 * the server applies the decision: `once` allows the action a single time,
 * `always` records it in the session's allow-list, and `reject` denies the
 * action. `message` is an optional note sent back to the assistant.
 *
 * The underlying HTTP client rejects on non-2xx responses, so a failed
 * reply throws here — callers must not treat the request as resolved unless
 * this resolves successfully.
 *
 * @param requestId - The permission request ID (`^per`).
 * @param reply - The decision for this permission request.
 * @param message - Optional message to include with the reply.
 * @throws When the server reports a failed reply (non-2xx response).
 */
export async function replyToPermission(
  requestId: string,
  reply: PermissionReply,
  message?: string
): Promise<void> {
  await http.post(PERMISSION_REPLY(requestId), {
    reply,
    ...(message ? { message } : {}),
  });
}

/**
 * Fetches the todo list for a session.
 *
 * Uses the v1 `GET /session/:id/todo` endpoint, which returns a plain
 * `Todo[]` array (no pagination envelope).
 *
 * @param sessionId - The session to fetch todos for.
 * @returns The session's todo list.
 */
export async function fetchTodos(sessionId: string): Promise<Todo[]> {
  const response = await http.get<Todo[]>(GET_SESSION_TODOS(sessionId));
  return response.data;
}
