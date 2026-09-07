# Fix Chat Streaming Message ID Access Plan

**Goal:** Correct the `useChatStore.getState()` access in `useSessionStream.ts` to reference the nested `chat` state.

**Architecture:** Update `useSessionStream.ts` to access `useChatStore.getState().chat.streamingMessageId`.

**Tech Stack:** TypeScript, Zustand, React.

---

### Task 1: Fix `streamingMessageId` access in `useSessionStream`

**Files:**
- Modify: `src/features/chat/hooks/use-session-stream.ts`

- [ ] **Step 1: Update the access path**
Change `useChatStore.getState().streamingMessageId` to `useChatStore.getState().chat.streamingMessageId`.

- [ ] **Step 2: Commit**
```bash
git add src/features/chat/hooks/use-session-stream.ts
git commit -m "fix: update streamingMessageId access path in useSessionStream"
```
