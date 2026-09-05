import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/query-keys';
import { updateSessionTitle } from '../api/sessions-api';
import type { SessionListResponse } from '../types/session';

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
