# Subagent Session Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When the main agent spawns a subagent (e.g. the `task`/`agent` tool), surface a tappable **"View session"** button inline at the tool-call position in the assistant message so the user can jump into the subagent's session — plus a **"Back to parent"** chip when viewing a child session.

**Architecture:** Two OpenCode v1 SSE signals drive the feature: `session.created` (authoritative source of the child session ID via `properties.info.parentID`) and `message.part.updated` tool parts (`tool: 'task' | 'agent'`) which carry the agent name, description, and status. A pure normalization module (`subagent-events.ts`) parses both event shapes; a zustand store (`subagent-store.ts`) holds child sessions keyed by parent session + a part-id→session claim map; a children-seeding hook (`use-subagent-children.ts`) replays historical children via the dedicated `GET /session/{id}/children` endpoint so links survive app restarts. `AssistantMessage` renders a dedicated button component for subagent tool blocks, and `ChatScreen` shows a back-to-parent notice when the current session has a `parentID`.

**Tech Stack:** Expo / React Native (expo-router, nativewind), zustand, @tanstack/react-query, MaterialIcons.

**Verification approach:** Manual only (per user decision — no test runner will be added). Each task ends with `npx tsc --noEmit` + `npm run lint` + a Conventional Commit. Final task contains a manual E2E checklist against a live OpenCode server.

---

## File Map

| Action | File                                                      | Responsibility                                                                                |
| ------ | --------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Modify | `src/shared/api/types.ts`                                 | Align `SessionT` with wire schema: `parentID?` + top-level `directory`; drop stale `location` |
| Modify | `src/shared/api/endpoints.ts`                             | Add `GET_SESSION_CHILDREN(sessionId)`                                                         |
| Modify | `src/features/sessions/api/sessions-api.ts`               | Add `fetchSessionChildren(sessionId)`; pre-existing `directory` type error fixed by Task 1    |
| Modify | `src/features/chat/types.ts`                              | Add subagent domain types                                                                     |
| Create | `src/features/chat/utils/subagent-events.ts`              | Pure event normalization + session-ID resolution                                              |
| Create | `src/features/chat/store/subagent-store.ts`               | Zustand store: children-by-parent + part claims                                               |
| Create | `src/features/chat/hooks/use-subagent-children.ts`        | Seed store via `GET /session/{id}/children` (survives restart)                                |
| Modify | `src/features/chat/hooks/use-sse.ts`                      | Handle `session.created` + subagent tool `message.part.updated`                               |
| Create | `src/features/chat/components/SubagentToolCallButton.tsx` | Inline button rendered at the tool-call position                                              |
| Modify | `src/features/chat/components/AssistantMessage.tsx`       | Branch render for subagent tool blocks; accept `sessionId`/`projectId` props                  |
| Create | `src/features/chat/components/ParentSessionNotice.tsx`    | Back-to-parent chip on child sessions                                                         |
| Modify | `src/features/chat/screens/ChatScreen.tsx`                | Pass props; render `ParentSessionNotice`; call children-seeding hook                          |
| Modify | `src/features/chat/index.ts`                              | Barrel exports                                                                                |
| Modify | `src/shared/api/query-keys.ts`                            | Add `sessions.children(sessionId)` key                                                        |

---

### Task 0: Prepare the feature branch

The repo is currently on `feat/todo-modal`. The todo-modal component work (`ContextBar.tsx`, `TodoModal.tsx`) is already committed; the working tree has **uncommitted changes in `src/features/chat/components/AssistantMessage.tsx` and `src/shared/components/ui/header.tsx`** (todo-modal polish in progress). There is also a **pre-existing committed type error** — `sessions-api.ts:38` references `session.directory`, but `SessionT` omits it. Task 1 fixes that error as part of aligning `SessionT` with the wire schema, so do NOT fix it ad hoc here.

**Files:** none created/modified.

- [ ] **Step 1: Inspect the working tree**

Run: `git status`
Expected: on `feat/todo-modal`; modified: `src/features/chat/components/AssistantMessage.tsx`, `src/shared/components/ui/header.tsx`; plus this plan file untracked.

- [ ] **Step 2: Commit or stash the pending changes so they do not leak into this feature**

If the changes are intentional, commit them on `feat/todo-modal`:

