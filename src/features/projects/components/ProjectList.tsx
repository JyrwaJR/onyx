/**
 * @file Project list with pull-to-refresh.
 *
 * Renders a FlatList of ProjectCard components with loading, error,
 * and empty states. Supports pull-to-refresh.
 */

import { useCallback } from 'react';
import { FlatList, View, ActivityIndicator, Text, RefreshControl } from 'react-native';

import { useProjects } from '../hooks/use-projects';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ErrorView } from '../../../shared/components/ErrorView';

/**
 * Project list with pull-to-refresh, loading, error, and empty states.
 *
 * Uses Claude design system colors throughout.
 */
export function ProjectList() {
  const { data: projects, isLoading, isError, error, refetch, isFetching } = useProjects();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator size="large" color="#cc785c" />
        <Text className="mt-4 text-base text-muted">Loading projects...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <ErrorView
        message={error instanceof Error ? error.message : 'Failed to load projects.'}
        onRetry={handleRefresh}
      />
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="No projects yet"
        subtitle="Connect to a server to see your projects."
      />
    );
  }

  return (
    <FlatList
      data={projects}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProjectCard project={item} />}
      contentContainerStyle={{ padding: 16 }}
      ItemSeparatorComponent={() => <View className="h-3" />}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />}
    />
  );
}
