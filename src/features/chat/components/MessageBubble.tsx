import { View, Text, TouchableOpacity, Alert } from 'react-native';
import type { Message, MessagePart } from '../../../shared/api/types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ToolCallBlock } from './ToolCallBlock';

interface MessageBubbleProps {
  message: Message;
  onDelete?: (messageId: string) => void;
}

function getRelativeTime(ms?: number): string {
  if (!ms) return '';
  const now = Date.now();
  const diffMs = now - ms;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return new Date(ms).toLocaleDateString();
}

function renderPart(part: MessagePart, index: number) {
  switch (part.type) {
    case 'text':
      return <MarkdownRenderer key={index} content={part.text} />;
    case 'tool':
      return <ToolCallBlock key={index} part={part} />;
    case 'reasoning':
      return (
        <View key={index} className="my-1 rounded bg-surface-soft p-2">
          <Text className="text-xs italic text-muted-soft">{part.text}</Text>
        </View>
      );
    default:
      return null;
  }
}

/**
 * Message bubble with user/AI alignment and long-press delete.
 *
 * User messages appear on the right with coral background.
 * AI messages appear on the left with cream card background.
 *
 * @param message - The message to display.
 * @param onDelete - Optional callback for deleting user messages.
 */
export function MessageBubble({ message, onDelete }: MessageBubbleProps) {
  const isUser = message.info.role === 'user';

  const handleLongPress = () => {
    if (!isUser || !onDelete) return;
    Alert.alert('Delete Message', 'Delete this message?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDelete(message.info.id),
      },
    ]);
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      activeOpacity={isUser ? 0.7 : 1}
      className={`mb-3 max-w-[85%] ${isUser ? 'self-end' : 'self-start'}`}>
      <View className={`rounded-2xl px-4 py-3 ${isUser ? 'bg-primary' : 'bg-surface-card'}`}>
        {message.parts.map((part, index) => (
          <View key={index} className={isUser ? 'text-on-primary' : 'text-ink'}>
            {renderPart(part, index)}
          </View>
        ))}
      </View>
      <Text className={`mt-1 text-xs text-muted-soft ${isUser ? 'text-right' : 'text-left'}`}>
        {getRelativeTime(message.info.time.created)}
      </Text>
    </TouchableOpacity>
  );
}