```bash
git add src/features/chat/components/AssistantMessage.tsx src/shared/components/ui/header.tsx
git commit -m "feat: polish todo modal UI"
```

If incomplete/experimental, stash them instead:

```bash
git stash push -m "todo-modal wip"
```

- [ ] **Step 3: Create the feature branch**

```bash
git checkout -b feat/subagent-session-links
```

- [ ] **Step 4: Verify**

Run: `git status`
Expected: on `feat/subagent-session-links`, clean or carrying only intentional branches.

---

### Task 1: Align `SessionT` with the wire schema (`parentID` + top-level `directory`)

The OpenCode v1 `Session` schema (api.json line 14624) has a **top-level `directory`** (`required: ["id", "slug", "projectID", "directory", "title", "version", "time"]`), **`parentID`** (`^ses`), and **no `location`**. The app's `SessionT` currently declares a stale `location: { directory }` and omits `parentID` + `directory` — which is exactly why `src/features/sessions/api/sessions-api.ts:38` (`session.directory === dir`) fails `npx tsc --noEmit` today. Nothing in the app reads `session.location` (the only consumer is that filter, which is correct against the wire). The session **create** request body in `chat-api.ts:31` has its own inline type (`location: { directory: dir }`) and is unaffected.

**Files:**

- Modify: `src/shared/api/types.ts` (interface `SessionT`, line 26)

- [ ] **Step 1: Replace the `SessionT` interface**

Replace the `SessionT` interface (lines 26-53) with:

```ts
/** Session summary (from list / create endpoints). */
export interface SessionT {
  agent: string;
  cost: number;
  /** Working directory of the session (wire schema: top-level `directory`). */
  directory: string;
  id: string;
  model: {
    id: string;
    providerID: string;
    variant: string;
  };
  /** Parent session ID (`^ses`) when this session is a subagent child session. */
  parentID?: string;
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
```

> [!IMPORTANT] This removes the stale `location: { directory }` and adds top-level `directory` + `parentID`. It is a **breaking type change** that fixes the pre-existing `tsc` error; `useSession`/`fetchSessionById`/`fetchSessionChildren` all consume the same wire shape.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors — including the previously failing `src/features/sessions/api/sessions-api.ts(38,78)`.

- [ ] **Step 3: Commit**

```bash
git add src/shared/api/types.ts
git commit -m "fix(api): align SessionT with wire session shape (directory, parentID)"
```

---

### Task 2: Add subagent domain types

**Files:**

- Modify: `src/features/chat/types.ts` (append at end of file)

- [ ] **Step 1: Append the subagent types**

Append to `src/features/chat/types.ts`:

```ts
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
  /** Agent name from `state.input.subagent`. */
  agent?: string;
  /** Description from `state.input.description`. */
  description?: string;
  /** Tool `state.output`, used to parse the child session ID when present. */
  output?: unknown;
};
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/chat/types.ts
git commit -m "feat: add subagent session domain types"
```

---

### Task 3: Pure subagent event utilities

**Files:**

- Create: `src/features/chat/utils/subagent-events.ts`

Pure functions only — **no React Native / expo / zustand imports** so they stay trivially reviewable and unit-testable later.

- [ ] **Step 1: Create the module**

Create `src/features/chat/utils/subagent-events.ts`:

```ts
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
  return {
    sessionID,
    partID: typeof part.id === 'string' ? part.id : '',
    messageID: typeof part.messageID === 'string' ? part.messageID : '',
    tool: part.tool,
    status: typeof state?.status === 'string' ? state.status : 'running',
    agent: typeof input?.subagent === 'string' ? input.subagent : undefined,
    description: typeof input?.description === 'string' ? input.description : undefined,
    output: state?.output,
  };
}

/**
 * Resolves which child session a subagent tool call maps to.
 *
 * Strategy, in order:
 * 1. Parse the child session ID from the tool output (`^ses...`).
 * 2. Match against unclaimed children whose agent equals the tool's
 *    `subagent` input, most recently created first.
 *
 * @param agent - The `state.input.subagent` agent name.
 * @param output - The tool `state.output` (may embed the child session ID).
 * @param children - Known child sessions of the parent.
 * @param excludeId - Parent session ID to ignore in output parsing.
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
  excludeId?: string
): string | null {
  const fromOutput = parseChildSessionIdFromOutput(output, excludeId);
  if (fromOutput) return fromOutput;

  if (!agent) return null;
  const match = children
    .filter((c) => c.agent === agent && !c.claimedByPartID)
    .sort((a, b) => b.createdAt - a.createdAt)[0];
  return match?.sessionID ?? null;
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/chat/utils/subagent-events.ts
git commit -m "feat: add subagent SSE event normalization utils"
```

