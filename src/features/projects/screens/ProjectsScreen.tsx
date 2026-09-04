/**
 * @file Projects screen — displays the list of connected projects.
 *
 * Renders a header with the "Projects" title and the ProjectList component.
 */

import { ProjectList } from '../components/ProjectList';

/**
 * Projects screen showing the list of available projects.
 *
 * Uses Claude design system with styled header.
 */
export default function ProjectsScreen() {
  return (
    <>
      <ProjectList />
    </>
  );
}
