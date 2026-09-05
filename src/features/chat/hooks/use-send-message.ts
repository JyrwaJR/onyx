import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/query-keys';
import { sendMessage } from '../api/chat-api';

/**
 * Sends a message to a session, triggering the AI agent response.
 *
 * Optimistic rendering is handled by `ChatScreen`'s `pendingMessages`
 * local state, so this mutation does not touch the query cache. The
 * messages query is invalidated once the request settles (success or
 * failure) so the authoritative list refreshes.
 *
 * @param sessionId - The session ID.
 * @returns Mutation object for sending a message.
 */
export function useSendMessage(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => sendMessage(sessionId, content),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });
}
