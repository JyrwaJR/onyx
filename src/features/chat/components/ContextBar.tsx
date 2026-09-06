import { memo, useRef, useState } from 'react';
import { Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useVcsInfo } from '../hooks/use-vcs-info';
import { TodoModal } from './TodoModal';

type ContextBarProps = {
  onToggleAgent: (value: 'build' | 'plan') => void;
  sessionId: string;
};

export const ContextBar = memo(function ContextBar({ onToggleAgent, sessionId }: ContextBarProps) {
  const { data: vcs, refetch, isFetching } = useVcsInfo();
  const [agent, setAgent] = useState<'build' | 'plan'>('plan');
  const todoModalRef = useRef<BottomSheetModal>(null);

  const toggleAgent = () => {
    const selectedAgent = agent === 'build' ? 'plan' : 'build';
    setAgent(selectedAgent);
    onToggleAgent(selectedAgent);
  };

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
          onPress={toggleAgent}
          className="flex-row items-center gap-1 rounded-full bg-[#f6f3f1] px-2.5 py-1">
          <MaterialIcons name="support-agent" size={14} color="#5e5c54" />
          <Text className="text-xs text-[#5e5c54]">Agent: {agent.toUpperCase()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => todoModalRef.current?.present()}
          className="flex-row items-center gap-1 rounded-full bg-[#f6f3f1] px-2.5 py-1">
          <MaterialIcons name="checklist" size={14} color="#5e5c54" />
          <Text className="text-xs text-[#5e5c54]">Todo</Text>
        </TouchableOpacity>
      </ScrollView>

      <TodoModal ref={todoModalRef} sessionId={sessionId} />
    </>
  );
});