---

### Task 4: Subagent store

**Files:**

- Create: `src/features/chat/store/subagent-store.ts`

- [ ] **Step 1: Create the store**

Create `src/features/chat/store/subagent-store.ts`:

```ts
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
        partClaim ?? resolveChildSessionID(part.agent, part.output, children, parentId);

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
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/chat/store/subagent-store.ts
git commit -m "feat: add subagent session store"
```

---

### Task 5: Children-seeding hook + endpoint + query key

The store is in-memory; after an app restart, historical child sessions are unknown. This hook replays them from the dedicated **`GET /session/{sessionID}/children`** endpoint (api.json line 5365 — returns `Session[]`, the authoritative children list) so inline buttons still resolve. This endpoint is purpose-built for this use case and beats fetching all sessions + client-side filtering. It also requires `SessionT` from Task 1 (top-level `directory`, `parentID`).

**Files:**

- Create: `src/features/chat/hooks/use-subagent-children.ts`
- Modify: `src/shared/api/endpoints.ts`
- Modify: `src/features/sessions/api/sessions-api.ts`
- Modify: `src/shared/api/query-keys.ts`

- [ ] **Step 1: Add the endpoint constant**

In `src/shared/api/endpoints.ts`, after `GET_SESSION_TODOS` (line 63), add:

```ts
/**
 * Get all child (subagent) sessions forked from a parent session.
 * Returns `Session[]`. Query params: `directory`, `workspace`.
 * Template: `GET_SESSION_CHILDREN(sessionId)`.
 */
export const GET_SESSION_CHILDREN = (sessionId: string) =>
  `/session/${sessionId}/children` as const;
```

- [ ] **Step 2: Add the API function**

In `src/features/sessions/api/sessions-api.ts`, after `fetchSessions` (line 40), add:

```ts
/**
 * Fetches the child (subagent) sessions forked from a parent session.
 *
 * Uses the dedicated `GET /session/{sessionID}/children` endpoint, which
 * returns `Session[]` whose `parentID` points back at the parent.
 *
 * @param sessionId - The parent session ID.
 * @returns The child sessions of the parent.
 */
export async function fetchSessionChildren(sessionId: string): Promise<SessionListResponse> {
  const response = await http.get<SessionListResponse>(GET_SESSION_CHILDREN(sessionId));
  return response.data;
}
```

Add `GET_SESSION_CHILDREN` to the existing import from `'../../../shared/api/endpoints'` (line 12).

- [ ] **Step 3: Add a query key**

In `src/shared/api/query-keys.ts`, inside `sessions`, add:

```ts
    children: (sessionId: string) => ['sessions', 'children', sessionId] as const,
```

So the block becomes:

```ts
  sessions: {
    all: ['sessions'] as const,
    byProject: (projectId: string) => ['sessions', projectId] as const,
    detail: (sessionId: string) => ['sessions', 'detail', sessionId] as const,
    children: (sessionId: string) => ['sessions', 'children', sessionId] as const,
  },
```

- [ ] **Step 4: Create the hook**

Create `src/features/chat/hooks/use-subagent-children.ts`:

```ts
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/query-keys';
import { fetchSessionChildren } from '../../sessions/api/sessions-api';
import { useSubagentStore } from '../store/subagent-store';

/**
 * Replays a session's child (subagent) sessions via the dedicated
 * `GET /session/{sessionID}/children` endpoint into the subagent store, so
 * inline "View session" buttons resolve even after an app restart (when
 * live `session.created` SSE events are no longer available).
 *
 * Idempotent: existing records (status/claims) are never clobbered by
 * `registerChildSession`.
 *
 * @param sessionId - The parent session ID to seed children for.
 */
export function useSubagentChildren(sessionId: string | undefined) {
  const registerChildSession = useSubagentStore((state) => state.registerChildSession);

  const { data: sessions } = useQuery({
    queryKey: queryKeys.sessions.children(sessionId ?? ''),
    queryFn: () => fetchSessionChildren(sessionId ?? ''),
    enabled: !!sessionId,
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    if (!sessionId || !sessions) return;
    for (const session of sessions) {
      if (session.parentID === sessionId) {
        registerChildSession({
          sessionID: session.id,
          parentID: session.parentID,
          agent: session.agent,
          title: session.title,
          projectID: session.projectID,
          directory: session.directory,
          createdAt: session.time.created,
        });
      }
    }
  }, [sessionId, sessions, registerChildSession]);
}
```

