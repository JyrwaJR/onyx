# Sessions Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the sessions feature for a specific project — listing, creating (via title), deleting, and updating session titles.

**Architecture:** Follows the established feature pattern: API layer → React Query hooks → UI components → Screen. Uses existing shared infrastructure (`http` client, `queryKeys`, `Session` type, shared components). The session "creation" is title-only; actual session creation happens when the user sends their first message in the chat screen.

**Tech Stack:** Expo Router, React Query v5, React Hook Form + Zod, NativeWind, Axios, TypeScript strict.

---

## File Structure

| File                                                  | Responsibility                                         |
| ----------------------------------------------------- | ------------------------------------------------------ |
| `src/features/sessions/api/sessions-api.ts`           | HTTP functions for session CRUD                        |
| `src/features/sessions/types/session.ts`              | Feature-specific types (list response)                 |
| `src/features/sessions/validators/new-session.ts`     | Zod schema for new session form                        |
| `src/features/sessions/hooks/use-sessions.ts`         | React Query hooks for all session operations           |
| `src/features/sessions/components/SessionCard.tsx`    | Card displaying a single session                       |
| `src/features/sessions/components/SessionList.tsx`    | FlatList with pagination, loading, error, empty states |
| `src/features/sessions/components/NewSessionForm.tsx` | Modal form for creating a session                      |
| `src/features/sessions/screens/SessionsScreen.tsx`    | Screen with header, FAB, and list                      |
| `src/features/sessions/index.ts`                      | Public barrel exports                                  |

---

### Task 1: API Layer

**Files:**

- Create: `src/features/sessions/api/sessions-api.ts`
- Create: `src/features/sessions/types/session.ts`

- [ ] **Step 1: Create the session list response type**

Create `src/features/sessions/types/session.ts`:

```typescript
/**
 * @file Session feature type definitions.
 */

import type { Session } from '../../../shared/api/types';
import type { PaginationMeta } from '@sharedType/pagination-meta';

/** Paginated session list response from the API. */
export interface SessionListResponse {
  data: Session[];
  pagination: PaginationMeta;
}
```

- [ ] **Step 2: Create the API layer**

Create `src/features/sessions/api/sessions-api.ts`:

```typescript
/**
 * @file API client functions for the sessions feature.
 *
 * All functions use the shared HTTP client and return typed responses.
 * Sessions are scoped to a project via query parameters.
 */

import http from '@utils/http/client';
import { GET_SESSIONS, DELETE_SESSION } from '../../../shared/api/endpoints';
import type { Session } from '../../../shared/api/types';
import type { SessionListResponse } from '../types/session';

interface FetchSessionsParams {
  projectId: string;
  page?: number;
  limit?: number;
}

/**
 * Fetches a paginated list of sessions for a project.
 *
 * @param params - Project ID and optional pagination parameters.
 * @returns Paginated list of sessions with metadata.
 */
export async function fetchSessions({
  projectId,
  page = 1,
  limit = 20,
}: FetchSessionsParams): Promise<SessionListResponse> {
  const response = await http.get<SessionListResponse>(GET_SESSIONS, {
    params: { projectID: projectId, page, limit },
  });
  return response.data;
}

/**
 * Fetches a single session by its ID.
 *
 * @param sessionId - The session ID to fetch.
 * @returns The session details.
 */
export async function fetchSessionById(sessionId: string): Promise<Session> {
  const response = await http.get<Session>(DELETE_SESSION(sessionId));
  return response.data;
}

/**
 * Deletes a session by its ID.
 *
 * @param sessionId - The session ID to delete.
 */
export async function deleteSession(sessionId: string): Promise<void> {
  await http.delete(DELETE_SESSION(sessionId));
}

/**
 * Updates a session's title.
 *
 * @param params - Session ID and new title.
 * @returns The updated session.
 */
export async function updateSessionTitle({
  sessionId,
  title,
}: {
  sessionId: string;
  title: string;
}): Promise<Session> {
  const response = await http.patch<Session>(DELETE_SESSION(sessionId), { title });
  return response.data;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/features/sessions/api/sessions-api.ts src/features/sessions/types/session.ts
git commit -m "feat(sessions): add API layer and types for session CRUD"
```

