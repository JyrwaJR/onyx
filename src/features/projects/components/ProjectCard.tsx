/**
 * @file Card component displaying a single project summary.
 *
 * Shows project title, path, and creation date. Tapping navigates
 * to the project's sessions screen.
 */

import { Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import type { Project } from '../../../shared/api/types';

interface ProjectCardProps {
  project: Project;
}

/** Card for displaying a project with navigation to its sessions. */
export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/(tabs)/projects/${project.id}/sessions` as never);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
      activeOpacity={0.7}>
      <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
        {project.title}
      </Text>
      <Text className="mt-1 text-sm text-gray-500" numberOfLines={1}>
        {project.path}
      </Text>
      {project.createdAt && (
        <Text className="mt-2 text-xs text-gray-400">
          Created {new Date(project.createdAt).toLocaleDateString()}
        </Text>
      )}
    </TouchableOpacity>
  );
}
