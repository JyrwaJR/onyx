/**
 * @file API client functions for the projects feature.
 *
 * All functions use the shared HTTP client and return typed responses.
 *
 * NOTE: The OpenCode `/project` endpoint returns a plain `Project[]`
 * array — pagination is not supported server-side, so `fetchProjects`
 * returns the whole list.
 */

import http from '@utils/http/client';
import { GET_PROJECTS, GET_PROJECT_BY_ID, FORK_PROJECT } from '../../../shared/api/endpoints';
import type { Project } from '../../../shared/api/types';
import type { ProjectListResponse } from '../types/project';

/**
 * Fetches the list of all projects.
 *
 * @returns Array of all projects from the server.
 */
export async function fetchProjects(): Promise<ProjectListResponse> {
  const response = await http.get<ProjectListResponse>(GET_PROJECTS);
  // reverse sort
  return response.data.reverse();
}

/**
 * Fetches a single project by its ID.
 *
 * @param id - The project ID to fetch.
 * @returns The project details.
 */
export async function fetchProjectById(id: string): Promise<Project> {
  const response = await http.get<Project>(GET_PROJECT_BY_ID(id));
  return response.data;
}

/**
 * Deletes a project by its ID.
 *
 * @param id - The project ID to delete.
 */
export async function deleteProject(id: string): Promise<void> {
  await http.delete(GET_PROJECT_BY_ID(id));
}

/**
 * Forks a project by its ID.
 *
 * @param id - The project ID to fork.
 * @returns The newly created forked project.
 */
export async function forkProject(id: string): Promise<Project> {
  const response = await http.post<Project>(FORK_PROJECT(id));
  return response.data;
}
