/**
 * @file API client functions for the projects feature.
 *
 * All functions use the shared HTTP client and return typed responses.
 */

import http from '@utils/http/client';
import { GET_PROJECTS, GET_PROJECT_BY_ID, FORK_PROJECT } from '../../../shared/api/endpoints';
import type { Project } from '../../../shared/api/types';
import type { ProjectListResponse } from '../types/project';

interface FetchProjectsParams {
  page?: number;
  limit?: number;
}

/**
 * Fetches a paginated list of projects.
 *
 * @param params - Optional pagination parameters (page, limit).
 * @returns Paginated list of projects with metadata.
 */
export async function fetchProjects(params?: FetchProjectsParams): Promise<ProjectListResponse> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const response = await http.get<ProjectListResponse>(GET_PROJECTS, {
    params: { page, limit },
  });
  return response.data;
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
