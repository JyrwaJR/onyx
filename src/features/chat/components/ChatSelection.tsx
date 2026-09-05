import { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/**
 * A question posed by the assistant that expects the user to pick from
 * a set of predefined options. Mirrors the `selection` content block
 * shape from the API types.
 */
export type ChatQuestion = {
  id: string;
  question: string;
  options: string[];
};

type ChatSelectionProps = {
  /** The question data rendered as a selectable list. */
  question: ChatQuestion;
  /** Callback fired when the user taps one of the available options. */
  onSelect: (option: string) => void;
};

/**
 * Renders an interactive chat question with multiple selectable options.
 * Displays the question text and a tappable list of option buttons.
 * Used to prompt the user for input during chat sessions when an
 * assistant message contains a `selection` content block.
 */
export const ChatSelection = memo(function ChatSelection({
  question: chatQuestion,
  onSelect,
}: ChatSelectionProps) {
  return (
    <View className="gap-3 p-4">
      <Text className="text-base font-semibold text-[#54433e]">{chatQuestion.question}</Text>
      <View className="gap-2">
        {chatQuestion.options.map((option) => (
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
