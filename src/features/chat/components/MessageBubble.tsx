import { View, Text, TouchableOpacity, Alert } from 'react-native';
import type { Message, ContentBlock } from '../../../shared/api/types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ToolCallBlock } from './ToolCallBlock';

interface MessageBubbleProps {
  message: Message;
  onDelete?: (messageId: string) => void;
}

function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return date.toLocaleDateString();
}

function renderContentBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case 'text':
      return <MarkdownRenderer key={index} content={block.text} />;
    case 'tool-invocation':
      return <ToolCallBlock key={index} block={block} />;
    case 'tool-result':
      return (
        <View key={index} className="my-1 rounded bg-gray-100 p-2">
          <Text className="text-xs text-gray-500">Tool Result</Text>
          <Text className="mt-1 text-xs text-gray-600" selectable>
            {typeof block.result === 'string'
              ? block.result
              : JSON.stringify(block.result)}
          </Text>
        </View>
      );
    default:
      return null;
  }
}

/**
 * Message bubble with user/AI alignment and long-press delete.
 *
 * @param message - The message to display.
 * @param onDelete - Optional callback for deleting user messages.
 */
export function MessageBubble({ message, onDelete }: MessageBubbleProps) {
  const isUser = message.role === 'user';

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
      <View
        className={`rounded-2xl px-4 py-3 ${
          isUser ? 'bg-indigo-600' : 'bg-gray-100'
        }`}>
        {message.content.map((block, index) => (
          <View
            key={index}
            className={isUser ? 'text-white' : 'text-gray-900'}>
            {renderContentBlock(block, index)}
          </View>
        ))}
      </View>
      <Text
        className={`mt-1 text-xs text-gray-400 ${
          isUser ? 'text-right' : 'text-left'
        }`}>
        {getRelativeTime(message.createdAt)}
      </Text>
    </TouchableOpacity>
  );
}
