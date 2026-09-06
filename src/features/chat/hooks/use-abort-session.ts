import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/query-keys';
import { abortSession } from '../api/chat-api';
import { useChatStore } from '../store/chat-store';

/**
 * Interrupts an active session.
 *
 * @param sessionId - The session ID.
 * @returns Mutation object for aborting a session.
 */
export function useAbortSession() {
  const activeSession = useChatStore((state) => state.context.activeSessionId);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => abortSession(activeSession),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(activeSession),
      });
    },
  });
}
