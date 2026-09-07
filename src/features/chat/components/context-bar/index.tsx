import { memo } from 'react';
import { Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useVcsInfo } from '../../hooks/use-vcs-info';
import { ContextBarAgent } from './context-bar-agents';
import { ContextBarTodo } from './context-bar-todo';
import { ContextBarSkill } from './context-bar-skill';
import { ContextBarMcp } from './context-bar-mcp';
import { ContextBarModel } from './context-bar-model';
import { ContextBarCommand } from './context-bar-command';

export const ContextBar = memo(function ContextBar() {
  const { data: vcs, refetch, isFetching } = useVcsInfo();

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 6 }}
        className="pb-1 pt-2">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => refetch()}
          disabled={isFetching}
          className="flex-row items-center gap-1 rounded-full bg-[#f6f3f1] px-2.5 py-1">
          <MaterialIcons name="account-tree" size={14} color="#5e5c54" />
          <Text className="text-xs text-[#5e5c54]">{vcs?.default_branch}</Text>
        </TouchableOpacity>
        <ContextBarModel />
        <ContextBarAgent />
        <ContextBarTodo />
        <ContextBarSkill />
        <ContextBarMcp />
        <ContextBarCommand />
      </ScrollView>
    </>
  );
});
