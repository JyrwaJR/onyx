import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { queryKeys } from '../../../shared/api/query-keys';
import { createSession } from '../api/chat-api';
import { NewSessionFormData } from '@/features/sessions/validators/new-session';

/**
 * Creates a new session and navigates to the chat screen.
 *
 * @param projectId - The project to create the session in (used to
 * invalidate the session list cache and build the chat route).
 * @returns Mutation object for creating a session.
 */
export function useCreateSession() {
  const router = useRouter();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, dir }: NewSessionFormData) => createSession(title, dir),
    onSuccess: (session) => {
      if (session.projectID && session.id) {
        router.push(`/chat?sessionId=${session.id}&projectId=${session.projectID}` as never);
        queryClient.invalidateQueries({
          queryKey: queryKeys.sessions.byProject(session.projectID),
        });
        return session;
      }
    },
  });
}
