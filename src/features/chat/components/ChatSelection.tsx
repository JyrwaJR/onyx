import { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/**
 * Renders an interactive question with multiple selectable options.
 * Used to prompt the user for input during chat sessions.
 */
type ChatSelectionProps = {
  question: string;
  options: string[];
  onSelect: (option: string) => void;
};

export const ChatSelection = memo(function ChatSelection({
  question,
  options,
  onSelect,
}: ChatSelectionProps) {
  return (
    <View className="gap-3 p-4">
      <Text className="text-base font-semibold text-[#54433e]">{question}</Text>
      <View className="gap-2">
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option)}
            className="rounded-lg border border-[#d6d3d0] bg-[#f6f3f1] p-3 active:bg-[#edeae8]">
            <Text className="text-sm font-medium text-[#54433e]">{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});
