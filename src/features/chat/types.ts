/** A streaming assistant message being built from SSE deltas. */
export interface StreamingState {
  text: string;
  reasoning: string;
}

type Session = {
  id: string;
  status: 'idle' | 'active' | 'error';
  [key: string]: unknown;
};

type Message = {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  [key: string]: unknown;
};

export type PermissionRequest = {
  id: string;
  sessionId: string;
  scope: string;
  description?: string;
  [key: string]: unknown;
};

// Strongly-typed payload variants
type SessionUpdatedPayload = {
  type: 'session.updated';
  properties: {
    info: Session;
  };
};

type SessionIdlePayload = {
  type: 'session.idle';
  properties: {
    sessionID: string;
  };
};

type SessionNextTextDeltaPayload = {
  type: 'session.next.text.delta';
  properties: {
    sessionID: string;
    assistantMessageID: string;
    delta: string;
  };
};

type SessionNextReasoningDeltaPayload = {
  type: 'session.next.reasoning.delta';
  properties: {
    sessionID: string;
    assistantMessageID: string;
    delta: string;
  };
};

type SessionNextStepEndedPayload = {
  type: 'session.next.step.ended';
  properties: {
    sessionID: string;
  };
};

type MessagePartDeltaPayload = {
  type: 'message.part.delta';
  properties: {
    sessionID: string;
    messageID: string;
    partID: string;
    field: string;
    delta: string;
  };
};

type MessageUpdatedPayload = {
  type: 'message.updated';
  properties: {
    sessionID: string;
    info: unknown;
  };
};

/** A single selectable option within a question. */
export type QuestionOption = {
  /** Display text (1-5 words, concise). */
  label: string;
  /** Explanation of the choice. */
  description?: string;
};

/** A single question posed by the assistant (mirrors server `QuestionInfo`). */
export type QuestionInfo = {
  /** Complete question text. */
  question: string;
  /** Very short label (max 30 chars). */
  header: string;
  /** Available choices. */
  options: QuestionOption[];
  /** When true the user may select multiple options. */
  multiple?: boolean;
  /** When true the user may type a custom answer. */
  custom?: boolean;
};

/** An interactive question request from the assistant (server `QuestionRequest`). */
export type QuestionRequest = {
  /** Question request ID (`^que`). */
  id: string;
  /** Session the question belongs to (`^ses`). */
  sessionID: string;
  /** Questions to ask, answered in order. */
  questions: QuestionInfo[];
  /** Tool that produced the question. */
  tool?: {
    messageID: string;
    callID: string;
  };
};

type QuestionAskedPayload = {
  type: 'question.asked';
  properties: QuestionRequest;
};

type MessageCreatedPayload = {
  type: 'message.created';
  properties: {
    message: Message;
  };
};

type PermissionRequestedPayload = {
  type: 'permission.requested';
  properties: {
    request: PermissionRequest;
  };
};

// Catch-all payload preserving autocomplete for literal types via `string & {}`
type CustomPayload = {
  type: string & {};
  properties: Record<string, unknown>;
};

type EventPayload =
  | SessionUpdatedPayload
  | SessionIdlePayload
  | SessionNextTextDeltaPayload
  | SessionNextReasoningDeltaPayload
  | SessionNextStepEndedPayload
  | MessagePartDeltaPayload
  | MessageUpdatedPayload
  | QuestionAskedPayload
  | MessageCreatedPayload
  | PermissionRequestedPayload
  | CustomPayload;

/**
 * A single event from the global SSE stream.
 *
 * The live v1 wire format places `type` and `properties` at the top level:
 * `{ id: "evt_…", type: "question.asked", properties: { … } }`. Older
 * server versions wrapped the event in a `payload` object instead
 * (`{ directory?, payload: { type, properties } }`). The SSE parser accepts
 * both shapes.
 */
export type Event = {
  /** Event ID (`^evt`) — present in the top-level wire format. */
  id?: string;
  /** Working directory — present in the legacy `payload` wrapper format. */
  directory?: string;
  /** Event type, e.g. `question.asked`. */
  type?: string;
  /** Event-specific payload. */
  properties?: Record<string, unknown>;
  /** Legacy (`GlobalEvent`) wrapper containing `type`/`properties`. */
  payload?: EventPayload;
};

/** Live status of a subagent session, derived from its task tool part. */
export type SubagentStatus = 'pending' | 'running' | 'completed' | 'error';

/**
 * A child (subagent) session spawned by a main session.
 *
 * Created from the `session.created` SSE event (`properties.info`), enriched
 * by subagent `task`/`agent` tool part updates (`message.part.updated`).
 */
export interface SubagentSession {
  /** Child session ID (`^ses`). */
  sessionID: string;
  /** Parent (spawning) session ID (`^ses`). */
  parentID: string;
  /** Agent running the child session, e.g. `explore`, `build`, `plan`. */
  agent?: string;
  /** Session title from the server. */
  title?: string;
  /** Description from the task tool input, when known. */
  description?: string;
  /** Project the child session belongs to — used for navigation. */
  projectID?: string;
  /** Working directory of the child session. */
  directory?: string;
  /** Current status. */
  status: SubagentStatus;
  /** Tool part ID (`^prt`) that first claimed this child session. */
  claimedByPartID?: string;
  /** When the child session was created (ms epoch). */
  createdAt: number;
}

/** Normalized payload of a `session.created` event (v1 `properties`). */
export type SubagentChildInfo = {
  sessionID: string;
  parentID: string;
  agent?: string;
  title?: string;
  projectID?: string;
  directory?: string;
  createdAt: number;
};

/** Normalized payload of a subagent tool part from `message.part.updated`. */
export type SubagentToolPartInfo = {
  /** Parent session ID the tool part belongs to (`^ses`). */
  sessionID: string;
  /** Tool part ID (`^prt`). */
  partID: string;
  /** Message the tool part belongs to (`^msg`). */
  messageID: string;
  /** Tool name (`task` | `agent` | `subagent`). */
  tool: string;
  /** Tool state status (`pending` | `running` | `completed` | `error`). */
  status: string;
  /** Agent name from `state.input.subagent_type` (fallback `subagent`). */
  agent?: string;
  /** Description from `state.input.description`. */
  description?: string;
  /** Tool `state.output`, used to parse the child session ID when present. */
  output?: unknown;
  /**
   * Authoritative child session ID persisted by the server on the part
   * (`state.metadata.sessionId`, falling back to `info.sessionID`). Present
   * on historical task parts after restart, when output parsing is
   * unavailable (`output` is null there).
   */
  childSessionID?: string;
};
