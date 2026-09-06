# Unified Chat Store Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centralize ephemeral chat state, project/session context, and persistent settings into a unified Zustand store (`ChatStore`).

**Architecture:** Extend existing `ChatStore` to include structured nested objects for `context` and `settings`. Update components to consume the unified store, removing prop drilling for context.

**Tech Stack:** TypeScript, Zustand, React.

---

### Task 1: Update `ChatStore` Interface and Structure

**Files:**
- Modify: `src/features/chat/store/chat-store.ts`

- [ ] **Step 1: Define new interface structure**
Add `context` and `settings` interfaces, extend `ChatState` interface.

```typescript
interface ChatState {
  context: {
    projectId: string | null;
    activeSessionId: string | null;
  };
  chat: {
    isStreaming: boolean;
    streamingMessageId: string | null;
    streamingContent: ContentBlock[];
    pendingPermissionRequests: PermissionRequest[];
  };
  settings: {
    selectedAgent: string | null;
    selectedModel: string | null;
  };
  // actions...
}
```

- [ ] **Step 2: Update store implementation**
Refactor the `create<ChatState>` to initialize the new structure. Ensure existing actions still work (adapt to the new nested structure).

- [ ] **Step 3: Commit**
```bash
git add src/features/chat/store/chat-store.ts
git commit -m "refactor: restructure chat store with nested context and settings"
```

### Task 2: Migrate Components to use Unified Store

**Files:**
- Modify: `src/features/chat/components/ChatHeaderBar.tsx` (and other components using session/project props)
- Modify: `src/features/chat/components/ShellCommandSheet.tsx` (example of potential prop driller)

- [ ] **Step 1: Update `ChatHeaderBar`**
Replace `sessionId` prop with `useChatStore(s => s.context.activeSessionId)`.

- [ ] **Step 2: Verify changes**
Ensure header still displays correctly.

- [ ] **Step 3: Commit**
```bash
git add src/features/chat/components/ChatHeaderBar.tsx
git commit -m "refactor: remove session props from ChatHeaderBar"
```
*(Repeat for other components identified as prop-drillers)*

---

**Plan complete and saved to `docs/superpowers/plans/2026-09-06-unified-chat-store-implementation.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
