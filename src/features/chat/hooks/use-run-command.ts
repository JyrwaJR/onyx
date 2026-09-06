import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '../../../shared/utils/http';
import { RUN_SHELL_COMMAND } from '../../../shared/api/endpoints';
import { useChatStore } from '../store/chat-store';

/**
 * Runs a command in a session.
 *
 * @param sessionId - The session ID.
 * @returns Mutation object for running a command.
 */
export function useRunCommand() {
  const sessionId = useChatStore((state) => state.context.activeSessionId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ command, arguments: args }: { command: string; arguments: string }) =>
      http.post(RUN_SHELL_COMMAND(sessionId), { command, arguments: args, agent: 'build' }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['session', sessionId, 'messages'],
      });
      queryClient.invalidateQueries({
        queryKey: ['skills'],
      });
    },
  });
}
