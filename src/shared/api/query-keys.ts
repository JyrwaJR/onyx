/**
 * @file Centralized query key factory for React Query cache management.
 *
 * Using a factory pattern ensures consistent keys and enables targeted invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all sessions
 * queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
 * // Invalidate sessions for a specific project
 * queryClient.invalidateQueries({ queryKey: queryKeys.sessions.byProject('proj-123') });
 * ```
 */
export const queryKeys = {
  health: ['health'] as const,

  projects: {
    all: (url: string) => ['projects', url] as const,
    current: ['projects', 'current'] as const,
  },

  sessions: {
    all: ['sessions'] as const,
    byProject: (projectId: string) => ['sessions', projectId] as const,
    detail: (sessionId: string) => ['sessions', 'detail', sessionId] as const,
    children: (sessionId: string) => ['sessions', 'children', sessionId] as const,
  },

  messages: {
    bySession: (sessionId: string) => ['messages', sessionId] as const,
  },

  todos: {
    bySession: (sessionId: string) => ['todos', sessionId] as const,
  },
} as const;
