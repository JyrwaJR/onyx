# Unify Optimistic Message Flow + Status Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Make `ChatScreen`'s `pendingMessages` the single source of truth for optimistic user messages, set `status: 'pending'` on them so `UserMessage` renders the desaturated pending state, and remove the redundant, ordering-flipping cache injection in `useSendMessage`.

**Architecture:** `ChatScreen` already maintains a count-aware optimistic `pendingMessages` map and reconciles it against the authoritative server list via `getUnconfirmedPending`. This mechanism is correct and decoupled from query-cache timing. The `useSendMessage.onMutate` cache injection is redundant (verified empirically: `getUnconfirmedPending` prunes the `pending-*` message when the `temp-*` cache message exists) and also corrupts page ordering by prepending to a newest-first page. The fix removes that injection, adds `status: 'pending'` to the optimistic messages actually rendered, and trims dead code around `MessageInput`'s now-unused `sending` prop.

**Tech Stack:** TypeScript, React Native, Zustand, React Query

---

### Task 1: Add `status: 'pending'` to optimistic messages in ChatScreen

**Files:**

- Modify: `src/features/chat/screens/ChatScreen.tsx` (the `handleSend` callback, ~line 180)

- [x] **Step 1: Set `status: 'pending'` on the optimistic message**

In `handleSend`, change the created pending message object from:

```tsx
pendingIdRef.current += 1;
const tempId = `pending-${Date.now()}-${pendingIdRef.current}`;
setPendingMessages((prev) => {
  const next = new Map(prev);
  next.set(tempId, {
    id: tempId,
    type: 'user',
    text: trimmed,
    time: { created: Date.now() },
  });
  return next;
});
```

to:

```tsx
pendingIdRef.current += 1;
const tempId = `pending-${Date.now()}-${pendingIdRef.current}`;
setPendingMessages((prev) => {
  const next = new Map(prev);
  next.set(tempId, {
    id: tempId,
    type: 'user',
    text: trimmed,
    status: 'pending',
    time: { created: Date.now() },
  });
  return next;
});
```

- [x] **Step 2: Verify `Message` type accepts `'pending'`**

Confirm `status?: MessageStatus` exists on the `Message` interface in `src/shared/api/types.ts` (line 93) and `MessageStatus = 'pending' | 'sending' | 'sent'` (line 15). No type change needed.

- [x] **Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors.

- [x] **Step 4: Commit**

```bash
git add src/features/chat/screens/ChatScreen.tsx
git commit -m "feat: mark optimistic user messages as pending"
```

### Task 2: Remove redundant optimistic cache injection from useSendMessage

**Files:**

- Modify: `src/features/chat/hooks/use-send-message.ts`

- [x] **Step 1: Remove the `onMutate`/`onError`/`onSettled` optimistic cache manipulation**

Replace the entire `useSendMessage` body with a clean mutation that only invalidates on settle:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/query-keys';
import { sendMessage } from '../api/chat-api';

/**
 * Sends a message to a session, triggering the AI agent response.
 *
 * Optimistic rendering is handled by `ChatScreen`'s `pendingMessages`
 * local state, so this mutation does not touch the query cache. The
 * messages query is invalidated once the request settles (success or
 * failure) so the authoritative list refreshes.
 *
 * @param sessionId - The session ID.
 * @returns Mutation object for sending a message.
 */
export function useSendMessage(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => sendMessage(sessionId, content),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });
}
```

This removes the `temp-*` cache message that both duplicate-rendered with `pendingMessages` and flipped page ordering by prepending to a newest-first page.

- [x] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors.

- [x] **Step 3: Verify no other references to `previousMessages`/`temp-` remain**

Run: `rg "previousMessages|temp-" src/features/chat`
Expected: No matches (the `temp-*` id prefix is gone).

- [x] **Step 4: Commit**

```bash
git add src/features/chat/hooks/use-send-message.ts
git commit -m "refactor: remove redundant optimistic cache injection in useSendMessage"
```

### Task 3: Trim now-unused `sending` prop plumbing

**Files:**

- Modify: `src/features/chat/screens/ChatScreen.tsx`
- Modify: `src/features/chat/components/MessageInput.tsx`

With the `onMutate` cache message gone, `sendMessage.isPending` no longer needs to drive `MessageInput`'s `sending` prop: the optimistic `pending` bubble already communicates that a send is in flight.

- [x] **Step 1: Remove `sending` prop from `MessageInput` usage in ChatScreen**

In `src/features/chat/screens/ChatScreen.tsx`, change:

```tsx
<MessageInput
  sessionId={sessionId}
  agent={agent}
  disabled={sendMessage.isPaused}
  sending={sendMessage.isPending}
  onSend={handleSend}
