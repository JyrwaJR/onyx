import { memo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { QuestionInfo } from '../types';

/** A single question posed by the assistant. Mirrors the server `QuestionInfo`. */
export type ChatQuestion = QuestionInfo;

type ChatSelectionProps = {
  /** The question data rendered as a selectable list. */
  question: ChatQuestion;
  /**
   * Callback fired with the selected option labels once the question is
   * answered. Single-select questions fire immediately on tap; multi-select
   * and custom questions fire when the user submits.
   */
  onSelect: (labels: string[]) => void;
  /** Callback fired when the user dismisses/rejects the question. */
  onReject?: () => void;
};

/**
 * Renders an interactive chat question with multiple selectable options.
 *
 * Displays the question text and a tappable list of option buttons (with
 * optional descriptions). Single-select questions submit immediately on
 * tap; `multiple` questions let the user toggle several options before
 * submitting; `custom` questions expose a text input for a free-form
 * answer. An optional dismiss button rejects the whole question request.
 *
 * Used to prompt the user for input during chat sessions when the assistant
 * emits a `question.asked` SSE event.
 */
export const ChatSelection = memo(function ChatSelection({
  question: chatQuestion,
  onSelect,
  onReject,
}: ChatSelectionProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [customAnswer, setCustomAnswer] = useState('');

  const isMultiple = chatQuestion.multiple === true;
  const isCustom = chatQuestion.custom === true;

  const toggleOption = (label: string) => {
    if (isMultiple) {
      setSelected((prev) =>
        prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
      );
    } else {
      onSelect([label]);
    }
  };

  const submit = () => {
    const labels = isCustom ? [customAnswer.trim()] : selected;
    if (labels.length === 0 || labels.some((l) => !l)) return;
    onSelect(labels);
  };

  const isSubmitEnabled = isCustom
    ? customAnswer.trim().length > 0
    : isMultiple
      ? selected.length > 0
      : true;

  return (
    <View className="gap-3 rounded-md border border-[#dac1ba]/30 bg-[#fcf9f6] p-4">
      <View className="flex-row items-start justify-between gap-2">
        <Text className="flex-1 text-base font-semibold text-[#54433e]">
          {chatQuestion.header || chatQuestion.question}
        </Text>
        {onReject && (
          <TouchableOpacity
            onPress={onReject}
            accessibilityLabel="Dismiss question"
            className="rounded-full p-1 active:bg-[#edeae8]">
            <MaterialIcons name="close" size={18} color="#8f482f" />
          </TouchableOpacity>
        )}
      </View>
      <Text className="text-sm text-[#5e5c54]">{chatQuestion.question}</Text>
      <View className="gap-2">
        {chatQuestion.options.map((option) => {
          const isSelected = selected.includes(option.label);
          return (
            <TouchableOpacity
              key={option.label}
              onPress={() => toggleOption(option.label)}
              className={`rounded-md border p-3 active:bg-[#edeae8] ${
                isSelected ? 'border-[#8f482f] bg-[#f3e3dd]' : 'border-[#d6d3d0] bg-[#f6f3f1]'
              }`}>
              <Text className="text-sm font-medium text-[#54433e]">{option.label}</Text>
              {option.description ? (
                <Text className="mt-0.5 text-xs text-[#5e5c54]">{option.description}</Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
      {isCustom && (
        <TextInput
          value={customAnswer}
          onChangeText={setCustomAnswer}
          placeholder="Type your answer…"
          placeholderTextColor="#a8a29a"
          className="rounded-md border border-[#d6d3d0] bg-[#f6f3f1] p-3 text-sm text-[#54433e]"
        />
      )}
      {(isMultiple || isCustom) && (
        <TouchableOpacity
          onPress={submit}
          disabled={!isSubmitEnabled}
          accessibilityLabel="Submit answer"
          className={`rounded-md p-3 ${isSubmitEnabled ? 'bg-[#8f482f]' : 'bg-[#d6d3d0]'}`}>
          <Text className="text-center text-sm font-semibold text-[#fff]">Send answer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});
