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
import type { Session } from '../../../shared/api/types';

/**
 * Fetches the list of sessions for a project.
 *
 * @param projectId - The project ID to list sessions for.
 * @returns Query result with the session list array.
 */
export function useSessions(projectId: string) {
  return useQuery<SessionListResponse>({
    queryKey: queryKeys.sessions.byProject(projectId),
    queryFn: () => fetchSessions(projectId),
    enabled: !!projectId,
    staleTime: 30_000,
  });
}

/**
 * Fetches a single session by ID.
 *
 * @param sessionId - The session ID to fetch.
 * @returns Query result with session detail.
 */
export function useSession(sessionId: string) {
  return useQuery<Session>({
    queryKey: queryKeys.sessions.detail(sessionId),
    queryFn: () => fetchSessionById(sessionId),
    enabled: !!sessionId,
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
          return old.map((session) => (session.id === sessionId ? { ...session, title } : session));
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
