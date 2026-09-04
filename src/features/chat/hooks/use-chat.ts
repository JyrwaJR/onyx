import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { queryKeys } from '../../../shared/api/query-keys';
import { createSession, fetchMessages, deleteMessage, sendMessage } from '../api/chat-api';
import type { V2Message } from '../../../shared/api/types';

/**
 * Fetches messages for a session using infinite query with cursor-based pagination.
 *
 * Returns messages in ascending chronological order (oldest first).
 * Use `fetchNextPage` to load older messages when the cursor indicates more pages.
 *
 * @param projectId - The project ID (for API scoping).
 * @param sessionId - The session to fetch messages for.
 * @returns Query result with paginated message list data.
 */
export function useMessages(projectId: string, sessionId: string) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.messages.bySession(sessionId),
    queryFn: ({ pageParam }) =>
      fetchMessages(projectId, sessionId, pageParam as string | undefined),
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

/**
 * Creates a new session and navigates to the chat screen.
 *
 * @param projectId - The project to create the session in.
 * @returns Mutation object for creating a session.
 */
export function useCreateSession(projectId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title }: { title?: string }) => createSession(projectId, title),
    onSuccess: (session) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sessions.byProject(projectId),
      });
      router.push(`/projects/${projectId}/sessions/${session.id}/chat` as never);
    },
  });
}

/**
 * Deletes a message with cache invalidation.
 *
 * @param projectId - The project ID.
 * @param sessionId - The session ID.
 * @returns Mutation object for deleting a message.
 */
export function useDeleteMessage(projectId: string, sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => deleteMessage(projectId, sessionId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });
}

/**
 * Sends a message to a session, triggering the AI agent response.
 *
 * @param projectId - The project ID.
 * @param sessionId - The session ID.
 * @returns Mutation object for sending a message.
 */
export function useSendMessage(projectId: string, sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => sendMessage(sessionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });
}
