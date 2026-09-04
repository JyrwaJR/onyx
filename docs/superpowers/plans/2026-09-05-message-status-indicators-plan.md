# Message Status Indicators Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `status` field to `V2Message` and display `sending`/`pending` states in `UserMessage`.

**Architecture:**
1. Extend `V2Message` type.
2. Update `UserMessage` to react to `status`.
3. Ensure optimistic updates set this status.

**Tech Stack:** React Native, TypeScript

---

### Task 1: Update Data Model

**Files:**
- Modify: `src/shared/api/types.ts`

- [ ] **Step 1: Define `MessageStatus`**

Add this type definition near `V2Message`.

```ts
export type MessageStatus = 'pending' | 'sending' | 'sent';
```

- [ ] **Step 2: Add `status` to `V2Message`**

Modify `V2Message` interface.

```ts
export interface V2Message {
  // ... existing fields
  status?: MessageStatus;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/shared/api/types.ts
git commit -m "feat: add status field to V2Message"
```

### Task 2: Update UserMessage Component

**Files:**
- Modify: `src/features/chat/components/UserMessage.tsx`

- [ ] **Step 1: Add status prop/handling**

Update `UserMessageProps` and render logic to handle `message.status`.

```tsx
// src/features/chat/components/UserMessage.tsx

export const UserMessage = memo(function UserMessage({ message }: UserMessageProps) {
  const isPendingOrSending = message.status === 'pending' || message.status === 'sending';

  return (
    <View className={`mb-4 ml-8 items-end ${isPendingOrSending ? 'opacity-70' : ''}`}>
      <View className="rounded-xl bg-[#8f482f] p-4 flex-row items-center">
        <Text className="text-sm leading-relaxed text-white">{message.text}</Text>
        {message.status === 'sending' && (
          <ActivityIndicator size="small" color="#ffffff" className="ml-2" />
        )}
      </View>
      {/* ... time text */}
    </View>
  );
});
```

- [ ] **Step 2: Import ActivityIndicator**

Ensure `ActivityIndicator` is imported from `react-native`.

- [ ] **Step 3: Commit**

```bash
git add src/features/chat/components/UserMessage.tsx
git commit -m "feat: update UserMessage with status indicators"
```

### Task 3: Implement Optimistic Update

**Files:**
- Modify: `src/features/chat/hooks/use-chat.ts`

- [ ] **Step 1: Update useSendMessage hook**

Update the `useSendMessage` mutation to set the status optimistically if possible, or ensure it's passed down correctly to the message list. (Note: This may require updating how `onMutate` updates the query cache).

```ts
// src/features/chat/hooks/use-chat.ts

// (Example of conceptual optimistic update update logic)
export function useSendMessage(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => sendMessage(sessionId, content),
    onMutate: async (content) => {
        // ... (Optimistically update query cache with new message, status: 'pending')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/chat/hooks/use-chat.ts
git commit -m "feat: setup optimistic status update"
```
