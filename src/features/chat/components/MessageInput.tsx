import { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  sending?: boolean;
}

/**
 * Text input with auto-grow and send button.
 *
 * Uses Claude design system styling with cream canvas background
 * and coral send button.
 *
 * @param onSend - Callback when the user sends a message.
 * @param disabled - Whether the input is disabled.
 * @param sending - Whether a message is currently being sent.
 */
export function MessageInput({ onSend, disabled, sending }: MessageInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    onSend(trimmed);
    setText('');
  };

  const canSend = text.trim().length > 0 && !disabled && !sending;

  return (
    <View className="border-t border-hairline bg-canvas px-4 py-3">
      <View className="flex-row items-end gap-2">
        <TextInput
          ref={inputRef}
          className="max-h-[132px] min-h-[44px] flex-1 rounded-xl border border-hairline bg-surface-soft px-4 py-3 text-base text-ink"
          placeholder="Type a message..."
          placeholderTextColor="#8e8b82"
          multiline
          numberOfLines={1}
          maxLength={10000}
          value={text}
          onChangeText={setText}
          editable={!sending}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />

        <TouchableOpacity
          onPress={handleSend}
          disabled={!canSend}
          className={`h-11 w-11 items-center justify-center rounded-full ${
            canSend ? 'bg-primary' : 'bg-hairline'
          }`}
          activeOpacity={0.7}>
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <View className="h-0 w-0 border-b-[6px] border-l-[8px] border-t-[6px] border-b-transparent border-l-on-primary border-t-transparent" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
