import { useState, useRef } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@lib/cn';

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
  const inputRef = useRef<React.ComponentRef<typeof Input>>(null);

  const handleSend = () => {
    const trimmed = text.trim();

    if (!trimmed || disabled || sending) return;

    onSend(trimmed);
    setText('');
  };

  const canSend = text.trim().length > 0 && !disabled && !sending;

  return (
    <View className="border-t border-hairline bg-canvas px-4 py-3">
      <View className="flex-wrap items-end gap-2">
        <Input
          ref={inputRef}
          className="max-h-[132px] min-h-11 flex-1"
          placeholder="Type a message..."
          multiline
          numberOfLines={1}
          maxLength={10000}
          value={text}
          onChangeText={setText}
          editable={!disabled && !sending}
          onSubmitEditing={handleSend}
        />

        <TouchableOpacity
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.7}
          className={cn(
            'h-11 w-11 shrink-0 items-center justify-center rounded-full',
            canSend ? 'bg-primary' : 'bg-hairline'
          )}>
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <View
              className={cn(
                'h-0 w-0',
                'border-b-[6px] border-l-[8px] border-t-[6px]',
                'border-b-transparent border-t-transparent',
                canSend ? 'border-l-on-primary' : 'border-l-muted-foreground'
              )}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