---

### Task 2: Zod Validator

**Files:**

- Create: `src/features/sessions/validators/new-session.ts`

- [ ] **Step 1: Create the Zod schema**

Create `src/features/sessions/validators/new-session.ts`:

```typescript
/**
 * @file Zod validation schema for the new session form.
 */

import { z } from 'zod';

/** Schema for validating new session form data. */
export const newSessionSchema = z.object({
  title: z.string().max(200, 'Title must be 200 characters or fewer').optional().or(z.literal('')),
});

/** Inferred form data type from the new session schema. */
export type NewSessionFormData = z.infer<typeof newSessionSchema>;
```

- [ ] **Step 2: Commit**

```bash
git add src/features/sessions/validators/new-session.ts
git commit -m "feat(sessions): add Zod schema for new session form"
```

---

### Task 3: React Query Hooks

**Files:**

- Create: `src/features/sessions/hooks/use-sessions.ts`

- [ ] **Step 1: Create the hooks file**

Create `src/features/sessions/hooks/use-sessions.ts`:

```typescript
/**
 * @file React Query hooks for the sessions feature.
 *
 * Provides hooks for listing, viewing, deleting, and updating sessions.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '../../../shared/api/query-keys';
import {
  fetchSessions,
  fetchSessionById,
  deleteSession,
  updateSessionTitle,
} from '../api/sessions-api';
import type { SessionListResponse } from '../types/session';

/**
 * Fetches a paginated list of sessions for a project.
 *
 * @param projectId - The project ID to list sessions for.
 * @param page - Current page number (1-indexed).
 * @param limit - Number of items per page (default 20).
 * @returns Query result with session list data.
 */
export function useSessions(projectId: string, page: number, limit = 20) {
  return useQuery<SessionListResponse>({
    queryKey: [...queryKeys.sessions.byProject(projectId), page, limit],
    queryFn: () => fetchSessions({ projectId, page, limit }),
    enabled: !!projectId,
    staleTime: 30_000,
  });
}

/**
 * Fetches a single session by ID.
 *
 * @param projectId - The project ID (for query key scoping).
 * @param sessionId - The session ID to fetch.
 * @returns Query result with session detail.
 */
export function useSession(projectId: string, sessionId: string) {
  return useQuery({
    queryKey: queryKeys.sessions.detail(sessionId),
    queryFn: () => fetchSessionById(sessionId),
    enabled: !!projectId && !!sessionId,
  });
}

/**
 * Mutation hook for deleting a session.
 *
 * Invalidates the sessions list cache on success.
 *
 * @param projectId - The project ID whose session list should be invalidated.
 * @returns Mutation object for deleting a session.
 */
export function useDeleteSession(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.byProject(projectId) });
    },
  });
}

/**
 * Mutation hook for updating a session's title.
 *
 * Uses optimistic update for instant UI feedback, rolling back on error.
 *
 * @param projectId - The project ID whose session list should be invalidated.
 * @returns Mutation object for updating a session title.
 */
export function useUpdateSessionTitle(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSessionTitle,
    onMutate: async ({ sessionId, title }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.sessions.byProject(projectId) });

      const previousSessions = queryClient.getQueriesData<SessionListResponse>({
        queryKey: queryKeys.sessions.byProject(projectId),
      });

      queryClient.setQueriesData<SessionListResponse>(
        { queryKey: queryKeys.sessions.byProject(projectId) },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((session) =>
              session.id === sessionId ? { ...session, title } : session
            ),
          };
        }
      );

      return { previousSessions };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousSessions) {
        for (const [key, data] of context.previousSessions) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.byProject(projectId) });
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/sessions/hooks/use-sessions.ts
git commit -m "feat(sessions): add React Query hooks for sessions"
```

---

### Task 4: SessionCard Component

**Files:**

- Create: `src/features/sessions/components/SessionCard.tsx`

