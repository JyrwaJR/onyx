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
 * `retry: 0` deliberately overrides the app-wide `mutations: { retry: 1 }`
 * default: sending a message is not idempotent. If the first POST reached
 * the server but the response was lost (timeout, network blip), an
 * automatic retry would post the same message a second time, producing a
 * duplicate server-side. Failures are surfaced via `ChatScreen` so the
 * user can intentionally re-send.
 *
 * @param sessionId - The session ID.
 * @returns Mutation object for sending a message.
 */
export function useSendMessage(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => sendMessage(sessionId, content),
    retry: 0,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });
}
