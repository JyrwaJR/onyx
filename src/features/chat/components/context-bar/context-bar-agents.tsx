import { MaterialIcons } from '@expo/vector-icons';
import { useRef } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { AgentSheet } from '../sheets/AgentSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useChatStore } from '../../store/chat-store';

export const ContextBarAgent = () => {
  const ref = useRef<BottomSheetModal>(null);
  const agent = useChatStore((state) => state.settings.selectedAgent);
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => ref.current?.present()}
        className="flex-row items-center gap-1 rounded-full bg-[#f6f3f1] px-2.5 py-1">
        <MaterialIcons name="support-agent" size={14} color="#5e5c54" />
        <Text className="text-xs text-[#5e5c54]">Agent: {agent?.id ?? 'Default'}</Text>
      </TouchableOpacity>
      <AgentSheet ref={ref} />
    </>
  );
};
