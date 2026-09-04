/**
 * @file API endpoint path constants.
 *
 * All OpenCode server endpoint paths are centralized here as
 * SCREAMING_SNAKE_CASE constants. No hardcoded strings should
 * appear in hooks, stores, or components.
 *
 * Paths were verified against a live server (v1.18.10) on 2026-09-04.
 * The OpenCode server exposes a mix of legacy and `/api` (V2) routes:
 * - Project/session *listing* uses the legacy routes (no `/api` prefix).
 * - Session *creation*, message *read/write*, prompt, and the SSE event
 *   stream use the V2 routes (prefixed with `/api`).
 */

/** Server health check endpoint. Returns `{ healthy: boolean; version?: string }`. */
export const HEALTH_CHECK = '/global/health';

/** List all projects. Returns `Project[]`. */
export const GET_PROJECTS = '/project';

/** Get a single project by ID. Template: `GET_PROJECT_BY_ID(projectId)`. */
export const GET_PROJECT_BY_ID = (projectId: string) => `/project/${projectId}` as const;

/** Fork a project by ID. Template: `FORK_PROJECT(projectId)`. */
export const FORK_PROJECT = (projectId: string) => `/project/${projectId}/fork` as const;

/** Get the current active project. */
export const GET_CURRENT_PROJECT = '/project/current';

/** List all sessions (optionally filtered by `projectID` query param). Returns `Session[]`. */
export const GET_SESSIONS = '/session';

/**
 * Create a new session (V2). POST body `{ projectID, title }`.
 * Returns `{ data: Session }`.
 */
export const CREATE_SESSION = '/api/session';

/** Get a single session by ID. Template: `GET_SESSION_BY_ID(sessionId)`. */
export const GET_SESSION_BY_ID = (sessionId: string) => `/session/${sessionId}` as const;

/** Delete a session by ID. Template: `DELETE_SESSION(sessionId)`. */
export const DELETE_SESSION = (sessionId: string) => `/session/${sessionId}` as const;

/**
 * Get messages for a session (V2). Returns `{ data: V2Message[], cursor }`.
 * Template: `GET_SESSION_MESSAGES(sessionId)`.
 */
export const GET_SESSION_MESSAGES = (sessionId: string) =>
  `/api/session/${sessionId}/message` as const;

/**
 * Send a message to a session (V2 prompt). POST body:
 * `{ id: "msg_...", prompt: { type, text } }`. Template: `SEND_SESSION_PROMPT(sessionId)`.
 */
export const SEND_SESSION_PROMPT = (sessionId: string) =>
  `/api/session/${sessionId}/prompt` as const;

/** Interrupt an active session. Template: `INTERRUPT_SESSION(sessionId)`. */
export const INTERRUPT_SESSION = (sessionId: string) => `/session/${sessionId}/abort` as const;

/** Global V2 SSE event stream (the only working SSE endpoint on this server). */
export const GLOBAL_EVENT_STREAM = '/api/event';

/** Get current working directory info. */
export const GET_PATH = '/path';

/** Get VCS info for the current project. */
export const GET_VCS = '/vcs';
