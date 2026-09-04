/**
 * @file Projects screen — displays the list of connected projects.
 *
 * Renders a header with the "Projects" title and the ProjectList component.
 */

import { Stack } from 'expo-router';

import { ProjectList } from '../components/ProjectList';

/**
 * Projects screen showing the list of available projects.
 *
 * Uses Claude design system with styled header.
 */
export default function ProjectsScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Projects',
          headerStyle: {
            backgroundColor: '#faf9f5',
          },
          headerTintColor: '#141413',
          headerTitleStyle: {
            fontWeight: '500',
            fontSize: 18,
            fontFamily: 'Inter',
          },
          headerShadowVisible: false,
        }}
      />
      <ProjectList />
    </>
  );
}
