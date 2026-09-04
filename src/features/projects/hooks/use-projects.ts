/**
 * @file React Query hooks for the projects feature.
 */

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/shared/api/query-keys';
import { fetchProjects } from '../api/projects-api';

/**
 * Fetches the list of all projects.
 *
 * The OpenCode server returns all projects in a single array —
 * no pagination envelope.
 *
 * @returns Query result with project list data.
 */
export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: () => fetchProjects(),
  });
}
