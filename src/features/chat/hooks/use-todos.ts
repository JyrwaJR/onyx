import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/query-keys';
import { useChatStore } from '../store/chat-store';
import { fetchTodos } from '../api/chat-api';
import type { Todo } from '../../../shared/api/types';

/**
 * Fetches the todo list for a session.
 *
 * The query only fires while `enabled` is true (e.g. the todo modal is
 * open). It polls at a fast interval while the agent is streaming so the
 * modal reflects live `todowrite` updates, and at a slow interval
 * otherwise. Disabled queries are not polled by React Query.
 *
 * @param sessionId - The session to fetch todos for.
 * @param enabled - When false the query is disabled (modal closed).
 * @returns Todo query result.
 */
export function useTodos(sessionId: string, enabled: boolean) {
  const isStreaming = useChatStore((s) => s.isStreaming);
  return useQuery<Todo[]>({
    queryKey: queryKeys.todos.bySession(sessionId),
    queryFn: () => fetchTodos(sessionId),
    enabled: enabled && !!sessionId,
    refetchInterval: isStreaming ? 3000 : 30000,
  });
}
