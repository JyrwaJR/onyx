import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { McpSheet } from '../sheets/McpSheet';

export const ContextBarMcp = () => {
  const ref = useRef<BottomSheetModal>(null);
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => ref.current?.present()}
        className="flex-row items-center gap-1 rounded-md bg-[#f6f3f1] px-2.5 py-1">
        <MaterialIcons name="interpreter-mode" size={14} color="#5e5c54" />
        <Text className="text-xs text-[#5e5c54]">Mcp</Text>
      </TouchableOpacity>
      <McpSheet ref={ref} />
    </>
  );
};