> [!NOTE] `session.directory` is the top-level field added in Task 1 (wire-correct). The `session.parentID === sessionId` guard is kept defensively even though the endpoint is already scoped to the parent.

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no errors (verify the relative import path `../../sessions/api/sessions-api` resolves from `src/features/chat/hooks/` → `src/features/sessions/api/sessions-api.ts`, and that `GET_SESSION_CHILDREN` is imported in `sessions-api.ts`).

- [ ] **Step 6: Commit**

```bash
git add src/features/chat/hooks/use-subagent-children.ts src/shared/api/query-keys.ts src/shared/api/endpoints.ts src/features/sessions/api/sessions-api.ts
git commit -m "feat: seed subagent children via session children endpoint"
```

---

### Task 6: Wire SSE events into the store

**Files:**

- Modify: `src/features/chat/hooks/use-sse.ts`

- [ ] **Step 1: Add imports**

After the existing `useChatStore` import (line 6), add:

```ts
import { useSubagentStore } from '../store/subagent-store';
import { normalizeSessionCreated, normalizeSubagentToolPart } from '../utils/subagent-events';
```

- [ ] **Step 2: Select store actions**

After the existing store selectors (around line 35), add:

```ts
const registerChildSession = useSubagentStore((state) => state.registerChildSession);
const registerToolPartStatus = useSubagentStore((state) => state.registerToolPartStatus);
```

- [ ] **Step 3: Handle the two event types**

Inside the `handleEvent` function, after the existing `permission.requested` branch (line 115-120), add:

```ts
      } else if (type === 'session.created') {
        // Authoritative signal that a subagent spawned: the new session's
        // `info.parentID` points back to this chat's session.
        const child = normalizeSessionCreated(properties);
        if (child && child.parentID === sessionId) {
          registerChildSession(child);
        }
      } else if (type === 'message.part.updated') {
        // Tool parts for task/agent carry the subagent's name, description,
        // and status; claim/update the matching child session.
        const part = normalizeSubagentToolPart(properties);
        if (part && part.sessionID === sessionId) {
          registerToolPartStatus(sessionId, part);
          // Refresh the message list so the mid-run tool block appears live
          // (not only after the step completes / next `message.updated`).
          queryClient.invalidateQueries({ queryKey: queryKeys.messages.bySession(sessionId) });
        }
      }
```

> [!NOTE] api.json documents some `Event*` payloads under a `data` key, but the app's existing parser (`use-sse.ts`) normalizes every event into `{ type, properties }` for `handleEvent` — the app's other v1 branches already rely on `properties`, so reading `properties` here is consistent with the working parser. Task 11 includes an instrumentation step to confirm the live payload shape.

- [ ] **Step 4: Update the effect dependency array**

Add `registerChildSession` and `registerToolPartStatus` to the `useEffect` dependency array (line 132), so it becomes:

```ts
  }, [sessionId, queryClient, addPermissionRequest, startStreaming, finishStreaming, registerChildSession, registerToolPartStatus]);
```