- [ ] **Step 1: Create the SessionCard component**

Create `src/features/sessions/components/SessionCard.tsx`:

```typescript
/**
 * @file Card component displaying a single session summary.
 *
 * Shows session title (or "Untitled"), relative timestamp.
 * Tapping navigates to the chat screen for that session.
 */

import { Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import type { Session } from '../../../shared/api/types';
import { useDeleteSession } from '../hooks/use-sessions';

interface SessionCardProps {
  session: Session;
  projectId: string;
}

function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

/** Card for displaying a session with navigation and swipe-to-delete. */
export function SessionCard({ session, projectId }: SessionCardProps) {
  const router = useRouter();
  const deleteSession = useDeleteSession(projectId);

  const handlePress = () => {
    router.push(`/(tabs)/projects/${projectId}/sessions/${session.id}/chat` as never);
  };

  const handleLongPress = () => {
    Alert.alert('Delete Session', `Delete "${session.title || 'Untitled'}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteSession.mutate(session.id),
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={handleLongPress}
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
      activeOpacity={0.7}>
      <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
        {session.title || 'Untitled'}
      </Text>
      <Text className="mt-1 text-xs text-gray-400">
        {getRelativeTime(session.updatedAt)}
      </Text>
    </TouchableOpacity>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/sessions/components/SessionCard.tsx
git commit -m "feat(sessions): add SessionCard component with delete"
```

---

### Task 5: SessionList Component

**Files:**

- Create: `src/features/sessions/components/SessionList.tsx`

- [ ] **Step 1: Create the SessionList component**

Create `src/features/sessions/components/SessionList.tsx`:

```typescript
/**
 * @file Paginated session list with pull-to-refresh and infinite scroll.
 *
 * Renders a FlatList of SessionCard components with loading, error,
 * and empty states. Follows the same pattern as ProjectList.
 */

import { useState, useCallback } from 'react';
import { FlatList, View, ActivityIndicator, RefreshControl } from 'react-native';

import { useSessions } from '../hooks/use-sessions';
import { SessionCard } from './SessionCard';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorView } from '../../../shared/components/ErrorView';

const PAGE_SIZE = 20;

interface SessionListProps {
  projectId: string;
}

/** Paginated session list with pull-to-refresh and infinite scroll. */
export function SessionList({ projectId }: SessionListProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } = useSessions(projectId, page, PAGE_SIZE);

  const sessions = data?.data ?? [];
  const pagination = data?.pagination;

  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  const handleEndReached = useCallback(() => {
    if (pagination && page < pagination.totalPages && !isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [pagination, page, isFetching]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (isError) {
    return (
      <ErrorView
        message={error instanceof Error ? error.message : 'Failed to load sessions.'}
        onRetry={handleRefresh}
      />
    );
  }

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon="💬"
        title="No sessions yet"
        subtitle="Tap + to start a new conversation."
      />
    );
  }

  return (
    <FlatList
      data={sessions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SessionCard session={item} projectId={projectId} />}
      contentContainerStyle={{ padding: 16 }}
      ItemSeparatorComponent={() => <View className="h-3" />}
      refreshControl={
        <RefreshControl refreshing={isFetching && page === 1} onRefresh={handleRefresh} />
      }
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetching && page > 1 ? (
          <View className="py-4">
            <ActivityIndicator size="small" color="#4F46E5" />
          </View>
        ) : null
      }
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/sessions/components/SessionList.tsx
git commit -m "feat(sessions): add SessionList with pagination"
```

---

### Task 6: NewSessionForm Component

**Files:**

- Create: `src/features/sessions/components/NewSessionForm.tsx`

- [ ] **Step 1: Create the NewSessionForm component**

Create `src/features/sessions/components/NewSessionForm.tsx`:

```typescript
/**
 * @file Modal form for creating a new session.
 *
 * Uses React Hook Form with Zod validation. On submit, the title
 * is stored and the user navigates to the chat screen. The actual
 * session is created when the first message is sent.
 */

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { newSessionSchema, type NewSessionFormData } from '../validators/new-session';

interface NewSessionFormProps {
  projectId: string;
  visible: boolean;
  onClose: () => void;
}

/** Modal form for creating a new session with title input. */
export function NewSessionForm({ projectId, visible, onClose }: NewSessionFormProps) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewSessionFormData>({
    resolver: zodResolver(newSessionSchema),
    defaultValues: { title: '' },
  });

  const onSubmit = (data: NewSessionFormData) => {
    const title = data.title?.trim() || undefined;
    reset();
    onClose();
    router.push(
      `/(tabs)/projects/${projectId}/sessions/new${title ? `?title=${encodeURIComponent(title)}` : ''}` as never,
    );
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/50">
        <View className="rounded-t-2xl bg-white p-6 pb-8">
          <Text className="mb-4 text-lg font-semibold text-gray-900">New Session</Text>

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900"
                placeholder="Session title (optional)"
                placeholderTextColor="#9CA3AF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoFocus
              />
            )}
          />

          {errors.title && (
            <Text className="mt-1 text-sm text-red-500">{errors.title.message}</Text>
          )}

          <View className="mt-6 flex-row gap-3">
            <TouchableOpacity
              onPress={handleCancel}
              className="flex-1 rounded-lg border border-gray-300 py-3"
              activeOpacity={0.7}>
              <Text className="text-center text-base font-medium text-gray-700">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="flex-1 rounded-lg bg-indigo-600 py-3"
              activeOpacity={0.7}>
              <Text className="text-center text-base font-semibold text-white">Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/sessions/components/NewSessionForm.tsx