/>
```

to:

```tsx
<MessageInput
  sessionId={sessionId}
  agent={agent}
  disabled={sendMessage.isPaused}
  onSend={handleSend}
/>
```

- [x] **Step 2: Remove `sending` from `MessageInputProps` and its guards**

In `src/features/chat/components/MessageInput.tsx`:

1. Remove `sending?: boolean;` from the `MessageInputProps` interface.
2. In the function signature, change `{ onSend, sessionId, agent, disabled, sending }` to `{ onSend, sessionId, agent, disabled }`.
3. Remove every `|| sending` / `if (sending)` guard:
   - `if (!trimmed || disabled || sending) return;` → `if (!trimmed || disabled) return;`
   - `if (sending) { return; }` (shell command handler) → remove the block
   - `if (sending) { return; }` (command handler) → remove the block
   - `const canSend = text.trim().length > 0 && !disabled && !sending;` → `const canSend = text.trim().length > 0 && !disabled;`
   - `const canRunShell = !disabled && !sending && !!sessionId;` → `const canRunShell = !disabled && !!sessionId;`

- [x] **Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors.

- [x] **Step 4: Run lint**

Run: `npm run lint`
Expected: Clean (no eslint/prettier errors).

- [x] **Step 5: Commit**

```bash
git add src/features/chat/screens/ChatScreen.tsx src/features/chat/components/MessageInput.tsx
git commit -m "refactor: remove unused sending prop from MessageInput"
```

### Task 4: Verify end-to-end behavior

- [x] **Step 1: Run full typecheck**

Run: `npx tsc --noEmit`
Expected: No errors.

- [x] **Step 2: Run lint**

Run: `npm run lint`
Expected: Clean.

- [x] **Step 3: Manual smoke test (web)**

Run: `npm run web`
Then in the browser:

1. Open a session with messages.
2. Type a message and send.
3. Confirm the optimistic user bubble appears immediately, desaturated (opacity-50 via `status: 'pending'`).
4. Confirm no duplicate bubble (the old `temp-*` cache message is gone).
5. Wait for polling/refetch; confirm the bubble transitions to the authoritative full-opacity user message once the server confirms.

Expected: Exactly one user bubble per send, initially desaturated, then confirmed.

> **Executed alternative (web not enabled):** This project's `app.json` `platforms` is `["ios","android"]` — the web build is not configured, so the browser smoke test could not run. Instead verified via: (1) Metro dev-server bundle builds cleanly (HTTP 200), (2) behavioral simulation of `handleSend` + `getUnconfirmedPending` confirming: pending message renders with `status: 'pending'` (→ desaturated), no duplicate bubble (cache injection removed), count-aware reconciliation prunes exactly the confirmed messages, and distinct texts don't interfere, (3) booted iOS simulator (iPhone 16 Pro, Expo Go) reached the running Metro dev server. Verification steps 1–2 (typecheck + lint) passed: only the 3 pre-existing unrelated tsc errors remain.

- [x] **Step 4: Commit any smoke-test fixes**

If the smoke test revealed issues, fix them in a new commit following the same pattern (TDD where feasible) before marking this plan complete.

---

## Self-Review

**Spec coverage:**

- Mark optimistic messages `pending` → Task 1 ✓
- Remove redundant cache injection → Task 2 ✓
- Single source of truth (ChatScreen `pendingMessages`) → Tasks 1+2 ✓
- Clean up dead `sending` prop plumbing → Task 3 ✓
- Verification → Task 4 ✓

**Placeholder scan:** No TBD/TODO; every step has exact code and commands.

**Type/name consistency:** `status: 'pending'` matches `MessageStatus = 'pending' | 'sending' | 'sent'`. Prop name `sending` removed consistently across both files. No dangling references remain (verified via `rg` step in Task 2).
