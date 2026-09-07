/**
 * @file Projects screen — displays the list of connected projects.
 *
 * Renders a header with the "Projects" title and the ProjectList component.
 */

import { ProjectList } from '../components/ProjectList';
import { Container } from '@/shared/components/layout/Container';
import { StackHeader } from '@/shared/components/ui/header';

/**
 * Projects screen showing the list of available projects.
 *
 * Uses Claude design system with styled header.
 */
export default function ProjectsScreen() {
  return (
    <>
      <StackHeader title="Projects" />
      <Container>
        <ProjectList />
      </Container>
    </>
  );
}
