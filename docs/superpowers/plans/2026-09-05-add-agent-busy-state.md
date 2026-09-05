# Add Agent Busy State to Chat Store Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Track agent's busy status in `chat-store` and update it from SSE events to correctly reflect the agent's status in the chat screen.

**Architecture:** Extend the `ChatState` in `chat-store` with `busyCount: number` to support potentially parallel steps (as a counter is safer than a boolean). Add `setAgentBusy` (increment/decrement) actions. Update `useSSE` to subscribe to events indicating agent processing status. Implement robust reset mechanisms.

**Tech Stack:** React, Zustand, SSE.

---

### Task 1: Extend Chat Store with Busy State

**Files:**

- Modify: `src/features/chat/store/chat-store.ts`
- Test: `src/features/chat/store/chat-store.test.ts` (Create)

- [ ] **Step 1: Define Test for Store Changes**

```typescript
// src/features/chat/store/chat-store.test.ts
import { useChatStore } from './chat-store';

test('should track agent busy count', () => {
  const { setAgentBusy } = useChatStore.getState();
  setAgentBusy(true); // increment
  expect(useChatStore.getState().busyCount).toBe(1);
  setAgentBusy(false); // decrement
  expect(useChatStore.getState().busyCount).toBe(0);
});
```

- [ ] **Step 2: Add `busyCount` and `setAgentBusy` to `ChatState`**

```typescript
interface ChatState {
  // ... existing fields
  busyCount: number;
  setAgentBusy: (isBusy: boolean) => void;
  // ...
}
```

- [ ] **Step 3: Update `useChatStore` implementation**

```typescript
export const useChatStore = create<ChatState>((set) => ({
  // ...
  busyCount: 0,
  setAgentBusy: (isBusy) =>
    set((state) => ({
      busyCount: Math.max(0, state.busyCount + (isBusy ? 1 : -1)),
    })),
  // ...
}));
```

- [ ] **Step 4: Run tests**
- [ ] **Step 5: Commit**

### Task 2: Update SSE Hook

**Files:**

- Modify: `src/features/chat/hooks/use-sse.ts`
- Test: `src/features/chat/hooks/use-sse.test.ts` (Create)

- [ ] **Step 1: Add unit test for `useSSE` to mock event handling**
- [ ] **Step 2: Add event handling logic in `useSSE`**

```typescript
// Inside useSSE's handleEvent:
// ...
} else if (eventType === 'session.next.step.started') {
  useChatStore.getState().setAgentBusy(true);
} else if (eventType === 'session.next.step.ended') {
  useChatStore.getState().setAgentBusy(false);
  queryClient.invalidateQueries({ /* ... */ });
}
```

- [ ] **Step 3: Ensure robust reset on connection error/close**

```typescript
// Inside useSSE's cleanup function (useEffect return)
return () => {
  sse.close();
  useChatStore.getState().setAgentBusy(false); // Reset on unmount/close
};
```

- [ ] **Step 4: Run tests**
- [ ] **Step 5: Commit**

### Task 3: Integrate Busy State in Chat Screen

**Files:**

- Modify: `src/features/chat/components/ChatHeaderBar.tsx`

- [ ] **Step 1: Use `useChatStore` to access `busyCount`**
- [ ] **Step 2: Display "Thinking..." indicator if `busyCount > 0`**

```tsx
const isBusy = useChatStore((state) => state.busyCount > 0);
// ... in JSX
{
  isBusy && <Text>Thinking...</Text>;
}
```

- [ ] **Step 3: Commit**
