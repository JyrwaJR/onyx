/**
 * @file API client functions for the sessions feature.
 *
 * All functions use the shared HTTP client and return typed responses.
 *
 * NOTE: The OpenCode `/session` endpoint returns a plain `Session[]`
 * array (no pagination envelope). `fetchSessions` returns the whole list,
 * optionally filtered by `projectID`.
 */

import http from '@utils/http/client';
import {
  GET_SESSIONS,
  DELETE_SESSION,
  GET_SESSION_BY_ID,
  GET_SESSION_CHILDREN,
} from '../../../shared/api/endpoints';
import type { SessionT } from '../../../shared/api/types';
import type { SessionListResponse } from '../types/session';

/**
 * Fetches the list of sessions for a project.
 *
 * NOTE: The OpenCode server currently ignores the `?projectID=` query
 * parameter and returns all sessions regardless. We fetch the full list
 * (without the param) and filter client-side to the requested project.
 *
 * @param projectId - The project ID to filter sessions by.
 * @returns Sessions scoped to the project.
 */
export async function fetchSessions(dir?: string): Promise<SessionListResponse> {
  const response = await http.get<SessionListResponse>(GET_SESSIONS, {
    params: { directory: dir },
  });

  const sessions = response.data;

  return sessions;
}

/**
 * Fetches the child (subagent) sessions forked from a parent session.
 *
 * Uses the dedicated `GET /session/{sessionID}/children` endpoint, which
 * returns `Session[]` whose `parentID` points back at the parent.
 *
 * @param sessionId - The parent session ID.
 * @returns The child sessions of the parent.
 */
export async function fetchSessionChildren(sessionId: string): Promise<SessionListResponse> {
  const response = await http.get<SessionListResponse>(GET_SESSION_CHILDREN(sessionId));
  return response.data;
}

/**
 * Fetches a single session by its ID.
 *
 * @param sessionId - The session ID to fetch.
 * @returns The session details.
 */
export async function fetchSessionById(sessionId: string): Promise<SessionT> {
  const response = await http.get<SessionT>(GET_SESSION_BY_ID(sessionId));
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
}): Promise<SessionT> {
  const response = await http.patch<SessionT>(GET_SESSION_BY_ID(sessionId), { title });
  return response.data;
}
