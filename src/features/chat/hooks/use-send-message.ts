import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/query-keys';
import { sendMessage } from '../api/chat-api';
import { Message } from '../../../shared/api/types';

/**
 * Sends a message to a session, triggering the AI agent response.
 *
 * @param sessionId - The session ID.
 * @returns Mutation object for sending a message.
 */
export function useSendMessage(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => sendMessage(sessionId, content),
    onMutate: async (content) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: queryKeys.messages.bySession(sessionId) });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(queryKeys.messages.bySession(sessionId));

      // Optimistically update to the new value
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        type: 'user',
        text: content,
        status: 'sending',
        time: { created: Date.now() },
      };

      // Update the cache
      queryClient.setQueryData(queryKeys.messages.bySession(sessionId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any, i: number) => {
            if (i === 0) {
              return { ...page, messages: [tempMessage, ...page.messages] };
            }
            return page;
          }),
        };
      });

      return { previousMessages };
    },
    onError: (err, content, context) => {
      queryClient.setQueryData(queryKeys.messages.bySession(sessionId), context?.previousMessages);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
      // Force refresh of the message list by re-fetching
      queryClient.refetchQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });
}
