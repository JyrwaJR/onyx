import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Ternary } from '@/shared/components/ui/ternary';
import { useSessionStatus } from '@/shared/hooks';
import { useChatStore } from '../../store/chat-store';
import { useAbortSession } from '../../hooks';

interface ChatSendProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export const ChatSentButton = ({ onSend }: ChatSendProps) => {
  const sessionId = useChatStore((state) => state.context.activeSessionId);
  const { prompt: text, setPrompt: setText } = useChatStore();
  const { isBusy } = useSessionStatus({ sessionId });
  const { mutate } = useAbortSession();
  const handleAbortSession = () => {
    mutate();
  };

  const handleSend = () => {
    const trimmed = text.trim();

    if (!trimmed) return;

    onSend(trimmed);
    setText('');
  };

  return (
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
  );
};
