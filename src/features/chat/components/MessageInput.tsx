import { useState, useRef } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRunShellCommand } from '../hooks';
import { useLocalSearchParams } from 'expo-router';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  sending?: boolean;
}

/**
 * Text input with auto-grow and send button.
 */
export function MessageInput({ onSend, disabled, sending }: MessageInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const runShell = useRunShellCommand(sessionId ?? '');

  const handleSend = () => {
    const trimmed = text.trim();

    if (!trimmed || disabled || sending) return;

    onSend(trimmed);
    setText('');
  };

  const handleShellCommand = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled || sending || !sessionId) return;

    runShell.mutate({ command: trimmed, agent: 'build' });
    setText('');
  };

  const canSend = text.trim().length > 0 && !disabled && !sending;

  return (
    <View className="px-4 pt-1">
      <View className="flex-row items-end justify-center gap-1 rounded-md border border-primary-fixed bg-[#ebe8e5] p-1.5 ">
        <TouchableOpacity
          className="h-9 w-9 items-center justify-center rounded-md"
          disabled
          accessibilityLabel="Attach file">
          <MaterialIcons name="attach-file" size={20} color="#5e5c54" />
        </TouchableOpacity>

        <TouchableOpacity
          className="h-9 w-9 items-center justify-center rounded-md"
          onPress={handleShellCommand}
          disabled={!canSend || !sessionId}
          accessibilityLabel="Run as shell command">
          <MaterialIcons name="terminal" size={20} color="#5e5c54" />
        </TouchableOpacity>

        <TextInput
          className="max-h-[120px] min-h-[36px] flex-1 px-1 py-1.5 text-sm text-[#1c1c1a]"
          placeholder="Ask Onyx or type '/' for commands..."
          placeholderTextColor="#5e5c54"
          ref={inputRef}
          returnKeyType="default"
          multiline
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity
          className="h-9 w-9 items-center justify-center rounded-md"
          disabled
          accessibilityLabel="Voice input">
          <MaterialIcons name="mic" size={20} color="#5e5c54" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSend()}
          disabled={!canSend}
          activeOpacity={0.8}
          className="h-9 w-9 items-center justify-center rounded-xl bg-[#8f482f]"
          accessibilityLabel="Send message">
          <MaterialIcons name="arrow-upward" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
