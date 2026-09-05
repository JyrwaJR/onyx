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
  | MessageCreatedPayload
  | PermissionRequestedPayload
  | CustomPayload;

// Primary Event envelope
export type Event = {
  directory?: string;
  payload: EventPayload;
};
