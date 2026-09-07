import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/query-keys';
import { deleteMessage } from '../api/chat-api';
import { useChatStore } from '../store/chat-store';

/**
 * Deletes a message with cache invalidation.
 *
 * @param sessionId - The session ID.
 * @returns Mutation object for deleting a message.
 */
export function useDeleteMessage() {
  const queryClient = useQueryClient();
  const sessionId = useChatStore((state) => state.context.activeSessionId);
  return useMutation({
    mutationFn: (messageId: string) => deleteMessage(sessionId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
      // Invalidate the query just in case it is called outside of mutate context
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });
}
