import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/query-keys';
import { runShellCommand } from '../api/chat-api';
import { useChatStore } from '../store/chat-store';

/**
 * Runs a shell command in a session.
 *
 * @param sessionId - The session ID.
 * @returns Mutation object for running a shell command.
 */
export function useRunShellCommand() {
  const sessionId = useChatStore((state) => state.context.activeSessionId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ command }: { command: string }) => runShellCommand(sessionId, command),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });
}
