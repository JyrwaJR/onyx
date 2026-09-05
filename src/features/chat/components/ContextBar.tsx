import { memo } from 'react';
import { Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useVcsInfo } from '../hooks/use-vcs-info';

/**
 * Horizontal scrollable action bar above the chat input.
 *
 * Static buttons only: the v1 server has no session-context endpoint, so
 * file chips are not fetched. "Context" and "Repo file" remain as
 * placeholder actions for future functionality.
 */
type ContextBarProps = {
  sessionId: string;
};

export const ContextBar = memo(function ContextBar({ sessionId }: ContextBarProps) {
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
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center gap-1 rounded-full bg-[#f6f3f1] px-2.5 py-1">
          <MaterialIcons name="alternate-email" size={14} color="#5e5c54" />
          <Text className="text-xs text-[#5e5c54]">Repo file</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
});
