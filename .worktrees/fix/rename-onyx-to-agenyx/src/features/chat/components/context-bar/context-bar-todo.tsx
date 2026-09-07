import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { TodoModal } from '../sheets/TodoModal';
import { useRef } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const ContextBarTodo = () => {
  const ref = useRef<BottomSheetModal>(null);
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => ref.current?.present()}
        className="flex-row items-center gap-1 rounded-md bg-[#f6f3f1] px-2.5 py-1">
        <MaterialIcons name="checklist" size={14} color="#5e5c54" />
        <Text className="text-xs text-[#5e5c54]">Todo</Text>
      </TouchableOpacity>
      <TodoModal ref={ref} />
    </>
  );
};
