import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { queryKeys } from '../../../shared/api/query-keys';
import { createSession } from '../api/chat-api';
import { NewSessionFormData } from '@/features/sessions/validators/new-session';

/**
 * Creates a new session and navigates to the chat screen.
 *
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
        // v1 `POST /session` reports `projectID: "global"` for
        // directory-scoped sessions, so invalidating byProject(session.projectID)
        // misses the visible list (which queries by the real project id).
        // Invalidate every session list query instead so the new session
        // appears on return.
        queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
        return session;
      }
    },
  });
}
