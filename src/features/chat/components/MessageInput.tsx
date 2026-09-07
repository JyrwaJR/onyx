import { useRef } from 'react';
import { View, TextInput } from 'react-native';
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
  const { prompt: text, setPrompt: setText } = useChatStore();
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    const trimmed = text.trim();

    if (!trimmed || disabled) return;

    onSend(trimmed);
    setText('');
  };

  return (
    <View className="px-2 pt-1">
      <View className="flex-row items-end gap-1 rounded-md border border-primary-fixed bg-[#ebe8e5] p-1.5 ">
        <ChatAutocompleteInput
          className="max-h-[120px] min-h-[36px] flex-1 px-1 py-1.5 text-end text-sm text-[#1c1c1a]"
          placeholder="Ask Agenyx or type '/' for commands..."
          placeholderTextColor="#5e5c54"
          placeholderClassName="text-end"
          ref={inputRef}
          returnKeyType="default"
          multiline
          value={text}
          onSend={handleSend}
          onChangeText={setText}
        />
      </View>
    </View>
  );
}
