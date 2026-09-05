import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/query-keys';
import { abortSession } from '../api/chat-api';
import { useSessionsStatus } from '@/shared/hooks/use-session-status';
import { Button } from '@/shared/components/ui/button';
import React from 'react';

/**
 * Button to abort an active session if it is busy.
 *
 * @param sessionId - The session ID to abort.
 */
export const AbortSessionButton: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const queryClient = useQueryClient();
  const { isBusy } = useSessionsStatus({ sessionId });

  const mutation = useMutation({
    mutationFn: () => abortSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });

  if (!isBusy) {
    return null;
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}>
      {mutation.isPending ? 'Aborting...' : 'Abort Session'}
    </Button>
  );
};
