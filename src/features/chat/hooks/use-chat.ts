import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { queryKeys } from '../../../shared/api/query-keys';
import { createSession, fetchMessages, deleteMessage, sendMessage } from '../api/chat-api';

/**
 * Fetches messages for a session using an infinite query with
 * `limit` + `before` pagination against the v1 API.
 *
 * Page ordering:
 * - pages accumulate newest-first: `[page0 = newest, page1 = older, ...]`
 * - each page's messages are itself in ascending order (oldest first within
 *   the page), per the raw v1 server response.
 *
 * To display ascending chronological order we reverse the page order only
 * (not the within-page order): `[...pages].reverse().flatMap(p => p.messages)`.
 *
 * Fallback handling: when the live server rejects the `before` cursor with
 * HTTP 400, the last fetch falls back to the complete message list. That
 * page is a superset of all paginated pages, so it becomes the single
 * source of the flattened data.
 *
 * @param sessionId - The session to fetch messages for.
 * @returns Query result with the flattened message list in ascending order.
 */
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
  });

  // A fallback page contains the complete message list; use it alone.
  const fallbackPage = query.data?.pages.find((page) => page.usedFallback);

  const messages = fallbackPage
    ? fallbackPage.messages
    : query.data
      ? [...query.data.pages].reverse().flatMap((page) => page.messages)
      : undefined;

  return {
    ...query,
    data: messages,
  };
}

/**
 * Creates a new session and navigates to the chat screen.
 *
 * @param projectId - The project to create the session in (used to
 * invalidate the session list cache and build the chat route).
 * @returns Mutation object for creating a session.
 */
export function useCreateSession(projectId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title }: { title?: string }) => createSession(title),
    onSuccess: (session) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sessions.byProject(projectId),
      });
      router.push(`/chat?sessionId=${session.id}&projectId=${projectId}` as never);
    },
  });
}

/**
 * Deletes a message with cache invalidation.
 *
 * @param sessionId - The session ID.
 * @returns Mutation object for deleting a message.
 */
export function useDeleteMessage(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => deleteMessage(sessionId, messageId),
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
 * @param sessionId - The session ID.
 * @returns Mutation object for sending a message.
 */
export function useSendMessage(sessionId: string) {
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
