import { memo } from 'react';
import { View, Text } from 'react-native';
import type { V2Message } from '../../../shared/api/types';
import { formatDate } from '@/shared/utils/helpers/format';

interface UserMessageProps {
  message: V2Message;
}

/**
 * User message bubble aligned to the right with coral background.
 *
 * @param message - The user message to render.
 */
export const UserMessage = memo(function UserMessage({ message }: UserMessageProps) {
  const isPending = message.status === 'pending';
  const isSending = message.status === 'sending';

  return (
    <View className="mb-4 ml-8 items-end">
      <View className={`rounded-xl bg-[#8f482f] p-4 ${isPending || isSending ? 'opacity-50' : ''}`}>
        <Text className="text-sm leading-relaxed text-white">{message.text}</Text>
      </View>
      <Text className="mr-1 mt-1 text-[11px] text-[#5e5c54]">
        {formatDate(message.time.created)}
      </Text>
    </View>
  );
});
