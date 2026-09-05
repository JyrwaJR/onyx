import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/query-keys';
import { runShellCommand } from '../api/chat-api';

/**
 * Runs a shell command in a session.
 *
 * @param sessionId - The session ID.
 * @returns Mutation object for running a shell command.
 */
export function useRunShellCommand(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ command, agent }: { command: string; agent: string }) =>
      runShellCommand(sessionId, command, agent),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });
}
