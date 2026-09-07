# Fix Chat Screen Permission Access Plan

**Goal:** Correct the store selector in `ChatScreen.tsx` to access `pendingPermissionRequests` from the nested `chat` object in the unified `ChatStore`.

**Architecture:** Update the Zustand selector in `ChatScreen.tsx` to match the new `ChatStore` structure.

**Tech Stack:** TypeScript, Zustand, React.

---

### Task 1: Fix `pendingPermissionRequests` selector in `ChatScreen`

**Files:**
- Modify: `src/features/chat/screens/ChatScreen.tsx`

- [ ] **Step 1: Update selector**
Change `useChatStore((state) => state.pendingPermissionRequests)` to `useChatStore((state) => state.chat.pendingPermissionRequests)`.

- [ ] **Step 2: Commit**
```bash
git add src/features/chat/screens/ChatScreen.tsx
git commit -m "fix: update pendingPermissionRequests selector in ChatScreen"
```
