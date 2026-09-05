import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '../../../shared/utils/http';

/**
 * Runs a command in a session.
 *
 * @param sessionId - The session ID.
 * @returns Mutation object for running a command.
 */
export function useRunCommand(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ command, arguments: args }: { command: string; arguments: string }) =>
      http.post(`/session/${sessionId}/command`, { command, arguments: args, agent: 'build' }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['session', sessionId, 'messages'],
      });
    },
  });
}
