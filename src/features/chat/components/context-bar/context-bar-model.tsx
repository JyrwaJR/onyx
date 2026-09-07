import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ModelSheet } from '../sheets/ModelSheet';
import { useChatStore } from '../../store/chat-store';

export const ContextBarModel = () => {
  const ref = useRef<BottomSheetModal>(null);
  const model = useChatStore((state) => state.settings.selectedModel);
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => ref.current?.present()}
        className="flex-row items-center gap-1 rounded-md bg-[#f6f3f1] px-2.5 py-1">
        <MaterialIcons name="model-training" size={14} color="#5e5c54" />
        <Text className="text-xs text-[#5e5c54]">Model: {model?.name ?? 'Default'}</Text>
      </TouchableOpacity>
      <ModelSheet ref={ref} />
    </>
  );
};
