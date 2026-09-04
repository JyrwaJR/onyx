/**
 * @file API endpoint path constants.
 *
 * All OpenCode server endpoint paths are centralized here as
 * SCREAMING_SNAKE_CASE constants. No hardcoded strings should
 * appear in hooks, stores, or components.
 *
 * Paths were verified against the OpenCode v1 OpenAPI spec (`api.json`)
 * on 2026-09-04. The app uses the bare v1 routes only — the legacy
 * `/api` (V2) prefixes are intentionally absent.
 */

/** Server health check endpoint. Returns `{ healthy: boolean; version?: string }`. */
export const HEALTH_CHECK = '/global/health';

/** List all projects. Returns `Project[]`. */
export const GET_PROJECTS = '/project';

/** Get the current active project. */
export const GET_CURRENT_PROJECT = '/project/current';

/** List all sessions (optionally filtered by query params). Returns `Session[]`. */
export const GET_SESSIONS = '/session';

/**
 * Create a new session. POST body `{ title? }` (`parentID`, `agent`,
 * `model`, `metadata`, `permission`, `workspaceID` also accepted).
 * Returns the created `Session`.
 */
export const CREATE_SESSION = '/session';

/** Get a single session by ID. Template: `GET_SESSION_BY_ID(sessionId)`. */
export const GET_SESSION_BY_ID = (sessionId: string) => `/session/${sessionId}` as const;

/** Delete a session by ID. Template: `DELETE_SESSION(sessionId)`. */
export const DELETE_SESSION = (sessionId: string) => `/session/${sessionId}` as const;

/**
 * Get messages for a session. Returns a plain `Message[]` array
 * (`{ info: UserMessage | AssistantMessage, parts: Part[] }`) in ascending
 * chronological order. Query params: `directory`, `workspace`, `limit`,
 * `before`. Template: `GET_SESSION_MESSAGES(sessionId)`.
 */
export const GET_SESSION_MESSAGES = (sessionId: string) => `/session/${sessionId}/message` as const;

/**
 * Send a message to a session. POST body `{ parts: [{ type: 'text', text }] }`.
 * Template: `SEND_SESSION_MESSAGE(sessionId)`.
 */
export const SEND_SESSION_MESSAGE = (sessionId: string) => `/session/${sessionId}/message` as const;

/**
 * Delete a single message from a session.
 * Template: `DELETE_SESSION_MESSAGE(sessionId, messageId)`.
 */
export const DELETE_SESSION_MESSAGE = (sessionId: string, messageId: string) =>
  `/session/${sessionId}/message/${messageId}` as const;

/** Interrupt an active session. Template: `INTERRUPT_SESSION(sessionId)`. */
export const INTERRUPT_SESSION = (sessionId: string) => `/session/${sessionId}/abort` as const;

/** Global SSE event stream. Returns `Event` objects (bare v1 route). */
export const GLOBAL_EVENT_STREAM = '/event';

/** Get current working directory info. */
export const GET_PATH = '/path';

/** Get VCS info for the current project. */
export const GET_VCS = '/vcs';
