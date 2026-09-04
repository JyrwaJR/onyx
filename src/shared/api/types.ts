/**
 * @file OpenCode API response type definitions.
 *
 * Types match the real OpenCode server (v1.18.10) HTTP API response shapes.
 * Verified against a live server on 2026-09-04.
 */

/** Server health check response. */
export interface HealthResponse {
  healthy: boolean;
  version?: string;
}

/** Millisecond timestamps from the OpenCode server. */
export interface TimeSpan {
  created: number;
  updated?: number;
}

/** OpenCode project. */
export interface Project {
  id: string;
  worktree: string;
  vcs?: string;
  time: TimeSpan;
  sandboxes: unknown[];
}

/** Session summary (from list / create endpoints). */
export interface Session {
  id: string;
  slug?: string;
  projectID: string;
  directory: string;
  path?: string;
  parentID?: string;
  title: string;
  agent?: string;
  model?: {
    id: string;
    providerID: string;
    variant?: string;
  };
  cost?: number;
  tokens?: {
    input: number;
    output: number;
    reasoning?: number;
    cache?: { read: number; write: number };
  };
  version?: string;
  time: TimeSpan;
}

/**
 * A single content block inside a V2 assistant message.
 * Produced by both the V2 message read endpoint and the SSE event stream.
 */
export type MessageContentBlock =
  | { type: 'text'; id: string; text: string }
  | { type: 'reasoning'; id: string; text: string; time?: TimeSpan }
  | {
      type: 'tool';
      id: string;
      callID?: string;
      tool: string;
      state: {
        status: string;
        input?: Record<string, unknown>;
        output?: unknown;
        title?: string;
      };
    };

/**
 * A single V2 chat message (from GET /api/session/:id/message).
 *
 * User messages carry their text in the top-level `text` field; assistant
 * messages carry an ordered list of content blocks in `content`.
 */
export interface V2Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  text?: string;
  content?: MessageContentBlock[];
  agent?: string;
  model?: {
    id: string;
    providerID: string;
    variant?: string;
  };
  time: TimeSpan & { completed?: number };
  finish?: 'stop' | 'length' | 'error';
  cost?: number;
  tokens?: {
    input: number;
    output: number;
    reasoning?: number;
    cache?: { read: number; write: number };
  };
}

/** Standard envelope wrapped around V2 list/create responses. */
export interface ApiData<T> {
  data: T;
  cursor?: { previous: string | null; next: string | null } | null;
}

/** A single content part within a legacy message (from the parts array). */
export type MessagePart =
  | { id: string; sessionID: string; messageID: string; type: 'text'; text: string }
  | {
      id: string;
      sessionID: string;
      messageID: string;
      type: 'tool';
      callID?: string;
      tool: string;
      state: {
        status: string;
        input?: Record<string, unknown>;
        output?: unknown;
        title?: string;
      };
    }
  | {
      id: string;
      sessionID: string;
      messageID: string;
      type: 'reasoning';
      text: string;
    };

/** Message metadata returned as `info` in GET /session/:id/message. */
export interface MessageInfo {
  id: string;
  sessionID: string;
  role: 'user' | 'assistant' | 'system';
  time: TimeSpan;
  agent?: string;
  model?: {
    id: string;
    providerID: string;
    variant?: string;
  };
  summary?: {
    additions?: number;
    deletions?: number;
    files?: number;
    diffs?: {
      file: string;
      patch: string;
      additions?: number;
      deletions?: number;
      status?: string;
    }[];
  };
}

/** A single legacy chat message (from GET /session/:id/message). */
export interface Message {
  info: MessageInfo;
  parts: MessagePart[];
}

/** Content block types used internally for rendering (derived from MessagePart). */
export type ContentBlock =
  | { type: 'text'; text: string }
  | {
      type: 'tool-invocation';
      toolCallId: string;
      toolName: string;
      args: Record<string, unknown>;
      state: string;
      result?: unknown;
    }
  | { type: 'tool-result'; toolCallId: string; result: unknown }
  | { type: 'reasoning'; text: string };
