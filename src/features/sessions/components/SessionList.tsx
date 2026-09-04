/**
 * @file Session list with pull-to-refresh.
 *
 * Renders a FlatList of SessionCard components with loading, error,
 * and empty states. The OpenCode `/session` endpoint returns a plain
 * array, so there is no pagination/infinite scroll.
 */

import { useCallback } from 'react';
import { FlatList, View, ActivityIndicator, RefreshControl } from 'react-native';

import { useSessions } from '../hooks/use-sessions';
import { SessionCard } from './SessionCard';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorView } from '../../../shared/components/ErrorView';

interface SessionListProps {
  projectId: string;
}

/**
 * Session list with pull-to-refresh, loading, error, and empty states.
 *
 * Uses Claude design system colors throughout.
 *
 * @param projectId - The project ID to fetch sessions for.
 */
export function SessionList({ projectId }: SessionListProps) {
  const { data, isLoading, isError, error, refetch, isFetching } = useSessions(projectId);

  const sessions = data ?? [];

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator size="large" color="#cc785c" />
      </View>
    );
  }

  if (isError) {
    return (
      <ErrorView
        message={error instanceof Error ? error.message : 'Failed to load sessions.'}
        onRetry={handleRefresh}
      />
    );
  }

  if (sessions.length === 0) {
    return (
      <EmptyState icon="💬" title="No sessions yet" subtitle="Tap + to start a new conversation." />
    );
  }

  return (
    <FlatList
      data={sessions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SessionCard session={item} projectId={projectId} />}
      contentContainerStyle={{ padding: 16 }}
      ItemSeparatorComponent={() => <View className="h-3" />}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />}
    />
  );
}