git commit -m "feat(sessions): add NewSessionForm with Zod validation"
```

---

### Task 7: SessionsScreen

**Files:**

- Create: `src/features/sessions/screens/SessionsScreen.tsx`

- [ ] **Step 1: Create the SessionsScreen**

Create `src/features/sessions/screens/SessionsScreen.tsx`:

```typescript
/**
 * @file Sessions screen — displays the list of sessions for a project.
 *
 * Renders a header with "Sessions" title, a FAB for creating new sessions,
 * and the SessionList component. Receives projectId from route params.
 */

import { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { SessionList } from '../components/SessionList';
import { NewSessionForm } from '../components/NewSessionForm';

/** Sessions screen showing the list of sessions for a project. */
export default function SessionsScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const [formVisible, setFormVisible] = useState(false);

  return (
    <>
      <Stack.Screen options={{ title: 'Sessions' }} />
      <View className="flex-1 bg-white">
        <SessionList projectId={projectId} />

        <TouchableOpacity
          onPress={() => setFormVisible(true)}
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-indigo-600 shadow-lg"
          activeOpacity={0.8}>
          <Text className="text-2xl font-bold text-white">+</Text>
        </TouchableOpacity>

        <NewSessionForm
          projectId={projectId}
          visible={formVisible}
          onClose={() => setFormVisible(false)}
        />
      </View>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/sessions/screens/SessionsScreen.tsx
git commit -m "feat(sessions): add SessionsScreen with FAB and form"
```

---

### Task 8: Barrel Exports

**Files:**

- Modify: `src/features/sessions/index.ts`

- [ ] **Step 1: Update the barrel exports**

Replace contents of `src/features/sessions/index.ts`:

```typescript
export {
  useSessions,
  useSession,
  useDeleteSession,
  useUpdateSessionTitle,
} from './hooks/use-sessions';
export { SessionCard } from './components/SessionCard';
export { SessionList } from './components/SessionList';
export { NewSessionForm } from './components/NewSessionForm';
export type { SessionListResponse } from './types/session';
```

- [ ] **Step 2: Commit**

```bash
git add src/features/sessions/index.ts
git commit -m "feat(sessions): add barrel exports for sessions feature"
```

---

### Task 9: Final Commit

- [ ] **Step 1: Run typecheck and lint**

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **Step 2: Squash all session commits into one**

```bash
git reset --soft HEAD~8
git commit -m "feat(sessions): sessions feature with list, create, delete, and title update"
```
