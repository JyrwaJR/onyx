/**
 * @file Card component displaying a single project summary.
 *
 * Shows the project worktree path and creation date. Tapping navigates
 * to the project's sessions screen.
 */

import { Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import type { Project } from '../../../shared/api/types';

interface ProjectCardProps {
  project: Project;
}

/**
 * Derives the display title for a project from its worktree path.
 * Uses the last path segment (e.g. `/Users/me/foo` → `foo`), or the
 * full path when the last segment is empty (root project).
 */
function projectTitle(project: Project): string {
  const segments = project.worktree.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  return last || project.worktree;
}

/**
 * Card for displaying a project with navigation to its sessions.
 *
 * Uses Claude design system surface-card background with hairline border.
 *
 * @param project - The project data to display.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/projects/${project.id}/sessions` as never);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="rounded-lg border border-outline-variant bg-surface-container p-4"
      activeOpacity={0.7}>
      <Text className="text-base font-semibold text-on-surface" numberOfLines={1}>
        {projectTitle(project)}
      </Text>
      <Text className="mt-1 text-sm text-outline" numberOfLines={1}>
        {project.worktree}
      </Text>
      {project.vcs && (
        <Text className="mt-2 text-xs text-outline-variant">{project.vcs} repository</Text>
      )}
    </TouchableOpacity>
  );
}
