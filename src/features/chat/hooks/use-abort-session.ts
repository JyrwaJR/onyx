import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/query-keys';
import { abortSession } from '../api/chat-api';

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
