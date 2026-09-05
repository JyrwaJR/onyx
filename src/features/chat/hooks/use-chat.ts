import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { queryKeys } from '../../../shared/api/query-keys';
import { createSession, fetchMessages, deleteMessage, sendMessage } from '../api/chat-api';
import { NewSessionFormData } from '@/features/sessions/validators/new-session';
import { V2Message } from '../../../shared/api/types';

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
    refetchInterval: 3000,
    refetchIntervalInBackground: false,
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
export function useCreateSession() {
  const router = useRouter();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, dir }: NewSessionFormData) => createSession(title, dir),
    onSuccess: (session) => {
      if (session.projectID && session.id) {
        router.push(`/chat?sessionId=${session.id}&projectId=${session.projectID}` as never);
        queryClient.invalidateQueries({
          queryKey: queryKeys.sessions.byProject(session.projectID),
        });
        return session;
      }
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
      // Invalidate the query just in case it is called outside of mutate context
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
    onMutate: async (content) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: queryKeys.messages.bySession(sessionId) });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(queryKeys.messages.bySession(sessionId));

      // Optimistically update to the new value
      const tempMessage: V2Message = {
        id: `temp-${Date.now()}`,
        type: 'user',
        text: content,
        status: 'sending',
        time: { created: Date.now() },
      };

      // Update the cache
      queryClient.setQueryData(queryKeys.messages.bySession(sessionId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any, i: number) => {
            if (i === 0) {
              return { ...page, messages: [tempMessage, ...page.messages] };
            }
            return page;
          }),
        };
      });

      return { previousMessages };
    },
    onError: (err, content, context) => {
      queryClient.setQueryData(queryKeys.messages.bySession(sessionId), context?.previousMessages);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
      // Force refresh of the message list by re-fetching
      queryClient.refetchQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });
}

/**
 * Interrupts an active session.
 *
 * @param sessionId - The session ID.
 * @returns Mutation object for aborting a session.
 */
export function useAbortSession(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => abortSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });
}
