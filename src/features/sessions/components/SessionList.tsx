/**
 * @file Session list with pull-to-refresh.
 *
 * Renders a FlatList of SessionCard components with loading, error,
 * and empty states. The OpenCode `/session` endpoint returns a plain
 * array, so there is no pagination/infinite scroll.
 */

import { useCallback, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import { useSessions } from '../hooks/use-sessions';
import { SessionCard } from './SessionCard';
import { ConnectionErrorScreen, Loading } from '@/shared/components/screens';
import { NewSessionForm } from './NewSessionForm';
import { Fab } from '@/shared/components/ui';
import { EmptySessionsScreen } from '../screens/no-session';

interface SessionListProps {
  projectId: string;
  dir: string;
}

/**
 * Session list with pull-to-refresh, loading, error, and empty states.
 *
 * Uses Claude design system colors throughout.
 *
 * @param projectId - The project ID to fetch sessions for.
 */
export function SessionList({ projectId, dir }: SessionListProps) {
  const { data, isLoading, isError, refetch, isFetching } = useSessions(projectId, dir);
  const [formVisible, setFormVisible] = useState(false);

  const sessions = data ?? [];

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ConnectionErrorScreen />;
  }

  if (sessions.length === 0) {
    return (
      <>
        <EmptySessionsScreen />
      </>
    );
  }

  return (
    <>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SessionCard session={item} projectId={projectId} />}
        contentContainerClassName="gap-4 py-1"
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />}
      />
      <Fab onPress={() => setFormVisible(true)} />
      <NewSessionForm dir={dir} visible={formVisible} onClose={() => setFormVisible(false)} />
    </>
  );
}
