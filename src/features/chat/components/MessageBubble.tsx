import { View, Text, TouchableOpacity, Alert } from 'react-native';
import type { MessageContentBlock, V2Message } from '../../../shared/api/types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ToolCallBlock } from './ToolCallBlock';

interface MessageBubbleProps {
  message: V2Message;
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

function renderBlock(block: MessageContentBlock, index: number) {
  switch (block.type) {
    case 'text':
      return <MarkdownRenderer key={index} content={block.text} />;
    case 'tool':
      return <ToolCallBlock key={index} block={block} />;
    case 'reasoning':
      return (
        <View key={index} className="my-1 rounded bg-surface-container-low p-2">
          <Text className="text-xs italic text-outline-variant">{block.text}</Text>
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
  const isUser = message.type === 'user';
  const blocks: MessageContentBlock[] = isUser
    ? message.text
      ? [{ type: 'text', id: 'text-0', text: message.text }]
      : []
    : (message.content ?? []);

  const handleLongPress = () => {
    if (!isUser || !onDelete) return;
    Alert.alert('Delete Message', 'Delete this message?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDelete(message.id),
      },
    ]);
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      activeOpacity={isUser ? 0.7 : 1}
      className={`mb-3 max-w-[85%] ${isUser ? 'self-end' : 'self-start'}`}>
      <View className={`rounded-2xl px-4 py-3 ${isUser ? 'bg-primary' : 'bg-surface-container'}`}>
        {blocks.map((block, index) => (
          <View key={index} className={isUser ? 'text-primary-on' : 'text-on-surface'}>
            {renderBlock(block, index)}
          </View>
        ))}
      </View>
      <Text className={`mt-1 text-xs text-outline-variant ${isUser ? 'text-right' : 'text-left'}`}>
        {getRelativeTime(message.time?.created)}
      </Text>
    </TouchableOpacity>
  );
}
