# Chat Message Syncing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement periodic polling for chat messages to ensure cross-device synchronization.

**Architecture:** Update `useMessages` hook to use React Query's `refetchInterval`.

**Tech Stack:** TypeScript, React Query

---

### Task 1: Update useMessages Hook

**Files:**
- Modify: `src/features/chat/hooks/use-chat.ts`

- [ ] **Step 1: Modify `useInfiniteQuery`**

Update the `useInfiniteQuery` hook to include `refetchInterval` for periodic polling.

```typescript
// src/features/chat/hooks/use-chat.ts

export function useMessages(sessionId: string) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.messages.bySession(sessionId),
    queryFn: ({ pageParam }) => {
      return fetchMessages(sessionId, pageParam as string | undefined);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.usedFallback || !lastPage.before ? undefined : lastPage.before,
    enabled: !!sessionId,
    // Add polling interval (30 seconds)
    refetchInterval: 30000,
  });

  // ... remainder of hook
```

- [ ] **Step 2: Commit**

```bash
git add src/features/chat/hooks/use-chat.ts
git commit -m "feat: add periodic polling to chat messages"
```
