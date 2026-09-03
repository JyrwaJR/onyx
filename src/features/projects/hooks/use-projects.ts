/**
 * @file React Query hooks for the projects feature.
 *
 * Provides hooks for listing, viewing, deleting, and forking projects.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { queryKeys } from '../../../shared/api/query-keys';
import { fetchProjects, fetchProjectById, deleteProject, forkProject } from '../api/projects-api';
import type { ProjectListResponse } from '../types/project';

/**
 * Fetches the list of all projects.
 *
 * The OpenCode server returns all projects in a single array —
 * no pagination envelope.
 *
 * @returns Query result with project list data.
 */
export function useProjects() {
  return useQuery<ProjectListResponse>({
    queryKey: queryKeys.projects.all,
    queryFn: () => fetchProjects(),
    staleTime: 30_000,
  });
}

/**
 * Fetches a single project by ID.
 *
 * @param id - The project ID to fetch.
 * @returns Query result with project detail.
 */
export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => fetchProjectById(id),
    enabled: !!id,
  });
}

/**
 * Mutation hook for deleting a project.
 *
 * Invalidates the projects list cache on success.
 *
 * @returns Mutation object for deleting a project.
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

/**
 * Mutation hook for forking a project.
 *
 * Navigates to the new project's sessions screen on success.
 *
 * @returns Mutation object for forking a project.
 */
export function useForkProject() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: forkProject,
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      router.push(`/(tabs)/projects/${newProject.id}/sessions` as never);
    },
  });
}
