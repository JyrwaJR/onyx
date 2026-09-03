/**
 * @file OpenCode API response type definitions.
 *
 * Types are inferred from the `.http` files and may need
 * adjustment after testing against a live server.
 */

/** Server health check response. */
export interface HealthResponse {
  status: string;
}

/** OpenCode project. */
export interface Project {
  id: string;
  title: string;
  path: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Session summary (from list endpoint). */
export interface Session {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  agentId?: string;
  modelId?: string;
  parentId?: string;
}

/** Content block types within a message. */
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
  | { type: 'tool-result'; toolCallId: string; result: unknown };

/** A single chat message. */
export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: ContentBlock[];
  createdAt: string;
  metadata?: Record<string, unknown>;
}
