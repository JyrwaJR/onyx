import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { queryKeys } from '../../../shared/api/query-keys';
import {
  createSession,
  fetchMessages,
  deleteMessage,
  sendMessage,
} from '../api/chat-api';
import type { Message } from '../../../shared/api/types';

/**
 * Fetches messages for a session.
 *
 * @param projectId - The project ID (for API scoping).
 * @param sessionId - The session to fetch messages for.
 * @returns Query result with message list data.
 */
export function useMessages(projectId: string, sessionId: string) {
  return useQuery<Message[]>({
    queryKey: queryKeys.messages.bySession(sessionId),
    queryFn: () => fetchMessages(projectId, sessionId),
    enabled: !!projectId && !!sessionId,
  });
}

/**
 * Creates a new session and navigates to the chat screen.
 *
 * @param projectId - The project to create the session in.
 * @returns Mutation object for creating a session.
 */
export function useCreateSession(projectId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title }: { title?: string }) =>
      createSession(projectId, title),
    onSuccess: (session) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sessions.byProject(projectId),
      });
      router.push(
        `/(tabs)/projects/${projectId}/sessions/${session.id}/chat` as never
      );
    },
  });
}

/**
 * Deletes a message with cache invalidation.
 *
 * @param projectId - The project ID.
 * @param sessionId - The session ID.
 * @returns Mutation object for deleting a message.
 */
export function useDeleteMessage(projectId: string, sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) =>
      deleteMessage(projectId, sessionId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });
}

/**
 * Sends a message to a session, triggering the AI agent response.
 *
 * @param projectId - The project ID.
 * @param sessionId - The session ID.
 * @returns Mutation object for sending a message.
 */
export function useSendMessage(projectId: string, sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => sendMessage(sessionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });
}
