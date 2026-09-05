import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/query-keys';
import { fetchMessages } from '../api/chat-api';
import { useChatStore } from '../store/chat-store';

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
  const isStreaming = useChatStore((s) => s.isStreaming);
  const query = useInfiniteQuery({
    queryKey: queryKeys.messages.bySession(sessionId),
    refetchInterval: isStreaming ? 3000 : 30000,
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
