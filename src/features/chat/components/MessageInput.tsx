import { useRef } from 'react';
import { View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAbortSession, useRunShellCommand } from '../hooks';
import { Ternary } from '@/shared/components/ui/ternary';
import { useSessionStatus } from '@/shared/hooks';
import { useChatStore } from '../store/chat-store';
import { ChatAutocompleteInput } from './chat-auto-complete';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

/**
 * Text input with auto-grow and send button.
 */

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const sessionId = useChatStore((state) => state.context.activeSessionId);
  const isStreaming = useChatStore((s) => s.chat.isStreaming);
  const { prompt: text, setPrompt: setText } = useChatStore();
  const inputRef = useRef<TextInput>(null);
  const runShell = useRunShellCommand();
  const { isBusy } = useSessionStatus({ sessionId, isStreaming });
  const { mutate } = useAbortSession();
  const handleAbortSession = () => {
    mutate();
  };

  const handleSend = () => {
    const trimmed = text.trim();

    if (!trimmed || disabled) return;

    onSend(trimmed);
    setText('');
  };

  const handleShellCommand = () => {
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }
    if (disabled) {
      return;
    }
    if (!sessionId) {
      return;
    }

    runShell.mutate({ command: trimmed });
    setText('');
  };

  const canRunShell = !disabled && !!sessionId;

  return (
    <View className="px-2 pt-1">
      <View className="flex-row items-end gap-1 rounded-md border border-primary-fixed bg-[#ebe8e5] p-1.5 ">
        <TouchableOpacity
          className="h-9 w-9 items-center justify-center rounded-md"
          onPress={handleShellCommand}
          disabled={!canRunShell || runShell.isPending}
          accessibilityLabel="Run as shell command">
          {runShell.isPending ? (
            <ActivityIndicator size="small" color="#5e5c54" />
          ) : (
            <MaterialIcons name="terminal" size={20} color="#5e5c54" />
          )}
        </TouchableOpacity>

        <ChatAutocompleteInput
          className="max-h-[120px] min-h-[36px] flex-1 px-1 py-1.5 text-end text-sm text-[#1c1c1a]"
          placeholder="Ask Agenyx or type '/' for commands..."
          placeholderTextColor="#5e5c54"
          placeholderClassName="text-end"
          ref={inputRef}
          returnKeyType="default"
          multiline
          value={text}
          onChangeText={setText}
        />

        <Ternary
          condition={isBusy}
          truthy={
            <TouchableOpacity
              onPress={handleAbortSession}
              activeOpacity={0.8}
              className="h-9 w-9 items-center justify-center rounded-xl bg-[#8f482f]"
              accessibilityLabel="Send message">
              <MaterialIcons name="stop" size={18} color="#ffffff" />
            </TouchableOpacity>
          }
          falsy={
            <TouchableOpacity
              onPress={handleSend}
              onLongPress={handleAbortSession}
              activeOpacity={0.8}
              className="h-9 w-9 items-center justify-center rounded-xl bg-[#8f482f]"
              accessibilityLabel="Send message">
              <MaterialIcons name="arrow-upward" size={18} color="#ffffff" />
            </TouchableOpacity>
          }
        />
      </View>
    </View>
  );
}
