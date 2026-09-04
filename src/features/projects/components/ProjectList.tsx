/**
 * @file Project list with pull-to-refresh.
 *
 * Renders a FlatList of ProjectCard components with loading, error,
 * and empty states. Supports pull-to-refresh.
 */

import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, View, Text, TouchableOpacity, TextInput } from 'react-native';

import { useProjects } from '../hooks/use-projects';
import { ProjectCard } from './ProjectCard';
import {
  ConnectionErrorScreen,
  Loading,
  NotFoundSessionsScreen,
} from '@/shared/components/screens';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Project list with pull-to-refresh, loading, error, and empty states.
 *
 * Uses Claude design system colors throughout.
 */
export function ProjectList() {
  const { data: projects, isLoading, isError, refetch, isFetching } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');

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
    <View className="gap-y-4 pt-2">
      {/* Search Bar */}
      <View className="flex-row items-center rounded-md border border-[#dac1ba]/40 bg-[#f6f3f1] px-3 py-2.5">
        <MaterialIcons name="search" size={18} color="#615e56" />
        <TextInput
          className="ml-2 flex-1 p-2 text-sm text-[#1c1c1a]"
          placeholder="Search repositories..."
          placeholderTextColor="#615e56"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            borderRadius: 0,
            borderWidth: 0,
            backgroundColor: 'transparent',
          }}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={18} color="#615e56" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Section Header */}
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-medium uppercase tracking-wider text-[#615e56]">
          Recent Local Repos
        </Text>
        <Text className="text-xs font-medium text-[#8f482f]">{projects.length} active</Text>
      </View>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProjectCard project={item} />}
        contentContainerClassName="gap-5 pb-5"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />}
      />
    </View>
  );
}
