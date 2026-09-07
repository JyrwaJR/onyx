/**
 * @file API client functions for the projects feature.
 *
 * All functions use the shared HTTP client and return typed responses.
 *
 * NOTE: The v1 OpenCode `/project` endpoint returns a plain `Project[]`
 * array — pagination is not supported server-side, so `fetchProjects`
 * returns the whole list.
 */

import http from '@utils/http/client';
import { GET_PROJECTS } from '../../../shared/api/endpoints';
import type { ProjectListResponse } from '../types/project';

/**
 * Fetches the list of all projects.
 *
 * @returns Array of all projects from the server (newest first).
 */
export async function fetchProjects(): Promise<ProjectListResponse> {
  const response = await http.get<ProjectListResponse>(GET_PROJECTS);
  // reverse sort
  return response.data.reverse();
}
