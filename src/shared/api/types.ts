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
    };

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

/**
 * Maps a raw `RawMessage` (`{ info, parts }`) to the app-internal `Message`
 * shape used by the chat UI.
 *
 * - User messages: joins all text parts into the top-level `text` field.
 * - Assistant messages: builds an ordered `content` block list from text,
 *   reasoning, and tool parts. Non-renderable part types (step-start,
 *   step-finish, file, snapshot, patch, agent, retry, compaction, subtask)
 *   are dropped.
 *
 * @param message - The raw message from the API.
 * @returns The mapped message.
 */
export function mapRawMessageToMessage(message: RawMessage): Message {
  const contentBlocks: MessageContentBlock[] = [];

  for (const part of message.parts) {
    if (part.type === 'text') {
      contentBlocks.push({ type: 'text', id: part.id, text: part.text });
    } else if (part.type === 'reasoning') {
      const block: MessageContentBlock & { type: 'reasoning' } = {
        type: 'reasoning',
        id: part.id,
        text: part.text,
      };
      // v1 exposes reasoning timing as `{ start, end }`; the render type
      // uses `TimeSpan` (`created`/`updated`).
      if (part.time) {
        block.time = { created: part.time.start, updated: part.time.end };
      }
      contentBlocks.push(block);
    } else if (part.type === 'tool') {
      contentBlocks.push({
        type: 'tool',
        id: part.id,
        callID: part.callID,
        tool: part.tool,
        state: part.state as any,
      });
    }
  }

  const base: Omit<Message, 'type' | 'text' | 'content'> = {
    id: message.info.id,
    agent: message.info.agent,
    model: message.info.modelID
      ? {
          id: message.info.modelID,
          providerID: message.info.providerID ?? '',
          variant: message.info.variant,
        }
      : undefined,
    time: message.info.time as any,
    finish: message.info.finish as Message['finish'],
    cost: message.info.cost,
    tokens: message.info.tokens as any,
  };

  if (message.info.role === 'user') {
    const text = message.parts
      .filter((part): part is Extract<MessagePart, { type: 'text' }> => part.type === 'text')
      .map((part) => part.text)
      .join('\n');
    return { ...base, type: 'user', text };
  }

  if (message.info.role === 'system') {
    return { ...base, type: 'system', text: '' };
  }

  return { ...base, type: 'assistant', content: contentBlocks };
}

/** Todo item status values returned by the OpenCode server. */
export type TodoStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

/** Todo item priority values returned by the OpenCode server. */
export type TodoPriority = 'high' | 'medium' | 'low';

/**
 * A single task tracked by the agent for a session
 * (from `GET /session/:id/todo` and the `todo.updated` SSE event).
 */
export interface Todo {
  /** Brief description of the task. */
  content: string;
  /** Current status of the task. */
  status: TodoStatus;
  /** Priority level of the task. */
  priority: TodoPriority;
}
