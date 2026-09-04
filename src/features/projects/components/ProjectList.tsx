/**
 * @file Project list with pull-to-refresh.
 *
 * Renders a FlatList of ProjectCard components with loading, error,
 * and empty states. Supports pull-to-refresh.
 */

import { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import { useProjects } from '../hooks/use-projects';
import { ProjectCard } from './ProjectCard';
import {
  ConnectionErrorScreen,
  Loading,
  NotFoundSessionsScreen,
} from '@/shared/components/screens';

/**
 * Project list with pull-to-refresh, loading, error, and empty states.
 *
 * Uses Claude design system colors throughout.
 */
export function ProjectList() {
  const { data: projects, isLoading, isError, refetch, isFetching } = useProjects();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ConnectionErrorScreen />;
  }

  if (!projects || projects.length === 0) {
    return <NotFoundSessionsScreen />;
  }

  return (
    <FlatList
      data={projects}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProjectCard project={item} />}
      contentContainerClassName="gap-5 pt-1 pb-5"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />}
    />
  );
}
