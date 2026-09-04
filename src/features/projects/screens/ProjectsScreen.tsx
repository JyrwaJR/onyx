/**
 * @file Projects screen — displays the list of connected projects.
 *
 * Renders a header with the "Projects" title and the ProjectList component.
 */

import { SafeAreaView } from 'react-native-safe-area-context';
import { ProjectList } from '../components/ProjectList';

/**
 * Projects screen showing the list of available projects.
 *
 * Uses Claude design system with styled header.
 */
export default function ProjectsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ProjectList />
    </SafeAreaView>
  );
}
