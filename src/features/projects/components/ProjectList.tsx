/**
 * @file Paginated project list with pull-to-refresh and infinite scroll.
 *
 * Renders a FlatList of ProjectCard components with loading, error,
 * and empty states. Supports pull-to-refresh and infinite scroll pagination.
 */

import { useState, useCallback } from 'react';
import { FlatList, View, ActivityIndicator, Text, RefreshControl } from 'react-native';

import { useProjects } from '../hooks/use-projects';
import { ProjectCard } from './ProjectCard';

const PAGE_SIZE = 20;

/** Paginated project list with pull-to-refresh and infinite scroll. */
export function ProjectList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } = useProjects(page, PAGE_SIZE);

  const projects = data?.data ?? [];
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
        <Text className="mt-4 text-base text-gray-500">Loading projects...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-4xl">⚠️</Text>
        <Text className="mt-4 text-center text-base text-gray-700">
          {error instanceof Error ? error.message : 'Failed to load projects.'}
        </Text>
        <Text
          onPress={handleRefresh}
          className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white">
          Retry
        </Text>
      </View>
    );
  }

  if (projects.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-5xl">📭</Text>
        <Text className="mt-4 text-lg font-semibold text-gray-700">No projects yet</Text>
        <Text className="mt-2 text-center text-sm text-gray-500">
          Connect to a server to see your projects.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={projects}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProjectCard project={item} />}
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