> [!NOTE] `queryKeys` and `queryClient` are already imported/derived in `use-sse.ts` (it invalidates messages on `message.updated`), so no new imports are needed for the invalidation above.

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/chat/hooks/use-sse.ts
git commit -m "feat: detect subagent spawns from SSE events"
```

---

### Task 7: Inline "View session" button component

**Files:**

- Create: `src/features/chat/components/SubagentToolCallButton.tsx`

- [ ] **Step 1: Create the component**

Create `src/features/chat/components/SubagentToolCallButton.tsx`:

```tsx
import { useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { MessageContentBlock } from '../../../shared/api/types';
import { useSubagentStore } from '../store/subagent-store';
import { resolveChildSessionID } from '../utils/subagent-events';

type ToolBlock = Extract<MessageContentBlock, { type: 'tool' }>;

interface SubagentToolCallButtonProps {
  /** The subagent tool part block from the assistant message. */
  block: ToolBlock;
  /** The current (parent) session ID. */
  sessionId: string;
  /** The current project ID — fallback when the child's project is unknown. */
  projectId: string;
}

/**
 * Inline button rendered at a subagent tool-call position in the assistant
 * message. Resolves the spawned child session (tool output → store claims →
 * agent match), then navigates to that child session on tap. Shows a
 * "resolving" state while the child session ID is not yet known.
 *
 * @param block - The `task`/`agent` tool part block.
 * @param sessionId - Parent (current) session ID.
 * @param projectId - Parent project ID used as a navigation fallback.
 */
export function SubagentToolCallButton({
  block,
  sessionId,
  projectId,
}: SubagentToolCallButtonProps) {
  const router = useRouter();
  const children = useSubagentStore((state) => state.childrenByParent[sessionId] ?? EMPTY_CHILDREN);
  const claimsByPartId = useSubagentStore((state) => state.claimsByPartId);
  const claimChild = useSubagentStore((state) => state.claimChild);

  const input = block.state.input as Record<string, unknown> | undefined;
  // NOTE: the tool-input field for the agent name is `subagent` per OpenCode
  // conventions, but api.json types `ToolState.input` as a plain object, so
  // the exact key is verified during Task 11 E2E. The primary path never
  // depends on it: `SubagentSession.agent` comes from `session.created`
  // `info.agent` (authoritative) and is what `label` prefers.
  const agent = typeof input?.subagent === 'string' ? input.subagent : block.tool;

  const resolvedSessionId = useMemo(
    () =>
      claimsByPartId[block.id] ??
      resolveChildSessionID(agent, block.state.output, children, sessionId),
    [claimsByPartId, block.id, agent, block.state.output, children, sessionId]
  );

  // Persist the resolution so it is stable across re-renders and other
  // components. Idempotent — the store guards duplicate claims per part ID.
  useEffect(() => {
    if (resolvedSessionId) {
      claimChild(sessionId, block.id, resolvedSessionId);
    }
  }, [resolvedSessionId, claimChild, sessionId, block.id]);

  const child = children.find((c) => c.sessionID === resolvedSessionId);
  // Terminal states from the message block are authoritative; a store child
  // seeded after app restart defaults to 'running' (the endpoint has no
  // status field), so prefer the block's completed/error state to avoid a
  // finished subagent showing "Running" forever.
  const status =
    block.state.status === 'completed' || block.state.status === 'error'
      ? block.state.status
      : (child?.status ?? 'running');
  const label = child?.agent ?? agent;

  const handlePress = () => {
    if (!resolvedSessionId) return;
    const childProjectId = child?.projectID ?? projectId;
    router.push(`/chat?sessionId=${resolvedSessionId}&projectId=${childProjectId}` as never);
  };

  // Not resolved and still running — the child session is being created.
  if (
    !resolvedSessionId &&
    (block.state.status === 'pending' || block.state.status === 'running')
  ) {
    return (
      <View className="my-1 flex-row items-center gap-2 rounded-lg bg-[#f6f3f1] p-3">
        <View className="h-2 w-2 rounded-full bg-[#8f482f]" />
        <Text className="text-xs font-medium text-[#5e5c54]">
          Subagent {label} — resolving session…
        </Text>
      </View>
    );
  }

  // Not resolved and not running — no link is available.
  if (!resolvedSessionId) {
    return (
      <View className="my-1 flex-row items-center gap-2 rounded-lg bg-[#f6f3f1] p-3">
        <MaterialIcons name="call-split" size={16} color="#8f482f" />
        <Text className="text-xs font-medium text-[#5e5c54]">
          Subagent {label} — session unavailable
        </Text>
      </View>
    );
  }

  const statusLabel =
    status === 'completed' ? 'Completed' : status === 'error' ? 'Failed' : 'Running';

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="my-1 flex-row items-center justify-between rounded-lg bg-[#ffdbd0] p-3">
      <View className="flex-1 flex-row items-center gap-2 pr-2">
        <MaterialIcons name="call-split" size={18} color="#75331c" />
        <View className="flex-1">
          <Text className="text-xs font-semibold text-[#75331c]" numberOfLines={1}>
            Subagent: {label}
          </Text>
          <Text className="text-[11px] text-[#75331c]/80">{statusLabel}</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-1 rounded-full bg-white/70 px-2.5 py-1">
        <Text className="text-[11px] font-medium text-[#75331c]">View session</Text>
        <MaterialIcons name="open-in-new" size={12} color="#75331c" />
      </View>
    </TouchableOpacity>
  );
}

