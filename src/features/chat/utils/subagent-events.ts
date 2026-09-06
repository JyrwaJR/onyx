/**
 * @file Pure helpers for detecting subagent spawns from the OpenCode v1 SSE
 * event stream.
 *
 * Subagent spawns surface through two signals:
 * 1. `session.created` — the authoritative source of the child session ID.
 *    `properties.info.parentID` points back to the spawning (parent) session.
 * 2. `message.part.updated` — a tool part whose `tool` is one of
 *    `task`/`agent`/`subagent`. Carries the agent name, description, and
 *    pending/running/completed/error status.
 *
 * All functions are free of React Native imports on purpose, so they are
 * pure and can be unit-tested without a native runtime.
 */

import type { SubagentChildInfo, SubagentToolPartInfo } from '../types';

/** Tool names that indicate the agent spawned a subagent session. */
export const SUBPENDENT_TOOL_NAMES = new Set(['task', 'agent', 'subagent']);

/**
 * Whether a tool name represents a subagent-spawning tool.
 *
 * @param tool - Tool name from a tool part.
 * @returns True when the tool spawns a subagent session.
 */
export function isSubagentTool(tool: unknown): tool is string {
  return typeof tool === 'string' && SUBPENDENT_TOOL_NAMES.has(tool);
}

/**
 * Parses a child session ID (`^ses...`) out of a tool `state.output`.
 *
 * The `task` tool result text frequently embeds the created child session
 * ID. Never trusts the value blindly: affects only claim resolution.
 * Scans every `^ses` candidate in the text, skipping the parent's own ID
 * if it is quoted first.
 *
 * @param output - Tool output (string or JSON-serializable value).
 * @param excludeId - Session ID to ignore (the parent) when it appears.
 * @returns The first non-excluded `^ses` id found, or null.
 */
export function parseChildSessionIdFromOutput(output: unknown, excludeId?: string): string | null {
  if (output == null) return null;
  const text = typeof output === 'string' ? output : JSON.stringify(output);
  const re = /\^ses[a-zA-Z0-9_-]+/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (excludeId != null && match[0] === excludeId) continue;
    return match[0];
  }
  return null;
}

/**
 * Normalizes a `session.created` event payload into a `SubagentChildInfo`.
 *
 * @param properties - The v1 event `properties` object.
 * @returns Normalized child info, or null when the payload is not a child
 *   session (missing sessionID, info, or parentID).
 */
export function normalizeSessionCreated(
  properties: Record<string, unknown>
): SubagentChildInfo | null {
  const sessionID = typeof properties.sessionID === 'string' ? properties.sessionID : undefined;
  if (!sessionID) return null;

  const info = properties.info as Record<string, unknown> | undefined;
  if (!info || typeof info !== 'object') return null;

  const parentID = typeof info.parentID === 'string' ? info.parentID : undefined;
  if (!parentID) return null;

  const time = info.time as Record<string, unknown> | undefined;
  return {
    sessionID,
    parentID,
    agent: typeof info.agent === 'string' ? info.agent : undefined,
    title: typeof info.title === 'string' ? info.title : undefined,
    projectID: typeof info.projectID === 'string' ? info.projectID : undefined,
    directory: typeof info.directory === 'string' ? info.directory : undefined,
    createdAt: time && typeof time.created === 'number' ? time.created : Date.now(),
  };
}

/**
 * Normalizes a `message.part.updated` payload whose part is a subagent tool
 * call. Returns null for non-tool parts or non-subagent tools.
 *
 * @param properties - The v1 event `properties` object.
 * @returns Normalized tool part info, or null.
 */
export function normalizeSubagentToolPart(
  properties: Record<string, unknown>
): SubagentToolPartInfo | null {
  const sessionID = typeof properties.sessionID === 'string' ? properties.sessionID : undefined;
  const part = properties.part as Record<string, unknown> | undefined;
  if (!sessionID || !part || typeof part !== 'object') return null;
  if (part.type !== 'tool' || !isSubagentTool(part.tool)) return null;

  const state = part.state as Record<string, unknown> | undefined;
  const input = state?.input as Record<string, unknown> | undefined;
  const metadata = state?.metadata as Record<string, unknown> | undefined;
  const info = part.info as Record<string, unknown> | undefined;
  return {
    sessionID,
    partID: typeof part.id === 'string' ? part.id : '',
    messageID: typeof part.messageID === 'string' ? part.messageID : '',
    tool: part.tool,
    status: typeof state?.status === 'string' ? state.status : 'running',
    // Verified against live wire data (Task 11 E2E): the tool-input field
    // for the agent name is `subagent_type` (e.g. "explore"/"general").
    agent:
      typeof input?.subagent_type === 'string'
        ? input.subagent_type
        : typeof input?.subagent === 'string'
          ? input.subagent
          : undefined,
    description: typeof input?.description === 'string' ? input.description : undefined,
    output: state?.output,
    childSessionID:
      typeof metadata?.sessionId === 'string'
        ? metadata.sessionId
        : typeof info?.sessionID === 'string'
          ? info.sessionID
          : undefined,
  };
}

/**
 * Resolves which child session a subagent tool call maps to.
 *
 * Strategy, in order:
 * 1. The server-persisted link on the part (`state.metadata.sessionId`).
 *    Authoritative — present even after restart, when output is null.
 * 2. Parse the child session ID from the tool output (`^ses...`).
 * 3. Match against unclaimed children whose agent equals the tool's
 *    `subagent_type` input, most recently created first.
 *
 * @param agent - The `state.input.subagent_type` agent name.
 * @param output - The tool `state.output` (may embed the child session ID).
 * @param children - Known child sessions of the parent.
 * @param excludeId - Parent session ID to ignore in output parsing.
 * @param metadataSessionId - Server-persisted child link from
 *   `state.metadata.sessionId`; wins when it does not equal `excludeId`.
 * @returns The child session ID, or null when unresolvable.
 */
export function resolveChildSessionID(
  agent: string | undefined,
  output: unknown,
  children: readonly {
    agent?: string;
    claimedByPartID?: string;
    createdAt: number;
    sessionID: string;
  }[],
  excludeId?: string,
  metadataSessionId?: string
): string | null {
  if (metadataSessionId && metadataSessionId !== excludeId) return metadataSessionId;

  const fromOutput = parseChildSessionIdFromOutput(output, excludeId);
  if (fromOutput) return fromOutput;

  if (!agent) return null;
  const match = children
    .filter((c) => c.agent === agent && !c.claimedByPartID)
    .sort((a, b) => b.createdAt - a.createdAt)[0];
  return match?.sessionID ?? null;
}
