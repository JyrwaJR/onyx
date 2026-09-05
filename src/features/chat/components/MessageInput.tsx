import { useState, useRef } from 'react';
import { View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRunShellCommand } from '../hooks';
import { useSendCommand } from '@/shared/hooks/use-send-command';
import { Ternary } from '@/shared/components/ui/ternary';

interface MessageInputProps {
  onSend: (content: string) => void;
  sessionId: string;
  agent: string;
  disabled?: boolean;
}

/**
 * Text input with auto-grow and send button.
 */
export function MessageInput({ onSend, sessionId, agent, disabled }: MessageInputProps) {
  const [text, setText] = useState('');
  const [isCommand, setIsCommand] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const runShell = useRunShellCommand(sessionId);
  const { mutate: sendCommand, isPending: isPendingCommand } = useSendCommand();

  const handleSend = () => {
    const trimmed = text.trim();

    if (!trimmed || disabled) return;

    onSend(trimmed);
    setText('');
  };

  const toggleCommand = () => {
    setIsCommand((prev) => !prev);
  };

  const handleShellCommand = () => {
    if (isPendingCommand) {
      return;
    }

    const trimmed = text.trim();

    if (trimmed === '') {
      toggleCommand();
      return;
    }

    if (!trimmed) {
      return;
    }
    if (disabled) {
      return;
    }
    if (!sessionId) {
      return;
    }

    runShell.mutate({ command: trimmed, agent });
    setText('');
  };

  const handleCommand = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      toggleCommand();
      return;
    }

    const contentWithoutSlash = trimmed.slice(1).trim();
    const spaceIndex = contentWithoutSlash.indexOf(' ');

    let command: string;
    let args: string;

    if (spaceIndex === -1) {
      command = contentWithoutSlash;
      args = '';
    } else {
      command = contentWithoutSlash.slice(0, spaceIndex);
      args = contentWithoutSlash.slice(spaceIndex + 1).trim();
    }

    if (disabled) {
      return;
    }
    if (!sessionId) {
      return;
    }

    sendCommand({ agent, command: command, sessionId, args });
    setText('');
  };

  const canSend = text.trim().length > 0 && !disabled;
  const canRunShell = !disabled && !!sessionId;

  return (
    <View className="px-2 pt-1">
      <View className="flex-row items-end gap-1 rounded-md border border-primary-fixed bg-[#ebe8e5] p-1.5 ">
        <TouchableOpacity
          className="h-9 w-9 items-center justify-center rounded-md"
          disabled
          accessibilityLabel="Attach file">
          <MaterialIcons name="attach-file" size={20} color="#5e5c54" />
        </TouchableOpacity>

        <Ternary
          condition={isCommand}
          truthy={
            <TouchableOpacity
              className="h-9 w-9 items-center justify-center rounded-md"
              onPress={handleCommand}
              disabled={!canRunShell || runShell.isPending}
              accessibilityLabel="Run as shell command">
              {isPendingCommand ? (
                <ActivityIndicator size="small" color="#5e5c54" />
              ) : (
                <MaterialIcons name="keyboard-command-key" size={20} color="#5e5c54" />
              )}
            </TouchableOpacity>
          }
          falsy={
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
          }
        />

        <TextInput
          className="max-h-[120px] min-h-[36px] flex-1 px-1 py-1.5 text-end text-sm text-[#1c1c1a]"
          placeholder="Ask Onyx or type '/' for commands..."
          placeholderTextColor="#5e5c54"
          placeholderClassName="text-end"
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
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.8}
          className="h-9 w-9 items-center justify-center rounded-md bg-[#8f482f]"
          accessibilityLabel="Send message">
          <MaterialIcons name="arrow-upward" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