/** Stable empty array so store selectors keep reference equality. */
const EMPTY_CHILDREN: never[] = [];
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/chat/components/SubagentToolCallButton.tsx
git commit -m "feat: add inline subagent session button"
```

---

### Task 8: Back-to-parent notice component + ChatScreen wiring

**Files:**

- Create: `src/features/chat/components/ParentSessionNotice.tsx`
- Modify: `src/features/chat/screens/ChatScreen.tsx`

- [ ] **Step 1: Create the component**

Create `src/features/chat/components/ParentSessionNotice.tsx`:

```tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ParentSessionNoticeProps {
  /** The parent (spawning) session ID. */
  parentSessionId: string;
  /** Project ID used to navigate back to the parent chat. */
  projectId: string;
}

/**
 * Thin banner shown at the top of a subagent session's chat that navigates
 * back to the parent session. Rendered only when the current session has a
 * `parentID` (i.e. it is a child/subagent session).
 *
 * @param parentSessionId - Parent session ID to navigate to.
 * @param projectId - Project ID for the `/chat` route.
 */
export function ParentSessionNotice({ parentSessionId, projectId }: ParentSessionNoticeProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between border-b border-[#dac1ba]/30 bg-[#f6f3f1] px-4 py-2">
      <View className="flex-1 flex-row items-center gap-2 pr-2">
        <MaterialIcons name="account-tree" size={16} color="#5e5c54" />
        <Text className="text-xs text-[#54433e]" numberOfLines={1}>
          Viewing a subagent session
        </Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          router.push(`/chat?sessionId=${parentSessionId}&projectId=${projectId}` as never)
        }
        activeOpacity={0.7}
        className="flex-row items-center gap-1 rounded-full bg-[#e6e2da] px-2.5 py-1">
        <MaterialIcons name="arrow-back" size={14} color="#54433e" />
        <Text className="text-xs font-medium text-[#54433e]">Back to parent</Text>
      </TouchableOpacity>
    </View>
  );
}
```

- [ ] **Step 2: Wire into `ChatScreen`**

In `src/features/chat/screens/ChatScreen.tsx`, add the import with the other feature imports:

```tsx
import { ParentSessionNotice } from '../components/ParentSessionNotice';
```

Render the back-to-parent notice below `ChatHeaderBar` (after line 354):

```tsx
{
  session?.parentID ? (
    <ParentSessionNotice parentSessionId={session.parentID} projectId={projectId} />
  ) : null;
}
```

> [!NOTE] `session` already comes from `useSession(sessionId)` in this screen; `parentID` is typed on `SessionT` (Task 1). The null-coalesced form avoids rendering `false` into the tree. This step has no cross-task dependency — the component is created in Step 1 of this same task, so `npx tsc --noEmit` passes here.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/chat/components/ParentSessionNotice.tsx src/features/chat/screens/ChatScreen.tsx
git commit -m "feat: add back-to-parent notice for subagent sessions"
```

---

### Task 9: Render the subagent button in assistant messages

**Files:**

- Modify: `src/features/chat/components/AssistantMessage.tsx`
- Modify: `src/features/chat/screens/ChatScreen.tsx`

- [ ] **Step 1: Update `AssistantMessage` props**

In `src/features/chat/components/AssistantMessage.tsx`:

1. Add imports after the `Clipboard` import:

```tsx
import { isSubagentTool } from '../utils/subagent-events';
import { SubagentToolCallButton } from './SubagentToolCallButton';
```

2. Extend the props interface:

```tsx
interface AssistantMessageProps {
  message: Message;
  /** Current session ID — used to resolve subagent child sessions. */
  sessionId: string;
  /** Current project ID — used to navigate into subagent sessions. */
  projectId: string;
  isStreaming: boolean;
  isReasoningOpen: boolean;
  onToggleReasoning: () => void;
}
```

