/**
 * @file Paginated session list with pull-to-refresh and infinite scroll.
 *
 * Renders a FlatList of SessionCard components with loading, error,
 * and empty states. Follows the same pattern as ProjectList.
 */

import { useState, useCallback } from 'react';
import { FlatList, View, ActivityIndicator, RefreshControl } from 'react-native';

import { useSessions } from '../hooks/use-sessions';
import { SessionCard } from './SessionCard';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorView } from '../../../shared/components/ErrorView';

const PAGE_SIZE = 20;

interface SessionListProps {
  projectId: string;
}

/** Paginated session list with pull-to-refresh and infinite scroll. */
export function SessionList({ projectId }: SessionListProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } = useSessions(
    projectId,
    page,
    PAGE_SIZE
  );

  const sessions = data?.data ?? [];
  const pagination = data?.pagination;

  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  const handleEndReached = useCallback(() => {
    if (pagination && page < pagination.totalPages && !isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [pagination, page, isFetching]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
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
      refreshControl={
        <RefreshControl refreshing={isFetching && page === 1} onRefresh={handleRefresh} />
      }
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetching && page > 1 ? (
          <View className="py-4">
            <ActivityIndicator size="small" color="#4F46E5" />
          </View>
        ) : null
      }
    />
  );
}
