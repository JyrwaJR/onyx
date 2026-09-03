/**
 * @file Projects screen — displays the list of connected projects.
 *
 * Renders a header with the "Projects" title and the ProjectList component.
 */

import { Stack } from 'expo-router';

import { ProjectList } from '../components/ProjectList';

/** Projects screen showing the list of available projects. */
export default function ProjectsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Projects' }} />
      <ProjectList />
    </>
  );
}