3. Destructure `sessionId` and `projectId` in the component signature:

```tsx
export const AssistantMessage = memo(function AssistantMessage({
  message,
  sessionId,
  projectId,
  isStreaming = true,
  isReasoningOpen,
  onToggleReasoning,
}: AssistantMessageProps) {
```

4. Branch the tool-block render loop. Replace the existing `{toolBlocks.map((block, idx) => {` block (the whole tool-block render loop inside `AssistantMessage`) with:

```tsx
{
  toolBlocks.map((block, idx) => {
    if (isSubagentTool(block.tool)) {
      return (
        <SubagentToolCallButton
          key={block.id}
          block={block}
          sessionId={sessionId}
          projectId={projectId}
        />
      );
    }
    const isExpanded = expandedId === block.id;
    return (
      <Pressable
        key={idx}
        onPress={() => toggleExpanded(block.id)}
        className="rounded-md bg-[#e6e2da] p-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-1.5 pr-2">
            <MaterialIcons name="task-alt" size={18} color="#8f482f" />
            <Text className="text-xs font-semibold text-[#1c1c1a]" numberOfLines={1}>
              Running <Text className="font-mono text-[#8f482f]">{block.tool}</Text>
            </Text>
          </View>
          <View className="self-start rounded bg-[#ffffff] px-1.5 py-0.5">
            <Text className="text-[11px] text-[#1c1c1a]">
              {block.state.status === 'completed' ? 'Done' : 'Running'}
            </Text>
          </View>
        </View>
        {block.state.input && (
          <View className="mt-2 border-t border-[#dac1ba]/30 pt-2">
            <Text
              className="font-mono text-[10px] text-[#5e5c54]"
              numberOfLines={isExpanded ? undefined : 2}>
              {JSON.stringify(block.state.input, null, 2)}
            </Text>
          </View>
        )}
      </Pressable>
    );
  });
}
```

> [!TIP] The subagent branch uses `key={block.id}` (stable part ID) because `message.part.updated` events may insert tool parts mid-stream, shifting `idx`-based keys. The legacy branch keeps `key={idx}` to match the current code.

- [ ] **Step 2: Call the children-seeding hook and pass props from `ChatScreen`**

In `src/features/chat/screens/ChatScreen.tsx`:

1. Add the import:

```tsx
import { useSubagentChildren } from '../hooks/use-subagent-children';
```

2. Call the seeding hook near the other hooks (after `useSession`, around line 93):

```tsx
useSubagentChildren(sessionId);
```

3. Pass the new props to `AssistantMessage` (lines 379-386):

```tsx
<AssistantMessage
  key={message.id}
  message={message}
  sessionId={sessionId}
  projectId={projectId}
  isStreaming={streamingIds.has(message.id)}
  isReasoningOpen={isReasoningOpen}
  onToggleReasoning={handleToggleReasoning}
/>
```

