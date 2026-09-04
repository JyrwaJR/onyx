/**
 * @file Card component displaying a single project summary.
 *
 * Shows the project worktree path and creation date. Tapping navigates
 * to the project's sessions screen.
 */

import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import type { Project } from '../../../shared/api/types';
import { MaterialIcons } from '@expo/vector-icons';

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
    router.push(`/sessions?dir=${project.worktree}&projectId=${project.id}` as never);
  };

  return (
    <TouchableOpacity
      key={project.id}
      onPress={handlePress}
      activeOpacity={0.8}
      className="rounded-md border border-[#dac1ba]/60 bg-[#f0edeb] p-4 active:border-[#87736d]/50">
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1 flex-row items-start gap-3">
          <View className="h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#dac1ba]/40 bg-[#ebe8e5]">
            <MaterialIcons name={'folder'} size={20} color="#8f482f" />
          </View>

          <View className="flex-1 gap-0.5">
            <Text
              className="text-base font-semibold tracking-tight text-[#1c1c1a]"
              numberOfLines={1}>
              {projectTitle(project)}
            </Text>

            <View className="flex-row pt-0.5">
              <View className="flex-row items-center gap-1 rounded bg-[#e5e2e0]/60 px-2 py-0.5">
                <View className="h-1.5 w-1.5 rounded-full bg-[#00685f]" />
                <Text className="text-xs font-medium text-[#615e56]">{project.vcs} repository</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {}}
          activeOpacity={0.7}
          className="rounded-lg p-1"
          accessibilityLabel={`More options for ${projectTitle(project)}`}>
          <MaterialIcons name="more-vert" size={20} color="#615e56" />
        </TouchableOpacity>
      </View>

      {/* Path Footer */}
      <View className="mt-3 flex-row items-center gap-1.5 border-t border-[#dac1ba]/30 pt-3">
        <MaterialIcons name="terminal" size={15} color="#615e56" />
        <Text
          className="flex-1 font-mono text-xs text-[#615e56]"
          numberOfLines={1}
          ellipsizeMode="middle">
          {project.worktree}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
