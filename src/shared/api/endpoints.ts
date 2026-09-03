/**
 * @file API endpoint path constants.
 *
 * All OpenCode server endpoint paths are centralized here as
 * SCREAMING_SNAKE_CASE constants. No hardcoded strings should
 * appear in hooks, stores, or components.
 *
 * Paths match the OpenCode server HTTP API (v1.x). Note: the server
 * routes do NOT use an `/api` prefix (e.g. `/project`, not `/api/project`).
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

/** Create a new session. */
export const CREATE_SESSION = '/session';

/** Get a single session by ID. Template: `GET_SESSION_BY_ID(sessionId)`. */
export const GET_SESSION_BY_ID = (sessionId: string) => `/session/${sessionId}` as const;

/** Delete a session by ID. Template: `DELETE_SESSION(sessionId)`. */
export const DELETE_SESSION = (sessionId: string) => `/session/${sessionId}` as const;

/** Get messages for a session. Returns `Message[]`. Template: `GET_SESSION_MESSAGES(sessionId)`. */
export const GET_SESSION_MESSAGES = (sessionId: string) => `/session/${sessionId}/message` as const;

/** Send a message to a session (async prompt). Template: `SEND_SESSION_PROMPT(sessionId)`. */
export const SEND_SESSION_PROMPT = (sessionId: string) =>
  `/session/${sessionId}/prompt_async` as const;

/** Interrupt an active session. Template: `INTERRUPT_SESSION(sessionId)`. */
export const INTERRUPT_SESSION = (sessionId: string) => `/session/${sessionId}/abort` as const;

/** SSE log stream for a session. Template: `SESSION_LOG_STREAM(sessionId)`. */
export const SESSION_LOG_STREAM = (sessionId: string) => `/session/${sessionId}/log` as const;

/** Global event stream (SSE). */
export const GLOBAL_EVENT_STREAM = '/event';

/** Get current working directory info. */
export const GET_PATH = '/path';

/** Get VCS info for the current project. */
export const GET_VCS = '/vcs';
