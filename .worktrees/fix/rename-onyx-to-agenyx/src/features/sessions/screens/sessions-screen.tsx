/**
 * @file Sessions screen — displays the list of sessions for a project.
 *
 * Renders a header with "Sessions" title, a FAB for creating new sessions,
 * and the SessionList component. Receives projectId from route params.
 */

import { useLocalSearchParams } from 'expo-router';

import { SessionList } from '../components/SessionList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Container } from '@/shared/components/layout/Container';
import { StackHeader } from '@components/ui/header';

/**
 * Sessions screen showing the list of sessions for a project.
 *
 * Uses Claude design system with coral FAB and styled header.
 *
 * @param projectId - The project ID from route params.
 */
export default function SessionsScreen() {
  const { projectId, dir } = useLocalSearchParams<{ projectId: string; dir: string }>();

  return (
    <>
      <StackHeader title="Sessions" />
      <Container>
        <SafeAreaView edges={['left', 'right']} className="flex-1">
          <SessionList dir={dir} projectId={projectId} />
        </SafeAreaView>
      </Container>
    </>
  );
}
