/**
 * @file Zustand store tracking subagent (child) sessions spawned by a main
 * session, plus the mapping from tool part ID → child session ID.
 *
 * Populated by `use-sse.ts` (live events) and `use-subagent-children.ts`
 * (historical replay). Rendered by `SubagentToolCallButton` in the message
 * list. Kept in memory only — no persistence.
 */

import { create } from 'zustand';
import type {
  SubagentChildInfo,
  SubagentSession,
  SubagentStatus,
  SubagentToolPartInfo,
} from '../types';
import { resolveChildSessionID } from '../utils/subagent-events';

/** Upper bound on remembered children per parent session. */
const MAX_CHILDREN_PER_PARENT = 5;

interface SubagentState {
  /** Child sessions keyed by parent session ID. */
  childrenByParent: Record<string, SubagentSession[]>;
  /** Tool part ID (`^prt`) → child session ID. */
  claimsByPartId: Record<string, string>;
  /** Register a child session from a `session.created` event. */
  registerChildSession: (child: SubagentChildInfo) => void;
  /** Update status/description from a subagent tool part; claims if needed. */
  registerToolPartStatus: (parentId: string, part: SubagentToolPartInfo) => void;
  /** Claim a child session for a specific tool part (idempotent). */
  claimChild: (parentId: string, partId: string, sessionId: string) => void;
  /** Clear all subagent state. */
  reset: () => void;
}

function toStatus(status: string): SubagentStatus {
  if (status === 'completed' || status === 'error' || status === 'pending') return status;
  return 'running';
}

export const useSubagentStore = create<SubagentState>((set, get) => ({
  childrenByParent: {},
  claimsByPartId: {},

  registerChildSession: (child) =>
    set((state) => {
      const existing = state.childrenByParent[child.parentID] ?? [];
      const current = existing.find((c) => c.sessionID === child.sessionID);

      // If an earlier tool part already claimed this child (e.g. its output
      // embedded the session ID before `session.created` arrived), keep that
      // claim so a later same-agent part cannot steal it via agent-match.
      const existingClaim = Object.entries(state.claimsByPartId).find(
        ([, sessionId]) => sessionId === child.sessionID
      )?.[0];

      const next: SubagentSession = {
        sessionID: child.sessionID,
        parentID: child.parentID,
        agent: child.agent ?? current?.agent,
        title: child.title ?? current?.title,
        projectID: child.projectID ?? current?.projectID,
        directory: child.directory ?? current?.directory,
        description: current?.description,
        status: current?.status ?? 'running',
        claimedByPartID: current?.claimedByPartID ?? existingClaim,
        createdAt: current?.createdAt ?? child.createdAt,
      };

      const merged = current
        ? existing.map((c) => (c.sessionID === child.sessionID ? next : c))
        : [...existing, next]
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, MAX_CHILDREN_PER_PARENT);

      return { childrenByParent: { ...state.childrenByParent, [child.parentID]: merged } };
    }),

  registerToolPartStatus: (parentId, part) =>
    set((state) => {
      const children = state.childrenByParent[parentId] ?? [];
      const partClaim = state.claimsByPartId[part.partID];
      const sessionId =
        partClaim ??
        resolveChildSessionID(part.agent, part.output, children, parentId, part.childSessionID);

      if (!sessionId) return state;

      const status = toStatus(part.status);
      const updated = children.map((c) =>
        c.sessionID === sessionId
          ? {
              ...c,
              status,
              agent: c.agent ?? part.agent,
              description: c.description ?? part.description,
              claimedByPartID: c.claimedByPartID ?? part.partID,
            }
          : c
      );

      return {
        childrenByParent: { ...state.childrenByParent, [parentId]: updated },
        claimsByPartId: state.claimsByPartId[part.partID]
          ? state.claimsByPartId
          : { ...state.claimsByPartId, [part.partID]: sessionId },
      };
    }),

  claimChild: (parentId, partId, sessionId) =>
    set((state) => {
      if (state.claimsByPartId[partId]) return state;
      const children = state.childrenByParent[parentId] ?? [];
      return {
        childrenByParent: {
          ...state.childrenByParent,
          [parentId]: children.map((c) =>
            c.sessionID === sessionId && !c.claimedByPartID ? { ...c, claimedByPartID: partId } : c
          ),
        },
        claimsByPartId: { ...state.claimsByPartId, [partId]: sessionId },
      };
    }),

  reset: () => set({ childrenByParent: {}, claimsByPartId: {} }),
}));
