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

/** Message delivery status. */
export type MessageStatus = 'pending' | 'sending' | 'sent';

/** Millisecond timestamps from the OpenCode server. */
interface TimeSpan {
  created: number;
  updated?: number;
}

/** OpenCode project. */

/** Session summary (from list / create endpoints). */
export interface SessionT {
  agent: string;
  cost: number;
  id: string;
  location: {
    directory: string;
  };
  model: {
    id: string;
    providerID: string;
    variant: string;
  };
  projectID: string;
  time: {
    created: number;
    updated: number;
  };
  title: string;
  tokens: {
    cache: {
      read: number;
      write: number;
    };
    input: number;
    output: number;
    reasoning: number;
  };
}
/**
 * A single content block inside an assistant message.
 * Produced by both the message read endpoint and the SSE event stream.
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
    }
  | { type: 'selection'; id: string; question: string; options: string[] };

/**
 * A single chat message (from GET /api/session/:id/message).
 *
 * User messages carry their text in the top-level `text` field; assistant
 * messages carry an ordered list of content blocks in `content`.
 */
export interface Message {
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
  status?: MessageStatus;
  cost?: number;
  tokens?: {
    total?: number;
    input?: number;
    output?: number;
    reasoning?: number;
    cache?: { read: number; write: number };
  };
}

/** Standard envelope wrapped around list/create responses. */
export interface ApiData<T> {
  data: T;
  cursor?: { previous: string | null; next: string | null } | null;
}

/** A single content part within a legacy message (from the parts array). */
export type MessagePart =
  | {
      id: string;
      sessionID: string;
      messageID: string;
      type: 'text';
      text: string;
      synthetic?: boolean;
      ignored?: boolean;
      time?: TimeSpan;
      metadata?: Record<string, unknown>;
    }
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
      metadata?: Record<string, unknown>;
    }
  | {
      id: string;
      sessionID: string;
      messageID: string;
      type: 'reasoning';
      text: string;
      time?: { start: number; end?: number };
      metadata?: Record<string, unknown>;
    }
  | {
      id: string;
      sessionID: string;
      messageID: string;
      type: 'selection';
      question: string;
      options: string[];
      metadata?: Record<string, unknown>;
    };

/**
 * Message metadata returned as `info` in `GET /session/:id/message`.
 *
 * Shape matches the verified v1 OpenCode schemas: `UserMessage` and
 * `AssistantMessage`. Note that v1 carries `modelID`/`providerID`/
 * `variant` (not a nested `model` object), plus `cost`, `tokens`, and
 * `finish` on assistant messages.
 */
export interface MessageInfo {
  id: string;
  sessionID: string;
  role: 'user' | 'assistant' | 'system';
  time: TimeSpan;
  agent?: string;
  parentID?: string;
  modelID?: string;
  providerID?: string;
  variant?: string;
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
  cost?: number;
  tokens?: Message['tokens'];
  finish?: string;
}

/** A single chat message returned by `GET /session/:id/message`. */
export interface RawMessage {
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
