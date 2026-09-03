/**
 * @file API endpoint path constants.
 *
 * All OpenCode server endpoint paths are centralized here as
 * SCREAMING_SNAKE_CASE constants. No hardcoded strings should
 * appear in hooks, stores, or components.
 */

/** Health check endpoint. */
export const HEALTH_CHECK = '/api/health';

/** List all projects. */
export const GET_PROJECTS = '/api/project';

/** Get project by ID. Template: `GET_PROJECT_BY_ID(projectId)`. */
export const GET_PROJECT_BY_ID = (projectId: string) => `/api/project/${projectId}` as const;

/** Fork a project by ID. Template: `FORK_PROJECT(projectId)`. */
export const FORK_PROJECT = (projectId: string) => `/api/project/${projectId}/fork` as const;

/** Get current active project. */
export const GET_CURRENT_PROJECT = '/api/project/current';

/** List all sessions. */
export const GET_SESSIONS = '/api/session';

/** Create a new session. */
export const CREATE_SESSION = '/api/session';

/** Delete a session by ID. Template: `DELETE_SESSION(sessionId)`. */
export const DELETE_SESSION = (sessionId: string) => `/api/session/${sessionId}` as const;

/** Get messages for a session. */
export const GET_SESSION_MESSAGES = (sessionId: string) =>
  `/api/session/${sessionId}/message` as const;

/** Send a prompt to a session. */
export const SEND_SESSION_PROMPT = (sessionId: string) =>
  `/api/session/${sessionId}/prompt` as const;

/** Interrupt an active session. */
export const INTERRUPT_SESSION = (sessionId: string) =>
  `/api/session/${sessionId}/interrupt` as const;

/** SSE log stream for a session. */
export const SESSION_LOG_STREAM = (sessionId: string) => `/api/session/${sessionId}/log` as const;

/** Global event stream (SSE). */
export const GLOBAL_EVENT_STREAM = '/api/event';