> [!NOTE] This step depends only on components created in earlier tasks (`SubagentToolCallButton` — Task 7, `useSubagentChildren` — Task 5, `ParentSessionNotice` — Task 8), so the task ends green.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/chat/components/AssistantMessage.tsx src/features/chat/screens/ChatScreen.tsx
git commit -m "feat: render subagent session button in assistant messages"
```

---

### Task 10: Barrel exports

**Files:**

- Modify: `src/features/chat/index.ts`

- [ ] **Step 1: Export the new public surface**

Append to `src/features/chat/index.ts`:

```ts
export { useSubagentStore } from './store/subagent-store';
export { useSubagentChildren } from './hooks/use-subagent-children';
export { SubagentToolCallButton } from './components/SubagentToolCallButton';
export { ParentSessionNotice } from './components/ParentSessionNotice';
export type { SubagentSession, SubagentStatus } from './types';
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/chat/index.ts
git commit -m "feat: export subagent components and store"
```

---

### Task 11: Final verification (typecheck + lint + manual E2E)

**Files:** none.

- [ ] **Step 1: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0, no output.

- [ ] **Step 2: Lint + format check**

Run: `npm run lint`
Expected: exit 0 with no ESLint errors or Prettier failures.

- [ ] **Step 3: Manual E2E against a live OpenCode server**

Prerequisites: an OpenCode server running (the app's connection screen must show healthy); a project open; `npm start` (or `npm run ios` / `npm run android` / `npm run web`).

1. Open a project → Sessions → open or create a session.
2. In the chat, ask the agent to do something that spawns a subagent, e.g. _"explore the codebase and summarize the API routes"_ (the `explore`/plan agents commonly spawn via the `task` tool).
3. **While the subagent runs:** the assistant message shows a coral **"Subagent: explore — Running"** block with a **"View session"** button (or a "resolving session…" pill if the child ID is not yet known).
4. **Tap "View session":** the app navigates to the child session's chat screen.
5. **On the child screen:** a **"Back to parent"** chip appears below the header; tapping it returns to the main session.
6. **After the subagent completes:** the button shows **"Completed"** and still navigates.
7. **Restart the app** (reload), reopen the same main session, scroll to the subagent tool call: the button still resolves (via the children-seeding hook or tool-output parsing), navigates, and — in particular — shows **"Completed"**, not "Running" (the terminal block-state precedence from Task 7).
8. **Negative check:** a plain tool call (e.g. `bash`, `read`) renders the normal expandable tool badge, not the subagent button.
9. **Payload instrumentation (only if something fails to resolve):** temporarily log one raw `session.created` and one `message.part.updated` event in `use-sse.ts` — confirm the payload uses `properties` (as assumed), that tool parts carry `tool: 'task' | 'agent'` with `state.input.subagent`, and that `session.created` `info` contains `parentID`, `agent`, `projectID`, `directory`, `time`. Align `normalizeSessionCreated` / `normalizeSubagentToolPart` to the observed keys, then remove the log.

- [ ] **Step 4: Summary commit (if any fixes were applied along the way)**

```bash
git status
git add -A
git commit -m "fix: subagent session link edge cases"
```

---

## Self-Review Notes

- **Spec coverage:** spawn detection (`session.created` + tool part), inline button at tool-call position (user's placement choice), navigation into child session, back-to-parent chip (user's choice), restart resilience (dedicated children endpoint), manual verification only (user's choice — no test runner added). ✅
- **Type consistency:** `SubagentSession.parentID`, `SubagentChildInfo.parentID`, `SessionT.parentID` all use the same `^ses` string semantics; `resolveChildSessionID` signature matches its call sites in `registerToolPartStatus` (store) and `SubagentToolCallButton`; `SessionT.directory` is top-level, matching api.json `Session` and the `sessions-api.ts` filter. ✅
- **Pre-existing error resolved by this plan:** `src/features/sessions/api/sessions-api.ts:38` (`session.directory`) fails `tsc` today because `SessionT` was out of sync with the wire schema. Task 1 fixes the type (top-level `directory`, `parentID` added, stale `location` removed); `session.directory === dir` was already the correct runtime field per api.json. This is called out in Task 0 so nobody "fixes" it ad hoc.
- **Known limitations (documented, not blocking):** the child→tool-part join is heuristic when the tool output omits the session ID (agent+time match, most recent unclaimed first); children are pruned to 5 per parent in memory; the store is not persisted across full app restarts (children are re-seeded via `GET /session/{id}/children` instead).
- **Review-gate resolutions:** (1) JSX semicolon blocker fixed (Task 8 now uses the null-coalesced `session?.parentID ? … : null` form); (2) tasks re-ordered so Task 8 (component) completes before Task 9 (wiring) — every task now ends green; (3) output parsing scans all `^ses` matches and skips the parent's own ID; (4) `registerChildSession` backfills `claimedByPartID` from existing claims in `claimsByPartId`; (5) the button lets terminal block states win over store-defaulted `'running'` so post-restart completed subagents show "Completed"; (6) `message.part.updated` for subagent parts invalidates the messages query so the live running state renders; (7) subagent branch uses `key={block.id}`; (8) `useSubagentChildren` added to the barrel.
- **Follow-up (out of scope, noted for later):** `chat-api.ts:31` sends `location: { directory: dir }` in the POST `/session` body, but api.json's request schema (line 5007) is `additionalProperties: false` with no `location`/`directory` — the server may ignore it. Same wire-alignment family as Task 1; fix in a separate change if session directory is needed at creation time.
