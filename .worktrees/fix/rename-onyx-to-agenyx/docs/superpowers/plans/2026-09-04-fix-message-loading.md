# Fix Message Loading - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the issue where only some messages load in the chat screen by removing the hardcoded 20-message limit and implementing cursor-based pagination.

**Architecture:** The API returns messages with a `cursor` field for pagination, but the client ignores it. We'll remove the limit, use `useInfiniteQuery` for cursor-based loading, and add a "Load More" button.

**Tech Stack:** React Query (useInfiniteQuery), React Native FlatList, TypeScript

---

## Root Cause Analysis

In `src/features/chat/api/chat-api.ts:43`, `fetchMessages` is hardcoded to:

```typescript
params: { limit: 20, order: 'desc' }
```

This fetches only the 20 most recent messages. Sessions with >20 messages silently lose their older history. The API returns a `cursor` field (`{ previous, next }`) for pagination, but it's completely ignored.

---

### Task 1: Remove limit and add cursor support to fetchMessages

**Files:**

- Modify: `src/features/chat/api/chat-api.ts`

- [ ] **Step 1: Remove the hardcoded limit and console.log, return cursor**

Replace the `fetchMessages` function:

```typescript
export interface FetchMessagesResult {
  messages: V2Message[];
  cursor: { previous: string | null; next: string | null } | null;
}

/**
 * Fetches messages for a session (V2 format) with cursor-based pagination.
 *
 * @param projectId - The project ID.
 * @param sessionId - The session to fetch messages for.
 * @param cursor - Optional cursor for fetching older messages.
 * @returns Messages array and pagination cursor.
 */
export async function fetchMessages(
  projectId: string,
  sessionId: string,
  cursor?: string
): Promise<FetchMessagesResult> {
  const params: Record<string, string> = { order: 'desc' };
  if (cursor) {
    params.cursor = cursor;
  }
  const response = await http.get<ApiData<V2Message[]>>(GET_SESSION_MESSAGES(sessionId), {
    params,
  });
  return {
    messages: response.data.data,
    cursor: response.data.cursor ?? null,
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/features/chat/api/chat-api.ts
git commit -m "fix: remove 20-message limit and add cursor pagination support"
```

---

### Task 2: Switch useMessages to useInfiniteQuery

**Files:**

- Modify: `src/features/chat/hooks/use-chat.ts`

- [ ] **Step 1: Replace useMessages with useInfiniteQuery**

Update the imports and the `useMessages` function:

```typescript
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
```

Replace the `useMessages` function:

```typescript
/**
 * Fetches messages for a session using infinite query with cursor-based pagination.
 *
 * Returns messages in ascending chronological order (oldest first).
 * Use `fetchNextPage` to load older messages.
 *
 * @param projectId - The project ID (for API scoping).
 * @param sessionId - The session to fetch messages for.
 * @returns Query result with paginated message list data.
 */
export function useMessages(projectId: string, sessionId: string) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.messages.bySession(sessionId),
    queryFn: ({ pageParam }) => fetchMessages(projectId, sessionId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.cursor?.next ?? undefined,
    enabled: !!projectId && !!sessionId,
  });

  // Flatten pages and reverse to get ascending chronological order.
  // API returns newest-first (desc), so we reverse each page then concatenate.
  const messages = query.data
    ? query.data.pages.flatMap((page) => [...page.messages].reverse())
    : undefined;

  return {
    ...query,
    data: messages,
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/features/chat/hooks/use-chat.ts
git commit -m "fix: switch useMessages to useInfiniteQuery for cursor pagination"
```

---

### Task 3: Update MessageList to support load more

**Files:**

- Modify: `src/features/chat/components/MessageList.tsx`

- [ ] **Step 1: Add load more props and button**

```typescript
interface MessageListProps {
  messages: V2Message[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onDelete?: (messageId: string) => void;
}
```

Update the component to render a "Load More" button:

```typescript
export function MessageList({
  messages,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
  onDelete,
}: MessageListProps) {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  if (isLoading) {
    return <Loading />;
  }

  if (messages.length === 0) {
    return <NotFoundSessionsScreen screenTitle="No Messages" />;
  }

  return (
    <View className="flex-1">
      {hasMore && (
        <TouchableOpacity
          onPress={onLoadMore}
          disabled={isLoadingMore}
          className="items-center py-3"
        >
          {isLoadingMore ? (
            <ActivityIndicator size="small" color="#666" />
          ) : (
            <Text className="text-sm text-ink/50">Load earlier messages</Text>
          )}
        </TouchableOpacity>
      )}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble message={item} onDelete={onDelete} />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />
    </View>
  );
}
```

Add imports:

```typescript
import { useRef, useEffect } from 'react';
import { View, TouchableOpacity, ActivityivityIndicator, Text } from 'react-native';
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/features/chat/components/MessageList.tsx
git commit -m "feat: add load more button to MessageList for pagination"
```

---

### Task 4: Update ChatScreen to use infinite query

**Files:**

- Modify: `src/features/chat/screens/ChatScreen.tsx`

- [ ] **Step 1: Update ChatScreen for infinite query**

Key changes:

1. Destructure `fetchNextPage`, `hasNextPage`, `isFetchingNextPage` from `useMessages`
2. Update `allMessages` to flatten `data.pages`
3. Pass new props to `MessageList`

Update the destructuring from `useMessages`:

```typescript
const {
  data: messages,
  isLoading,
  isError,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useMessages(projectId, sessionId);
```

Update the `allMessages` computation:

```typescript
const allMessages: V2Message[] = messages ? [...messages] : [];

streaming.forEach((state, msgId) => {
  // ... existing streaming merge logic unchanged ...
});

allMessages.sort(
  (a, b) => (a.time?.created ?? 0) - (b.time?.created ?? 0) || a.id.localeCompare(b.id)
);
```

Update the `MessageList` usage:

```typescript
<MessageList
  messages={allMessages}
  onDelete={handleDelete}
  hasMore={hasNextPage ?? false}
  isLoadingMore={isFetchingNextPage}
  onLoadMore={() => fetchNextPage()}
/>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/features/chat/screens/ChatScreen.tsx
git commit -m "fix: wire ChatScreen to infinite query for full message history"
```

---

### Task 5: Fix staleTime mismatch in query client

**Files:**

- Modify: `src/shared/api/query-client.ts`

- [ ] **Step 1: Set staleTime to 5 minutes as documented**

```typescript
staleTime: 5 * 60 * 1000, // 5 minutes
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/api/query-client.ts
git commit -m "fix: set staleTime to 5 minutes as documented in JSDoc"
```

---

### Task 6: Verify and test

- [ ] **Step 1: Run full TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Run any existing tests**

Run: `npm test` (or relevant test command)
Expected: All tests pass

- [ ] **Step 3: Manual verification checklist**

- [ ] Open a session with <20 messages — all messages visible
- [ ] Open a session with >20 messages — all messages visible (no truncation)
- [ ] "Load earlier messages" button appears when more pages exist
- [ ] Tapping "Load earlier messages" loads and prepends older messages
- [ ] Streaming messages appear correctly at the bottom during active response
- [ ] Message deletion still works
- [ ] Scroll position stays at bottom for new messages
