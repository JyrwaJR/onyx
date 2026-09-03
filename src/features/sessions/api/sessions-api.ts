/**
 * @file API client functions for the sessions feature.
 *
 * All functions use the shared HTTP client and return typed responses.
 * Sessions are scoped to a project via query parameters.
 */

import http from '@utils/http/client';
import { GET_SESSIONS, DELETE_SESSION } from '../../../shared/api/endpoints';
import type { Session } from '../../../shared/api/types';
import type { SessionListResponse } from '../types/session';

interface FetchSessionsParams {
  projectId: string;
  page?: number;
  limit?: number;
}

/**
 * Fetches a paginated list of sessions for a project.
 *
 * @param params - Project ID and optional pagination parameters.
 * @returns Paginated list of sessions with metadata.
 */
export async function fetchSessions({
  projectId,
  page = 1,
  limit = 20,
}: FetchSessionsParams): Promise<SessionListResponse> {
  const response = await http.get<SessionListResponse>(GET_SESSIONS, {
    params: { projectID: projectId, page, limit },
  });
  return response.data;
}

/**
 * Fetches a single session by its ID.
 *
 * @param sessionId - The session ID to fetch.
 * @returns The session details.
 */
export async function fetchSessionById(sessionId: string): Promise<Session> {
  const response = await http.get<Session>(DELETE_SESSION(sessionId));
  return response.data;
}

/**
 * Deletes a session by its ID.
 *
 * @param sessionId - The session ID to delete.
 */
export async function deleteSession(sessionId: string): Promise<void> {
  await http.delete(DELETE_SESSION(sessionId));
}

/**
 * Updates a session's title.
 *
 * @param params - Session ID and new title.
 * @returns The updated session.
 */
export async function updateSessionTitle({
  sessionId,
  title,
}: {
  sessionId: string;
  title: string;
}): Promise<Session> {
  const response = await http.patch<Session>(DELETE_SESSION(sessionId), { title });
  return response.data;
}
